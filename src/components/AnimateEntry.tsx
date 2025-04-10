import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";

const animationStyle = css`
	& > * {
		animation: slideIn 300ms backwards;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			translate: 0 3rem;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}
`;

const delayArray = Array.from({ length: 20 }, (_, i) => i);

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
					"animate-entry",
					animationStyle,
					className,
					delayArray.map(
						i =>
							css`
								& > *:nth-child(${i + 1}) {
									animation-delay: ${i * delay}ms;
								}
							`,
					),
				)}
				{...props}
				ref={ref}>
				{children}
			</Component>
		);
	},
);
