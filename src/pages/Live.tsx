import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Timeline from "../components/Timeline";

const Live: React.FunctionComponent = () => {
	const [tl, setTl] = useState([]);

	useEffect(() => {
		fetch("/data/timeline.json")
			.then(res => res.json())
			.then(setTl)
			.catch(() => {});
	}, []);

	return (
		<Container hideNav>
			<h1>MKRhere</h1>
			<Timeline contents={tl} />
		</Container>
	);
};

export default Live;
