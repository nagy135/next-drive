"use client";

import * as React from "react";
import styled from "styled-components";
import { Stack } from "~/app/utils/styled";

import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";


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

	return (
		<Block
			className="app-block items-center justify-center"
			{...props}
		>
			<div className="p-3 bg-white shadow-md overflow-hidden rounded-md flex-col w-[132px] items-center justify-center">
				<FileIcon extension={extension} {...defaultStyles[extension]} />
				<span>
					{filename}
				</span>
			</div>
		</Block>
	);
};

export default AppBlock;
