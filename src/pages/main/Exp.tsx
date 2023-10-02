import React from "react";
import { css } from "@emotion/css";
import Container from "../../components/Container";

const exp = [
	{
		title: "Vinzas",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2014",
	},
	{
		title: "BlueCube",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2015",
	},
	{
		title: "OutFocus Magazine",
		position: "Editor / developer",
		year: "2014-17",
	},
	{
		title: "Zoho",
		location: "Chennai",
		position: "Technical Content Writer",
		year: "2017",
	},
	{
		title: "Manoj Exports",
		location: "Chennai",
		position: "Designer & web dev",
		year: "2017",
	},
	{
		title: "Klenty",
		location: "Chennai",
		position: "Full stack developer",
		year: "2018",
	},
	{
		title: "Hugo's Way",
		location: "Remote",
		position: "Full stack developer",
		year: "2018-19",
	},
	{
		title: "Navana Tech",
		location: "Remote",
		position: "Lead web & architect",
		year: "2021-22",
	},
	{
		title: "Feathers Studio",
		location: "Chennai",
		position: "Chief Maker",
		year: "2019-present",
	},
];

const Circle: React.FC = () => (
	<div>
		<div
			className={css`
				width: 200vw;
				height: 1px;
				background: #333333;
				left: -50vw;
				position: absolute;
				top: calc(-2rem + 0.25rem / 2 - 0.5px);
				z-index: 0;
			`}></div>
		<div
			className={css`
				width: 0.25rem;
				height: 0.25rem;
				background: #ffffff;
				border-radius: 100%;
				position: absolute;
				top: -2rem;
				left: 0;
				z-index: 100;
			`}></div>
	</div>
);

type Experience = {
	title: string;
	location?: string;
	position: string;
	year: string;
};

const ExpUnit: React.FC<Experience> = ({ title, location, position, year }) => {
	return (
		<div
			className={css`
				position: relative;
			`}>
			<Circle />
			<h4>{[title, location].filter(Boolean).join(", ")}</h4>
			<span
				className={css`
					color: #bdbdbd;
				`}>
				{position}
			</span>
			{" . "}
			<span
				className={css`
					font-weight: 300;
				`}>
				{year}
			</span>
		</div>
	);
};

const getAge = (date: string) => {
	var today = new Date();
	var birthDate = new Date(date);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0) return age - 1;
	if (m === 0 && today.getDate() < birthDate.getDate()) return age - 1;
	return age;
};

const age = getAge("27 May 1995");

const Exp: React.FC = () => {
	return (
		<Container next="/projects">
			<h2>I’m a {age} year old developer from Chennai, India.</h2>
			<p>
				Here are some places I’ve worked at, in reverse chronological order:
			</p>
			<div
				className={css`
					display: flex;
					flex-direction: row-reverse;
					width: 100%;
					flex-wrap: wrap-reverse;

					& > * {
						flex-basis: 15rem;
						flex-grow: 1;
						margin-top: 4rem;
						margin-right: 3%;
					}
				`}>
				{exp.map(unit => (
					<ExpUnit key={unit.title} {...unit} />
				))}
			</div>
		</Container>
	);
};

export default Exp;
