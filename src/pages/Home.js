import Container from "../components/Container";
import Dashed from "../components/Dashed";

function Home() {
	return (
		<Container next="/experience">
			<h1>MKRhere</h1>
			<p>
				Web home of <Dashed>designer</Dashed>, <Dashed>developer</Dashed>, and{" "}
				<Dashed>architect</Dashed> <b>Muthu Kumar.</b>
			</p>
		</Container>
	);
}

export default Home;
