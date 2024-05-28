"use client";

import * as React from "react";
import styled from "styled-components";
import { Stack } from "~/app/utils/styled";

import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import { getS3Client } from "~/lib/s3";


const Block = styled(Stack)`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
`;

interface IProps {
	style: React.CSSProperties;
	filename: string;
	onMouseDown: (event: React.MouseEvent) => void;
}

const AppBlock = ({ filename, ...props }: IProps) => {
	const extension = (filename.split('.').at(-1) ?? 'txt') as DefaultExtensionType;

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
				className="p-3 bg-white shadow-md overflow-hidden rounded-md flex-col w-[132px] items-center justify-center">
				<div className="text-right cursor-pointer">
					<span
						onClick={() => fileDownload(filename)}
						className="border-2 rounded p-1 hover:bg-black hover:text-white">↓</span>
				</div>
				<FileIcon extension={extension} {...defaultStyles[extension]} />
				<span>
					{filename}
				</span>
			</div>
		</Block>
	);
};

export default AppBlock;
