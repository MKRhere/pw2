import { css } from "emotion";

const Heading = ({ children, ...props }) => (
	<h1
		className={css`
			line-height: 1em;
		`}
		{...props}>
		{children}
	</h1>
);

export default Heading;
