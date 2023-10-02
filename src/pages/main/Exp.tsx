import React from "react";
import { css } from "@emotion/css";
import Container from "../../components/Container";

const exp = [
	{
		title: "The Feathers",
		location: "Chennai (formerly Tirunelveli and Ooty)",
		position: "Founder",
		year: "2011-19",
	},
	{
		title: "StudioFlicks",
		location: "Remote (Coimbatore)",
		position: "Co-founder & Creative Head",
		year: "2013-15",
	},
	{
		title: "Vinzas",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2014",
	},
	{
		title: "Blue Cube",
		location: "Chennai",
		position: "Architectural Intern",
		year: "2015",
	},
	{
		title: "OutFocus Magazine",
		location: "Ooty",
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
		location: "Remote (Dublin)",
		position: "Full stack developer",
		year: "2018-19",
	},
	{
		title: "Navana Tech",
		location: "Remote (Mumbai)",
		position: "Lead webdev & architect",
		year: "2021-22",
	},
	{
		title: "Feathers Studio",
		location: "Chennai",
		position: "Chief Maker",
		year: "2019-present",
	},
].reverse();

const Circle: React.FC = () => (
	<div>
		<div
			className={css`
				width: 200vw;
				height: 1px;
				background: #333333;
				left: -50vw;
				position: absolute;
				top: calc(2rem + 0.25rem / 2);
				/* centre it to the circle */
				transform: translateY(-50%);
				z-index: 0;
			`}></div>
		<div
			className={css`
				width: 0.25rem;
				height: 0.25rem;
				background: #ffffff;
				border-radius: 100%;
				position: absolute;
				top: 2rem;
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
				display: flex;
				flex-direction: column;
				gap: 0.6rem;
				& * {
					line-height: 1em;
				}
				& h5 {
					color: var(--text-subdued);
					font-weight: 400;
					font-size: 0.9rem;
				}
			`}>
			<Circle />
			<h4>{title}</h4>
			<div>
				<span
					className={css`
						color: var(--text-colour);
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
			<h5>{location}</h5>
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
		<Container>
			<h2>
				I’m a {age} year old developer from
				<br />
				Chennai, India.
			</h2>
			<p>
				Here are some places I’ve worked at{" "}
				<span
					className={css`
						/* font-size: 0.8rem; */
						color: var(--text-subdued);
					`}>
					(recent first)
				</span>
				:
			</p>
			<div
				className={css`
					width: 100%;

					display: grid;
					grid-template-columns: repeat(auto-fit, 20rem);
					gap: 1rem;

					& > * {
						padding-top: 4rem;
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
