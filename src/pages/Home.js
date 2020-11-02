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
			<Heading>MKRhere</Heading>
			<p>
				Web home of <Dashed>designer</Dashed>, <Dashed>developer</Dashed>, and{" "}
				<Dashed>architect</Dashed> <b>Muthu Kumar.</b>
			</p>
		</Container>
	);
}

export default Home;
