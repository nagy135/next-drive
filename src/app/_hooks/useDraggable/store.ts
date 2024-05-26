import useTypedReducer from "../useTypedReducer";
import { Coordinates } from "./interfaces";

interface IState {
	elements?: {
		translate: Coordinates;
		initial: Coordinates;
		last: Coordinates;
		id: string;
		selected: boolean;
	};
	dragging: boolean;
}

const getInitialElementState = () => ({
	translate: { x: 0, y: 0 },
	initial: { x: 0, y: 0 },
	last: { x: 0, y: 0 }
});

export const initialState: IState = { dragging: false };

const reducer = {
	start: (id: string, coordinate: Coordinates, single?: boolean) => (
		state: IState
	): IState => {
		return {
			dragging: true,
			elements: {
				...getInitialElementState(),
				id,
				initial: coordinate,
				selected: true
			},
			...(single ? { id } : {})
		};
	},
	move: (id: string | string[], coordinate: Coordinates) => (
		state: IState
	): IState => {
		const elements = state.elements!;
		if (!state.elements) {
			return state;
		}

		return {
			...state,
			elements: {
				...elements,
				translate: {
					x: elements.last.x + coordinate.x - elements.initial.x,
					y: elements.last.y + coordinate.y - elements.initial.y
				}
			}
		};
	},
	stop: (id: string | string[]) => (state: IState): IState => {
		const elements = state.elements!;
		if (!state.elements) {
			return state;
		}

		return {
			elements: { ...elements, last: elements.translate },
			dragging: false
		};
	},

	clear: () => (): IState => initialState
};

const useStore = () => {
	return useTypedReducer(reducer, { ...initialState });
};

export default useStore;
