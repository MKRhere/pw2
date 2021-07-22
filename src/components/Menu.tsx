import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import RevealChildren from "./RevealChildren";

const menu = [
	{ name: "Home", link: "/" },
	{ name: "Experience", link: "/experience" },
	{ name: "Projects", link: "/projects" },
	{ name: "Contact", link: "/contact" },
];

const Menu: React.FunctionComponent<{ show?: boolean }> = ({ show = false }) => (
	<div
		className={css`
			float: right; // remove from flow without position: absolute
			padding-left: 6rem;
			height: 5rem;
		`}>
		<ul
			className={css`
				display: flex;
				padding: 0;
				list-style: none;
				height: 100%;
				margin: 0;
				align-items: center;
				font-weight: 800;

				& > li {
					margin-left: 1rem;

					& > a {
						text-decoration: none;
					}
				}
			`}>
			<RevealChildren type="li" show={show}>
				{menu.map(item => (
					<Link to={item.link}>{item.name}</Link>
				))}
			</RevealChildren>
		</ul>
	</div>
);

export default Menu;
