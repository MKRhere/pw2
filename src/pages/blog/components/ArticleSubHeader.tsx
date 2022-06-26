import { css } from "@emotion/css";
import React from "react";
import { Article } from "../../../data";

export const ArticleSubHeader: React.FC<{ article: Article }> = ({
	article: { category, published },
}) => {
	return (
		<div
			className={css`
				font-size: 0.8rem;
				display: inline-flex;
				gap: 0.25rem;
				color: var(--text-subdued);
			`}>
			<span>{category}</span>
			<span>·</span>
			<span>{new Date(published).toLocaleDateString()}</span>
		</div>
	);
};
