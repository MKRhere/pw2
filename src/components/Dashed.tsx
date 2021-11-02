import React from "react";
import { css } from "@emotion/css";

const Dashed: React.FunctionComponent = ({ children }) => (
	<span
		className={css`
			border-bottom: 1px dashed var(--text-colour);
		`}>
		{children}
	</span>
);

export default Dashed;
