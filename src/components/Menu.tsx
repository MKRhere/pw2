import React from "react";
import { Link } from "react-router-dom";
import { css, cx } from "@emotion/css";
import { motion } from "framer-motion";
import RevealChildren from "./RevealChildren";
import useMediaQuery from "../util/useMediaQuery";

const menu = [
	{ name: "Home", link: "/" },
	{ name: "Experience", link: "/experience" },
	{ name: "Projects", link: "/projects" },
	{ name: "Contact", link: "/contact" },
];

const desktopNav = css`
	float: right;
	padding-left: 6rem;
	height: 5rem;
`;

const offscreenNav = css`
	height: 100vh;
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 900;
	background: var(--background-colour);
	padding: 6rem;
	opacity: 0;
	top: -100%;
`;

const menuList = css`
	z-index: 1000;
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
`;

const mobileMenu = css`
	flex-direction: column;
	justify-content: center;
	font-size: 2rem;

	& > li + li {
		margin-top: 2rem;
		margin-left: 0;
	}
`;

const Menu: React.FunctionComponent<{ show?: boolean; setShowMenu: (show: boolean) => void }> = ({
	show = false,
	setShowMenu,
}) => {
	// use same query as elsewhere for consistency
	const mobile = useMediaQuery("(max-width: 50rem)");
	const notmobile = !mobile;

	const menuItems = menu.map(item => (
		<Link key={item.link} to={item.link}>
			{item.name}
		</Link>
	));

	return (
		<motion.div
			className={notmobile ? desktopNav : offscreenNav}
			animate={{
				// if resized to mobile and back, numeric value will persist but
				// will be ignored because desktopNav isn't absolutely positioned
				top: notmobile ? "auto" : show ? "0" : "-100%",
				// only children need to animate on desktop, lock opacity: 1
				opacity: notmobile ? 1 : show ? 1 : 0,
			}}>
			<ul className={notmobile ? menuList : cx(menuList, mobileMenu)}>
				<RevealChildren type="li" show={show}>
					{notmobile
						? menuItems
						: menuItems.concat(
								<div
									role="button"
									key="back"
									onClick={() => setShowMenu(false)}
									className={css`
										background: 0;
										border: 0;
										font-size: 3rem;
										color: var(--text-colour);
										cursor: pointer;

										&:hover {
											color: var(--primary-colour);
										}
									`}>
									←
								</div>,
						  )}
				</RevealChildren>
			</ul>
		</motion.div>
	);
};

export default Menu;
