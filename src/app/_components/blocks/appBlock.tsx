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
	index: number;
	style: React.CSSProperties;
	onMouseDown: (event: React.MouseEvent) => void;
}

const array = ["mp4", "ttf", "psd", "docx"];

const AppBlock = ({ index, ...props }: IProps) => {

	const randomElement = array[index % array.length] as DefaultExtensionType;
	return (
		<Block
			className="app-block items-center justify-center"
			{...props}
		>
			<div className="p-3 bg-white shadow-md rounded-md flex items-center justify-center">
				<FileIcon extension={randomElement} {...defaultStyles[randomElement]} />
			</div>
		</Block>
	);
};

export default AppBlock;
