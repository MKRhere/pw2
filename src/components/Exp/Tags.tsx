import React from "react";
import { css, cx } from "@emotion/css";
import { HookSet } from "../../util/useSet";
import { ReactComponent as Cross } from "../../assets/cross.svg";

type Tags = HookSet<string>;

const tag = css`
	border: none;
	cursor: pointer;
	border-radius: 0.5rem;
	padding: 0.5rem 0.8rem;
	font-size: 0.85rem;
	background: var(--card-bg);
	color: var(--text-colour);

	display: flex;
	align-items: flex-end;

	transition: all 100ms ease-in-out;

	&:hover {
		background: var(--card-tags-hover);
	}

	&.active {
		background: var(--card-tags);
	}
`;

export const Tag = (props: { tag: string; selected: Tags }) => {
	const { selected } = props;

	const active = selected.has(props.tag);
	const select = () =>
		selected.has(props.tag)
			? selected.remove(props.tag)
			: selected.add(props.tag);

	return (
		<button className={cx(tag, { active })} onClick={select}>
			{props.tag}
			<span
				className={cx(
					css`
						width: 0;
						opacity: 0;
						margin-inline-start: 0;
						transition: all 100ms ease-in-out;
						overflow: hidden;

						&.active {
							opacity: 1;
							width: 0.85rem;
							margin-inline-start: 0.5rem;
						}
					`,
					{ active },
				)}>
				<Cross
					className={css`
						display: ${active ? "block" : "none"};
						height: 0.85rem;
						width: 0.85rem;
						fill: var(--text-colour);
					`}
				/>
			</span>
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
				<Tag tag={tag} selected={selected} />
			))}
		</div>
	);
};
