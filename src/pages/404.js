import { css } from "emotion";
import Container from "../components/Container";
import Heading from "../components/Heading";

const Dashed = props => (
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
			<Heading>Nothing here</Heading>
			<p>
				404. Back to{" "}
				<b>
					<a href="/">MKRhere?</a>
				</b>
			</p>
		</Container>
	);
}

export default Home;
