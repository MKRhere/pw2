import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";

export interface AnimateEntryProps extends React.HTMLAttributes<any> {
	as?: React.ElementType;
	delay?: number;
}

export const AnimateEntry = forwardRef<HTMLDivElement, AnimateEntryProps>(
	(
		{ children, className, as: Component = "div", delay = 100, ...props },
		ref,
	) => {
		return (
			<Component
				className={cx(
					css`
						& > * {
							animation: slideIn 300ms backwards;
						}

						${React.Children.map(
							children,
							(child, i) =>
								child &&
								css`
									& > *:nth-child(${i + 1}) {
										animation-delay: ${i * delay}ms;
									}
								`,
						)}

						@keyframes slideIn {
							from {
								opacity: 0;
								transform: translateY(3rem);
							}
							to {
								opacity: 1;
								transform: translateY(0);
							}
						}
					`,
					className,
				)}
				{...props}
				ref={ref}>
				{children}
			</Component>
		);
	},
);
