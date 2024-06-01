"use client";

import * as React from "react";
import styled from "styled-components";
import { Stack } from "~/app/utils/styled";

import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import { getS3Client } from "~/lib/s3";
import { SelectFile } from "~/server/db/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";


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
}

const AppBlock = ({ file, ...props }: IProps) => {
	const extension = (file.name.split('.').at(-1) ?? 'txt') as DefaultExtensionType;

	const fileDownload = (filename: string): void => {

		const s3 = getS3Client();
		try {
			const params = {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
				Key: filename
			};

			s3.getObject(params, (_err, data) => {
				if (data.Body) {
					const blob = new Blob([data.Body as BlobPart], { type: data.ContentType });

					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = filename;
					document.body.appendChild(a);
					a.click();

					// Cleanup
					URL.revokeObjectURL(url);
					document.body.removeChild(a);
				} else {
					console.error('No data.Body in the response');
				}
			});

		} catch (error) {
			console.error('Error downloading the file', error);
		}
	}

	return (
		<Block
			className="app-block items-center justify-center"
			{...props}
		>
			<div
				className="flex flex-col p-3 bg-white h-full shadow-md overflow-hidden rounded-md flex-col w-[132px] items-center justify-center">
				<div className="flex flex-between w-full justify-between cursor-pointer">
					<div>
						{file.public ? "" : "🔒"}
					</div>
					<div
						onClick={() => fileDownload(file.name)}
						className="border-2 rounded px-1 hover:bg-black hover:text-white">↓</div>
				</div>
				<div className="relative w-[50px]">
					<FileIcon extension={extension} {...defaultStyles[extension]} />
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
