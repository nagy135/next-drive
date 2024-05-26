"use client";

import * as React from "react";

import Blocks from "./blocks";

export default function App() {
	const [totalBlocks, setTotalBlocks] = React.useState(22);
	const [rowSize, setRowSize] = React.useState(7);
	const [multiWidth, setMultiWidth] = React.useState(false);
	return (
		<div className="App w-full m-auto">
			<Blocks
				key={`${rowSize}-${multiWidth}-${totalBlocks}`}
				rowSize={rowSize}
				multiWidth={multiWidth}
				totalBlocks={totalBlocks}
			/>
		</div>
	);
}
