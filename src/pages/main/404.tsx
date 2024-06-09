import React from "react";
import Container from "../../components/Container";
import { useNav } from "../../util";

function Home() {
	const [, navigate] = useNav();

	return (
		<Container>
			<h1>Nothing here</h1>
			<p>
				404. Back to{" "}
				<a href="/" onClick={navigate("/")}>
					MKRhere?
				</a>
			</p>
		</Container>
	);
}

export default Home;
