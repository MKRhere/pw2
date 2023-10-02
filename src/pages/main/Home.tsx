import React from "react";
import Container from "../../components/Container";
import Dashed from "../../components/Dashed";

const Home: React.FC = () => {
	return (
		<Container>
			<h1>MKRhere</h1>
			<p>
				Web home of <Dashed>designer</Dashed>, <Dashed>developer</Dashed>, and{" "}
				<Dashed>architect</Dashed> <b>Muthu Kumar.</b>
			</p>
		</Container>
	);
};

export default Home;
