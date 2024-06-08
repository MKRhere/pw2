import React from "react";
import { css, cx } from "@emotion/css";
import { HookSet } from "../../util/useSearchParams";
import { ReactComponent as Cross } from "../../assets/cross.svg";

type Tags = HookSet<string>;

const tag = css`
	cursor: pointer;
	border-radius: 0.5rem;
	padding: 0.5rem 0.9rem 0.5rem 0.6rem;
	font-size: 0.85rem;
	background-color: transparent;
	border: 1px solid var(--card-bg);
	color: var(--text-colour);
	transition: background-color 150ms;

	display: flex;
	align-items: center;
	gap: 0.5rem;

	&:hover {
		background-color: var(--card-tags-hover);
	}

	&.active {
		background-color: var(--card-tags);
	}
`;

export const Tag = (props: { tag: string; selected: Tags }) => {
	const { selected } = props;

	const active = selected.has(props.tag);
	const select = () => {
		if (selected.has(props.tag)) selected.remove(props.tag);
		else selected.add(props.tag);
	};

	return (
		<button className={cx(tag, { active })} onClick={select}>
			<span
				className={cx(
					css`
						transition: transform 100ms ease-in-out;
						overflow: hidden;
						transform: rotate(45deg);
						width: 0.85rem;

						&.active {
							transform: rotate(0deg);
						}
					`,
					{ active },
				)}>
				<Cross
					className={css`
						display: block;
						height: 0.85rem;
						width: 0.85rem;
						fill: var(--text-colour);
					`}
				/>
			</span>
			{props.tag}
		</button>
	);
};

const clear = css`
	border: none;
	color: var(--primary-colour);
	opacity: 1;
	transition: opacity 200ms;

	&.hide {
		opacity: 0;
		user-select: none;
		cursor: unset;
		height: 0;
	}

	&:hover {
		background-color: transparent;
	}
`;

export const Clear = (props: { selected: Tags }) => {
	const { selected } = props;

	return (
		<button
			className={cx(tag, clear, { hide: !selected.size })}
			onClick={selected.clear}>
			<Cross
				className={css`
					display: block;
					height: 0.85rem;
					width: 0.85rem;
					fill: var(--text-colour);
				`}
			/>
			Clear
		</button>
	);
};

export const Tags = (props: { tags: string[]; selected: Tags }) => {
	const { tags, selected } = props;

	return (
		<div
			className={css`
				display: flex;
				gap: 0.5rem;
				flex-wrap: wrap;
			`}>
			{tags.map(tag => (
				<Tag key={tag} tag={tag} selected={selected} />
			))}
			<Clear selected={selected} />
		</div>
	);
};
