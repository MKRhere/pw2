import React, { forwardRef, useEffect, useRef } from "react";
import { makeDraggable } from "./Draggable.ts";
import { composeRefs } from "../../util/index.ts";
import { css, cx } from "@emotion/css";

export type DraggableProps = React.HtmlHTMLAttributes<any> & {
	as?: React.ElementType;
	onPageEnter?: () => void;
	onPageExit?: () => void;
	children: React.ReactNode;
	initialRotation?: number;
};

export const Draggable = forwardRef<HTMLElement, DraggableProps>(
	(
		{
			as: Comp = "div",
			children,
			className,
			onPageEnter,
			onPageExit,
			initialRotation,
			...props
		}: DraggableProps,
		ref,
	) => {
		const cardRef = useRef<HTMLElement>(null);

		useEffect(() => {
			if (!cardRef.current) return;
			return makeDraggable(cardRef.current, {
				onPageEnter,
				onPageExit,
				initialRotation,
			});
		}, []);

		return (
			<Comp
				className={cx(
					className,
					"draggable",
					css`
						cursor: grab;
					`,
				)}
				ref={composeRefs(cardRef, ref)}
				{...props}>
				{children}
			</Comp>
		);
	},
);

Draggable.displayName = "Draggable";
