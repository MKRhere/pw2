import { css } from "emotion";
import Container from "../components/Container";

const Em = props => (
	<span
		className={css`
			border-bottom: 1px dashed #fff;
		`}>
		{props.children}
	</span>
);

function Home() {
	return (
		<Container>
			<h1
				className={css`
					line-height: 1em;
					margin-bottom: 0;

					h1& {
						margin-bottom: 0;
					}
				`}>
				MKRhere
			</h1>
			<p>
				Web home of <Em>designer</Em>, <Em>developer</Em>, and <Em>architect</Em>{" "}
				<span
					className={css`
						font-weight: 800;
						/* color: var(--primary-color); */
					`}>
					Muthu Kumar.
				</span>
			</p>
		</Container>
	);
}

export default Home;
