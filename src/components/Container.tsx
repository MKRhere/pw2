import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { css, cx } from "emotion";
import { useHistory } from "react-router-dom";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Right } from "../assets/arrow-right.svg";
import { getTimeout } from "../util";
import Menu from "./Menu";
import useMediaQuery from "../util/useMediaQuery";

const flash = css`
	span& {
		width: 5.6rem;
		height: 5.6rem;
		top: -0.2rem;
		left: -0.05rem;
		opacity: 1;
	}
`;

const [timer, clear] = getTimeout();

const Container: React.FunctionComponent<{
	children: (string | React.DetailedReactHTMLElement<any, HTMLElement> | React.ReactElement)[];
	hideNav?: boolean;
	arrowReversed?: boolean;
	next?: string;
	className?: string;
}> = ({
	children: _children,
	hideNav = false,
	arrowReversed = false,
	next,
	className,
	...props
}) => {
	const history = useHistory();

	const mobile = useMediaQuery("(max-width: 50rem)");

	const logoContainer = useRef<HTMLButtonElement>(null);
	const logo = useRef<SVGSVGElement>(null);
	const highlightCircle = useRef<HTMLSpanElement>(null);
	const containerChild = useRef<HTMLDivElement>(null);
	const nextBtn = useRef<HTMLButtonElement>(null);

	const [showMenu, setShowMenu] = useState(false);

	const children = React.Children.map(
		_children,
		(child: string | React.DetailedReactHTMLElement<any, HTMLElement> | React.ReactElement) =>
			!child || typeof child === "string"
				? child
				: React.cloneElement(child, {
						style: { opacity: 0, transform: "translateY(3rem)", transition: "all 300ms" },
				  }),
	);

	useEffect(() => {
		// scroll back to top when new page is loaded
		window.scrollTo({ top: 0 });

		if (highlightCircle.current) {
			highlightCircle.current.classList.add(flash);
			timer(() => highlightCircle.current && highlightCircle.current.classList.remove(flash), 1500);
		}

		if (nextBtn.current) {
			nextBtn.current.style.width = "4rem";
			timer(() => nextBtn.current && (nextBtn.current.style.right = "10vw"), 300);
		}

		if (containerChild.current) {
			const containerChildren = [...containerChild.current.children] as (
				| HTMLElement
				| SVGElement
			)[];
			containerChildren.forEach((child, idx) => {
				timer(() => {
					child.style.removeProperty("opacity");
					child.style.removeProperty("transform");
				}, 100 * idx);
			});

			timer(() => {
				document.body.style.maxHeight = "auto";
				document.body.style.overflow = "auto";
			}, containerChildren.length * 100);
		}

		// cleanup
		return clear;
	}, []);

	const handleResize = () => {
		if (containerChild.current && logoContainer.current)
			logoContainer.current.style.left = `${containerChild.current.getBoundingClientRect().x}px`;
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		// cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// on first render
	useLayoutEffect(handleResize, []);

	const handleNext: React.MouseEventHandler<HTMLButtonElement> = e => {
		if (containerChild.current) {
			([...containerChild.current.children] as (HTMLElement | SVGElement)[]).forEach(child => {
				child.style.marginBottom = "2rem";
				child.style.opacity = "0";
			});
		}
		document.body.style.maxHeight = "100vh";
		document.body.style.overflow = "hidden";
		e.currentTarget.style.width = "0";
		timer(() => next && history.push(next), 300);
	};

	return (
		<div
			className={css`
				background: var(--background-colour);
				padding: 15rem calc(100vw / 8) 8rem calc(100vw / 8);
				overflow-x: hidden;
				min-height: 100vh;
				position: relative;
			`}>
			{!hideNav && (
				<button
					ref={logoContainer}
					className={css`
						position: absolute;
						top: 8rem;
						left: 5rem;
						background: none;
						border: 0;
						font-size: 1rem;

						&:hover .logo-highlight,
						&:active .logo-highlight {
							width: 5.2rem;
							height: 5.2rem;
							opacity: 1;
							top: -0.05rem;
							left: 0.15rem;
						}
					`}
					onMouseOver={() => !mobile && setShowMenu(true)}
					onMouseOut={() => !mobile && setShowMenu(false)}>
					<span
						ref={highlightCircle}
						className={cx(
							css`
								position: absolute;
								width: 5rem;
								height: 5rem;
								border-radius: 100%;
								background: var(--primary-colour);
								z-index: 0;
								opacity: 0;
								cursor: pointer;

								transition: all 600ms;
							`,
							"logo-highlight",
						)}></span>
					<Logo
						ref={logo}
						viewBox="0 0 264 264"
						className={css`
							position: absolute;
							height: 5rem;
							width: 5rem;
							border-radius: 100%;
							box-shadow: 0px 0px 50px 0px rgba(100, 100, 100, 0.65);
							cursor: pointer;
						`}
						onClick={() => (mobile ? setShowMenu(true) : history.push("/"))}
					/>
					<Menu show={showMenu} setShowMenu={setShowMenu} />
				</button>
			)}
			{next && (
				<button
					onClick={handleNext}
					ref={nextBtn}
					className={css`
						position: fixed;
						right: 14vw;
						bottom: 10vh;
						z-index: 500;
						background: none;
						padding: 0;
						font-weight: 500;
						cursor: pointer;
						letter-spacing: 0.2rem;
						border: none;
						overflow: hidden;
						width: 0;
						transition: all 300ms;
						overflow: hidden;

						${arrowReversed ? "rotate: 180deg;" : ""}

						&:hover * {
							fill: var(--primary-colour);
						}
					`}>
					<Right
						className={css`
							height: "2rem";
							width: "2rem";
						`}
					/>
				</button>
			)}
			<div
				className={cx(
					css`
						width: 100%;
						max-width: 60rem;
						min-height: 100%;
						margin: auto;

						& > * {
							margin-bottom: 2rem;
						}
					`,
					className,
				)}
				ref={containerChild}
				{...props}>
				{children}
			</div>
		</div>
	);
};

export default Container;
