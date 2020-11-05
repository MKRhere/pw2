import { css } from "emotion";

const Dashed = props => (
	<span
		className={css`
			border-bottom: 1px dashed var(--text-color);
		`}>
		{props.children}
	</span>
);

export default Dashed;
