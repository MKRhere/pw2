import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";

const anchorStyle = css`
	display: inline;
	color: var(--text-colour);
	font-weight: 800;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 1rem;

	&:hover {
		color: var(--primary-colour);
	}
`;

const buttonStyle = css`
	display: inline;
	background: var(--card-tags);
	border: 0;
	border-radius: 0.5rem;
	color: var(--text-colour);

	cursor: pointer;
	font-size: 1rem;
	text-align: center;

	gap: 1rem;
	padding: 0.8rem 1.25rem;
	width: 100%;

	position: relative;

	&:disabled {
		background-color: var(--bg-colour);
		cursor: not-allowed;
	}
`;

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	styled?: "button" | "anchor";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, className, ...props }, ref) => {
		return (
			<button
				className={cx(
					props.styled === "anchor" ? anchorStyle : buttonStyle,
					className,
				)}
				{...props}
				ref={ref}>
				{children}
			</button>
		);
	},
);

export interface AnchorProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	styled?: "button" | "anchor";
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
	({ children, className, ...props }, ref) => {
		return (
			<a
				className={cx(
					props.styled === "button" ? buttonStyle : anchorStyle,
					className,
				)}
				{...props}
				ref={ref}>
				{children}
			</a>
		);
	},
);
