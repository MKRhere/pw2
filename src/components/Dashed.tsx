import React from "react";
import { css } from "@emotion/css";

const Dashed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<span
		className={css`
			border-bottom: 1px dashed var(--text-colour);
		`}>
		{children}
	</span>
);

export default Dashed;
