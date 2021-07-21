import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";

function Home() {
	return (
		<Container>
			<h1>Nothing here</h1>
			<p>
				404. Back to{" "}
				<b>
					<Link to="/">MKRhere?</Link>
				</b>
			</p>
		</Container>
	);
}

export default Home;
