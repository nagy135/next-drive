"use client";

import * as React from "react";

import Blocks from "./blocks";
import { useWindowSize } from "../_hooks/useWindowSize";
import { SelectFile } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { SessionProvider, useSession } from "next-auth/react"

type GridProps = {
	files: SelectFile[];
};

function GridInner({ files }: GridProps) {
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

function GridRefresh() {
	const session = useSession();
	const filesQuery = api.file.getAll.useQuery();
	const filesByUserQuery = api.file.getByUserId.useQuery(session.data?.user.id);
	const utils = api.useUtils();
	React.useEffect(() => {
		const intervalId = setInterval(utils.invalidate, 5000); // Fetch every 5 seconds

		utils.invalidate();
		console.log("refreshing");

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, []);
	if (session.data) {
		if (filesByUserQuery.data) {
			return <GridInner files={filesByUserQuery.data} />
		}
	} else {
		if (filesQuery.data) {
			return <GridInner files={filesQuery.data} />
		}
	}
}

export default function Grid() {
	return (
		<SessionProvider>
			<GridRefresh />
		</SessionProvider>
	)
}
