"use client";

import * as React from "react";

import useStore from "./store";

interface IProps {
	wrapperRef: React.RefObject<HTMLElement>;
	onDragStart?: (event: React.MouseEvent) => void;
	onDragEnd?: (event: React.MouseEvent) => void;
	single?: boolean;
}

export const isInside = (
	element: HTMLElement,
	coordinate: { left: number; right?: number; top: number; bottom?: number }
) => {
	const { left, right, bottom, top } = element.getBoundingClientRect();
	// if bottom and right not exist then it's a point
	if (!coordinate.right || !coordinate.bottom) {
		if (coordinate.left > right || coordinate.left < left) {
			return false;
		}

		if (coordinate.top > bottom || coordinate.top < top) {
			return false;
		}
	} else {
		if (
			coordinate.left < left ||
			coordinate.top < top ||
			coordinate.right! > right ||
			coordinate.bottom! > bottom
		) {
			return false;
		}
	}

	return true;
};

export const getOverflowAdjust = (
	element: HTMLElement,
	coordinate: { left: number; right: number; top: number; bottom: number }
) => {
	const { left, right, bottom, top } = element.getBoundingClientRect();

	let horizontallyAdjustable = true;
	let verticallyAdjustable = true;
	let leftAdjust = 0;
	let topAdjust = 0;

	// check if it's possible to accomodate horizontally
	if (
		(coordinate.left < left && coordinate.right > right) ||
		(coordinate.left > left && coordinate.right < right)
	) {
		horizontallyAdjustable = false;
	}

	// check if it's possible to accomodate vertically
	if (
		(coordinate.top < top && coordinate.bottom > bottom) ||
		(coordinate.top > top && coordinate.bottom < bottom)
	) {
		verticallyAdjustable = false;
	}

	if (verticallyAdjustable) {
		// above the level, push it down
		if (coordinate.top < top) {
			topAdjust = top - coordinate.top;
		} else {
			// below the level, push it up, that's why negative value
			topAdjust = bottom - coordinate.bottom;
		}
	}

	if (horizontallyAdjustable) {
		// towards the left, push it right
		if (coordinate.left < left) {
			leftAdjust = left - coordinate.left;
		} else {
			// towards the right, push it left
			leftAdjust = right - coordinate.right;
		}
	}

	return { left: leftAdjust, top: topAdjust };
};

const useDraggable = ({ wrapperRef, onDragStart, onDragEnd }: IProps) => {
	const [store, actions] = useStore();

	const dragging = React.useRef<string | null>(null);

	const stop = React.useCallback(() => {
		if (dragging.current) {
			actions.stop(dragging.current);
		}
		dragging.current = null;
	}, [actions]);

	const onMouseMove = React.useCallback(
		(event: any) => {
			if (
				wrapperRef.current &&
				!isInside(wrapperRef.current!, {
					left: event.clientX,
					top: event.clientY
				})
			) {
				// if it reaches either side of end, stop the dragging
				// put the item back
				if (onDragEnd) {
					onDragEnd(event);
				}
				stop();
				return;
			}
			if (dragging.current) {
				actions.move([dragging.current], {
					x: event.clientX,
					y: event.clientY
				});
			}
		},
		[actions, onDragEnd, wrapperRef, stop]
	);

	const onMouseUp = React.useCallback(
		(event: any) => {
			if (onDragEnd) {
				onDragEnd(event);
			}
			if (dragging.current) {
				actions.stop([dragging.current]);
			}
		},
		[actions, onDragEnd]
	);

	const onMouseDown = React.useCallback(
		(event: React.MouseEvent, id: string) => {
			const coordinates = { x: event.clientX, y: event.clientY };
			event.stopPropagation();
			if (onDragStart) {
				onDragStart(event);
			}

			dragging.current = id;
			actions.start(id, coordinates, true);
		},
		[actions, onDragStart]
	);

	const clearStore = React.useCallback(() => {
		actions.clear();
		dragging.current = null;
	}, [actions]);

	return {
		store,
		handlers: { onMouseDown, onMouseMove, onMouseUp },
		clearStore
	};
};

export default useDraggable;
