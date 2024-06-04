"use client";

import * as React from "react";
import styled from "styled-components";
import { useSprings, animated } from "react-spring";

import AppBlock from "./appBlock";
import { animate, getIndex, getPositionToIndexMapping } from "./utils";
import { Stack } from "~/app/utils/styled";
import useDraggable from "~/app/_hooks/useDraggable";
import { SelectFile } from "~/server/db/schema";
import { TooltipProvider } from "~/components/ui/tooltip";
import { api } from "~/trpc/react";
import Spinner from "./spinner";

export interface IAppList {
	file: SelectFile;
	width: number;
	position: number;
}

const AnimatedWrapper = styled(animated.div)`
  position: absolute;
  border-radius: 4px;
  background: transparent;
`;

const AppWrapper = styled(Stack)`
  flex-grow: 2;
  overflow: auto;
  flex-wrap: wrap;
	padding-top: 3em;
  position: relative;
`;

interface IProps {
	rowSize: number;
	multiWidth: boolean;
	totalBlocks: number;
	files: SelectFile[];
}

const Blocks = ({ rowSize, multiWidth, totalBlocks, files }: IProps) => {
	const [isSyncing, setIsSyncing] = React.useState(false);
	const updateMutation = api.file.update.useMutation({
		onSuccess: () => {
			setIsSyncing(false);
		},
		onMutate: () => {
			setIsSyncing(true);
		},
	})
	const getApps = React.useCallback(() => {
		// @ts-ignore
		const appsZ: IAppList[] = totalBlocks > 0 ?
			files.map((file, i) => ({
				file: file,
				width: Math.random() > 0.5 ? (multiWidth ? 2 : 1) : 1,
				position: -1,
			}))
			: [];

		return getIndex(appsZ, rowSize);
	}, [rowSize, multiWidth, totalBlocks]);
	const apps = React.useMemo(getApps, [getApps]);
	const order = React.useRef(
		apps.map((a, index) => ({ index, width: a.width, position: a.position }))
	);
	const positionToIndexMap = React.useRef(
		getPositionToIndexMapping(order.current, rowSize)
	);
	// const positions = React.useRef(apps.map((a) => a.position));
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const startPosition = React.useRef({ x: 0, y: 0 });
	const draggingIndex = React.useRef(-1);

	const [springs, setSprings] = useSprings(
		apps.length,
		animate(rowSize, order.current)
	);

	const onDragStart = React.useCallback((event: React.MouseEvent) => {
		startPosition.current = {
			x: event.clientX,
			y: event.clientY
		};
	}, []);

	const { store, handlers, clearStore } = useDraggable({
		wrapperRef,
		single: true,
		onDragStart
	});

	React.useEffect(() => {
		if (!store?.elements?.id) {
			return;
		}
		const gap = {
			x: store.elements.translate.x,
			y: store.elements.translate.y
		};

		// draggingIndex.current will contain the current index, where index is intial
		// render index, which might differ in order array
		// so we need position of that element in order array
		const prevIndex = order.current.findIndex(
			(a) => draggingIndex.current === a.index
		);
		const currentElement = order.current[prevIndex];
		// @ts-ignore
		const oldPosition = currentElement.position;

		// down-up : 3
		let y = Math.round(gap.y / 120);
		if (Math.abs(y) > 0.5) {
			y = y * rowSize;
		}

		// this might lead to problem.
		const x = Math.round(gap.x / 120) * (gap.x > 0 ? 1 : 1);

		const z = y + x + oldPosition;
		// how much block has moved
		let newPosition = Math.round(z);
		const movement = newPosition - oldPosition > 0 ? "FORWARD" : "BACKWARD";

		let newOrder = [...order.current];

		const changeOrder = (
			prev: number,
			dirtyNewIndex: number,
			newPosition: number,
			width?: number
		) => {
			let newI = dirtyNewIndex;
			// only elements with width 1
			// are allowed to attached in empty spaces
			// reason being, allowing everything will
			// complicate the process a lot, but ROI will be very low
			if (dirtyNewIndex === -1 && width === 1) {
				// search in the order where it fits as per the new position

				let i =
					newOrder.findIndex((a) => a.position > newPosition) +
					(movement === "BACKWARD" ? 0 : -1);

				if (i < 0) {
					i = order.current.length - 1;
				}

				const newElementProps = {
					...newOrder[prev],
					position: newPosition
				};
				newI = i;
				// remove it from previous index and insert to new index
				newOrder.splice(prev, 1);
				// @ts-ignore
				newOrder.splice(newI, 0, newElementProps);
				newOrder = getIndex(newOrder, rowSize);
			} else {
				// remove it from previous index and insert to new index
				newOrder.splice(prev, 1);
				// @ts-ignore
				newOrder.splice(newI, 0, { ...order.current[prev] });
				// get latest positions as per there width
				newOrder = getIndex(newOrder, rowSize);
			}
		};

		// if the element has some width, this will same as prevIndex
		let newIndex = positionToIndexMap.current[newPosition];

		if (newPosition < 0) {
			// do nothing
			newIndex = prevIndex;
		} else if (prevIndex !== newIndex) {
			// these are special checks in case of different width
			// check new element width
			// newIndex can't be used directly here
			const newPositionElement =
				// @ts-ignore
				order.current[positionToIndexMap.current[newPosition]];
			// if element exist and it has width more than 2
			// if it doesn't "empty space"
			// them move block freely in else case
			if (newPositionElement && newPositionElement.width > 1) {
				if (Math.abs(newPosition - oldPosition) < newPositionElement.width) {
					// do nothing
				} else {
					// @ts-ignore
					changeOrder(prevIndex, newIndex, newPosition, currentElement.width);
				}
			} else {
				// @ts-ignore
				changeOrder(prevIndex, newIndex, newPosition, currentElement.width);
			}
		}

		setSprings(
			animate(
				rowSize,
				newOrder,
				order.current,
				gap.x,
				gap.y,
				draggingIndex.current,
				store.dragging
			)
		);
		if (!store.dragging) {
			clearStore();

			let performSync = false;

			for (let i = 0; i < newOrder.length; i++) {
				const before = order.current[i];
				const after = newOrder[i];
				if (before && after) {
					if (before.index !== after.index) {
						performSync = true;
						break;
					}
				}
			}
			if (performSync) {
				console.log('performing sync')
				updateMutation.mutate(newOrder.map((a) => {
					const first = files[a.index] as SelectFile;
					const second = files[a.position] as SelectFile;
					return {
						id: first.id,
						order: second.order,
					}
				}));
			}

			order.current = newOrder;
			positionToIndexMap.current = getPositionToIndexMapping(
				order.current,
				rowSize
			);
		}
	}, [store, clearStore, setSprings, rowSize]);

	return (
		<Stack style={{ height: 400 }} className="h-full flex-col">
			{isSyncing && <div className="fixed flex p-3 gap-2 items-center bottom-0 left-0 text-lg">
				<Spinner />
				<div>syncing...</div>
			</div>}
			<AppWrapper ref={wrapperRef}>
				<TooltipProvider>
					{springs.map((props, i) => {
						// @ts-ignore
						const appCurrent = apps[i];
						if (!appCurrent) {
							return null;
						}
						const dragId = appCurrent.file.name;
						return (
							// @ts-ignore
							<AnimatedWrapper key={appCurrent.file.name} style={props}>
								<AppBlock
									{...handlers}
									onTouchMove={(event) => {
										handlers.onTouchMove(event);
									}}
									onTouchStart={(event) => {
										draggingIndex.current = i;
										handlers.onTouchStart(event, dragId);
									}}
									onMouseDown={(event) => {
										draggingIndex.current = i;
										handlers.onMouseDown(event, dragId);
									}}
									style={{
										// @ts-ignore
										width: 128 * appCurrent.width - 8,
										height: 140,
										border: "1px solid #e5e7eb",
										touchAction: 'none'
										// @ts-ignore
									}}
									// @ts-ignore
									index={i}
									file={appCurrent.file}
								/>
							</AnimatedWrapper>
						);
					})}
				</TooltipProvider>
			</AppWrapper>
		</Stack>
	);
};

export default Blocks;
