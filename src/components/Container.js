import { css } from "emotion";

const Container = ({ children, ...props }) => (
	<div
		className={css`
			background: #000;
			padding: calc(100vw / 8);
			overflow-x: hidden;
			min-height: 100vh;
		`}>
		<div
			className={css`
				width: 100%;
				max-width: 60rem;
				min-height: 100%;
				margin: auto;

				& > * {
					margin-bottom: 2rem;
				}
			`}
			{...props}>
			{children}
		</div>
	</div>
);

export default Container;
