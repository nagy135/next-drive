"use client";

import * as React from "react";

import Blocks from "./blocks";
import { useWindowSize } from "../_hooks/useWindowSize";
import { SelectFile } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { SessionProvider, useSession } from "next-auth/react"

type GridProps = {
	files: SelectFile[];
	deletable: boolean;
};

function GridInner({ files, deletable }: GridProps) {
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
				deletable={deletable}
			/>
		</div>
	);
}

function GridRefresh() {
	const session = useSession();
	const filesQuery = api.file.getAll.useQuery();
	const filesByUserQuery = api.file.getByUserId.useQuery(session.data?.user.id);
	React.useLayoutEffect(() => {
		const intervalId = setInterval(
			session.data ?
				filesByUserQuery.refetch : filesQuery.refetch,
			5000
		);

		return () => clearInterval(intervalId);
	}, [session]);

	if (session.data) {
		if (filesByUserQuery.data) {
			return <GridInner deletable={true} files={filesByUserQuery.data} />
		}
	} else {
		if (filesQuery.data) {
			return <GridInner deletable={false} files={filesQuery.data} />
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
