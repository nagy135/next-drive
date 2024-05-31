"use client";

import * as React from "react";

import Blocks from "./blocks";
import { useWindowSize } from "../_hooks/useWindowSize";
import { SelectFile } from "~/server/db/schema";

type GridProps = {
	files: SelectFile[];
};

export default function Grid({ files }: GridProps) {
	const [totalBlocks, setTotalBlocks] = React.useState(0);
	const size = useWindowSize();

	React.useLayoutEffect(() => {
		setTotalBlocks(files.length);
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
				files={files}
			/>
		</div>
	);
}
