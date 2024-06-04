"use client";

import * as React from "react";
import styled from "styled-components";
import { Stack } from "~/app/utils/styled";

import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import { getS3Client } from "~/lib/s3";
import { SelectFile } from "~/server/db/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageWithHideOnError } from "~/lib/tsx/utils";

const Block = styled(Stack)`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
`;

interface IProps {
	style: React.CSSProperties;
	file: SelectFile;
	onMouseDown: (event: React.MouseEvent) => void;
	onMouseUp: (event: React.MouseEvent) => void;
	onTouchMove: (event: React.TouchEvent) => void;
	onTouchStart: (event: React.TouchEvent) => void;
	onTouchEnd: (event: React.TouchEvent) => void;
}

const AppBlock = ({ file, ...props }: IProps) => {
	const extension = (file.name.split('.').at(-1) ?? 'txt') as DefaultExtensionType;

	const fileDownload = async (filename: string) => {

		const s3 = getS3Client();
		try {
			const params = {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
				Key: filename
			};
			const command = new GetObjectCommand(params);

			const signedUrl = await getSignedUrl(s3, command, {
				expiresIn: 3600,
			});

			window.open(signedUrl, 'Download');


		} catch (error) {
			console.error('Error downloading the file', error);
		}
	};

	return (
		<Block
			className="app-block items-center justify-center"
			{...props}
		>
			<div
				className="flex flex-col py-3 px-1 bg-white h-full shadow-md overflow-hidden rounded-md flex-col w-[132px] items-center justify-center">
				<div className="flex flex-between w-full justify-between cursor-pointer">
					<div className="relative w-[30px]">
						<FileIcon extension={extension} {...defaultStyles[extension]} />
					</div>
					<div className="p-1 text-xl">
						{file.public ? "" : "🔒"}
					</div>
					<Button
						onClick={() => fileDownload(file.name)}
						className="py-0 px-2 mb-1"
						variant="outline">
						↓</Button>
				</div>
				<div>
					<ImageWithHideOnError draggable={false} src={"https://nagy135-next-drive-bucket.s3.eu-north-1.amazonaws.com/resized/" + file.name} alt="lol" width={70} height={70} />
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-xs">
							{file.name}
						</span>
					</TooltipTrigger>
					<TooltipContent className="z-50">
						{file.name}
					</TooltipContent>
				</Tooltip>
			</div>
		</Block>
	);
};

export default AppBlock;
