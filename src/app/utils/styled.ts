"use client";

import React from "react";
import styled from "styled-components";

export const Text = styled.p``;

export const StackItem = styled.div<
	Pick<React.CSSProperties, "flexShrink" | "flexGrow">
>`
  ${({ flexShrink }) => flexShrink && `flex-shrink: ${flexShrink}`};
  ${({ flexGrow }) => flexGrow && `flex-grow: ${flexGrow}`};
`;

export const Stack = styled.div<
	{
		paddingX?: number;
		paddingY?: number;
		marginX?: number;
		marginY?: number;
		gap?: number;
		fullWidth?: boolean;
		fullHeight?: boolean;
	} & Pick<
		React.CSSProperties,
		| "flexDirection"
		| "justifyContent"
		| "alignItems"
		| "padding"
		| "paddingLeft"
		| "paddingRight"
		| "paddingTop"
		| "paddingBottom"
		| "margin"
		| "marginLeft"
		| "marginRight"
		| "marginTop"
		| "marginBottom"
	>
>`
  display: flex;
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection}`};
  ${({ justifyContent }) =>
		justifyContent && `justify-content: ${justifyContent}`};
  ${({ alignItems }) => alignItems && `align-items: ${alignItems}`};

  ${({ padding }) => padding && `padding: ${padding}px`};

  ${({ paddingX }) =>
		paddingX && `padding-left: ${paddingX}px; padding-right: ${paddingX}px`};
  ${({ paddingY }) =>
		paddingY && `padding-top: ${paddingY}px; padding-bottom: ${paddingY}px`};

  ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft}px`};
  ${({ paddingRight }) => paddingRight && `padding-right: ${paddingRight}px`};
  ${({ paddingTop }) => paddingTop && `padding-top: ${paddingTop}px`};
  ${({ paddingBottom }) =>
		paddingBottom && `padding-bottom: ${paddingBottom}px`};

  ${({ margin }) => margin && `margin: ${margin}`};

  ${({ marginX }) =>
		marginX && `margin-left: ${marginX}px; margin-right: ${marginX}px`};
  ${({ marginY }) =>
		marginY && `margin-top: ${marginY}px; margin-bottom: ${marginY}px`};

  ${({ marginLeft }) => marginLeft && `margin-left: ${marginLeft}px`};
  ${({ marginRight }) => marginRight && `margin-right: ${marginRight}px`};
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px`};
  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom}px`};

  ${({ gap, flexDirection }) =>
		gap &&
		(flexDirection === "column"
			? `>${StackItem}{margin-bottom: ${gap}px}`
			: `>${StackItem}{margin-right: ${gap}px}`)};

  ${({ fullHeight }) => fullHeight && `height: 100%`};
  ${({ fullWidth }) => fullWidth && `width: 100%`};
`;
