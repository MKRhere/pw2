import React from "react";
import { css } from "emotion";

const Dashed: React.FunctionComponent = ({ children }) => (
	<span
		className={css`
			border-bottom: 1px dashed var(--text-color);
		`}>
		{children}
	</span>
);

export default Dashed;
