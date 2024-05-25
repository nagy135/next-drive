"use client";

import Draggable from 'react-draggable';

const COLS = 10;
const ROWS = 10;
const CELLSIZE = 64;

function Item({ key, label, index }: { key: number; label: string; index: number }) {
	const row = Math.floor(index / COLS) * CELLSIZE;
	const col = index % COLS * CELLSIZE;
	return <Draggable
		axis="both"
		handle=".handle"
		defaultPosition={{ x: 0, y: 0 }}
		grid={[64, 64]}
		scale={1}
		bounds={"parent"}
	// onStart={this.handleStart}
	// onDrag={this.handleDrag}
	// onStop={this.handleStop}
	>
		<div className="bg-red-300 w-[64px] h-[64px] pointer handle">
			{label}
		</div>
	</Draggable>
}

export function Grid() {
	const items = Array.from({ length: 10 }, (_, i) => i);
	return (
		<div className="w-full h-128 relative text-black grid grid-cols-8">
			{items.map((item) => <Item key={item} index={item} label={item.toString()} />)}
		</div>
	);
}
