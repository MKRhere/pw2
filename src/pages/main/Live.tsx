import React, { useEffect, useState } from "react";
import Container from "../../components/Container";
import Timeline, { TimelineUnits } from "../../components/Timeline";

type LiveInfo =
	| {
			live: false;
	  }
	| {
			live: true;
			videoID: string;
	  };

const Live: React.FC = () => {
	const [tl, setTl] = useState<TimelineUnits>([]);
	const [liveInfo, setLiveInfo] = useState<LiveInfo>({ live: false });

	useEffect(() => {
		fetch("/data/timeline.json")
			.then(res => res.json())
			.then(setTl)
			.catch(() => {});

		fetch("https://api.mkr.pw/live")
			.then(res => res.json())
			.then(setLiveInfo)
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
