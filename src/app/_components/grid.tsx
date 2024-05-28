"use client";

import * as React from "react";

import Blocks from "./blocks";
import { useWindowSize } from "../_hooks/useWindowSize";

type GridProps = {
	filenames: string[];
};

export default function Grid({ filenames }: GridProps) {
	const [totalBlocks, setTotalBlocks] = React.useState(0);
	const size = useWindowSize();

	React.useLayoutEffect(() => {
		setTotalBlocks(filenames.length);
	}, []);

	const width = size[0] as number;
	const rowSize = Math.floor(width / 132);

	return (
		<div className="w-full m-auto">
			<Blocks
				key={`${rowSize}-${totalBlocks}`}
				rowSize={rowSize}
				multiWidth={false}
				totalBlocks={totalBlocks}
				filenames={filenames}
			/>
		</div>
	);
}
