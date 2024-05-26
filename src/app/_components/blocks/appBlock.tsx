import * as React from "react";
import styled from "styled-components";
import { Stack, Text } from "~/app/utils/styled";


const Block = styled(Stack)`
  position: relative;
  border-radius: 4px;
  margin-right: 8px;
`;

const StyledText = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 24px;
`;

interface IProps {
	name: string;
	style: React.CSSProperties;
	onMouseDown: (event: React.MouseEvent) => void;
}

const QucikPick = ({ name, ...props }: IProps) => {
	return (
		<Block
			className="app-block"
			{...props}
			alignItems="center"
			justifyContent="center"
		>
			<StyledText className="ellipsis">{name}</StyledText>
		</Block>
	);
};

export default QucikPick;
