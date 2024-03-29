import React from "react";

const sampleText = `
This is gonna have some text, probably a story about what I did here.
Apollonius of Perga rich in heavy atoms great turbulent clouds citizens of distant epochs the only home we've ever known hydrogen atoms?
Bits of moving fluff two ghostly white figures in coveralls and helmets are softly dancing a still more glorious dawn awaits hearts of the stars extraordinary claims require extraordinary evidence a very small stage in a vast cosmic arena.
`;

export const experience = [
	{
		title: "The Feathers",
		location: "Chennai (formerly Tirunelveli, Ooty)",
		position: "Founder (Creative Collective)",
		year: "2011-19",
		description: (
			<>
				<li>
					The Feathers was a creative collective, comprising mostly of students
					and amateur artists and entertainers pursuing various creative
					endeavours.
				</li>
				<li>
					This varied from photography, typography, graphic design, short films,
					music, to ad films and event coverage.
				</li>
				<li>
					It was an early attempt at creating something out of pure passion, and
					gave rise to such projects as StudioFlicks, OutFocus, and the like.
				</li>
				<li>
					It gives me immense pride and joy to see former members go on to build
					amazing careers.
				</li>
			</>
		),
		logo: "TheFeathers.png",
	},
	{
		title: "StudioFlicks",
		location: "Remote (Coimbatore)",
		position: "Co-founder & Creative Head",
		year: "2013-15",
		description: sampleText,
		logo: "StudioFlicks.png",
	},
	{
		title: "Vinzas",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2014",
		description: sampleText,
		logo: "Vinzas.png",
	},
	{
		title: "Blue Cube",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2015",
		description: sampleText,
		logo: "BlueCube.png",
	},
	{
		title: "OutFocus Magazine",
		location: "Ooty",
		position: "Editor / Developer",
		year: "2014-17",
		description: sampleText,
		logo: "OutFocus.png",
	},
	{
		title: "Zoho",
		location: "Chennai",
		position: "Technical Content Writer",
		year: "2017",
		description: sampleText,
		logo: "Zoho.png",
	},
	{
		title: "Manoj Exports",
		location: "Chennai",
		position: "Designer & Web Dev",
		year: "2017",
		description: sampleText,
		logo: "ManojExports.png",
	},
	{
		title: "Klenty",
		location: "Chennai",
		position: "Full Stack Developer",
		year: "2018",
		description: sampleText,
		logo: "Klenty.png",
	},
	{
		title: "Hugo's Way",
		location: "Remote (Dublin)",
		position: "Full Stack Developer",
		year: "2018-19",
		description: sampleText,
		logo: "Hugosway.png",
	},
	{
		title: "Navana Tech",
		location: "Remote (Mumbai)",
		position: "Lead Web Dev & Architect",
		year: "2021-22",
		description: sampleText,
		logo: "NavanaTech.png",
	},
	{
		title: "Feathers Studio",
		location: "Chennai",
		position: "Chief Maker",
		year: "2019-present",
		description: sampleText,
		logo: "FeathersStudio.png",
	},
].reverse();

const getAge = (date: string) => {
	var today = new Date();
	var birthDate = new Date(date);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0) return age - 1;
	if (m === 0 && today.getDate() < birthDate.getDate()) return age - 1;
	return age;
};

export const age = getAge("27 May 1995");
