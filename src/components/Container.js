import React, { useEffect, useRef, useLayoutEffect } from "react";
import { css, cx } from "emotion";
import { Link, navigate } from "@reach/router";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Right } from "../assets/arrow-right.svg";
import { getTimeout } from "../util";

const flash = css`
	span& {
		width: 5.4rem;
		height: 5.4rem;
		opacity: 100%;
		top: -0.2rem;
		left: -0.2rem;
	}
`;

const [timer, clear] = getTimeout();

const Container = ({
	children,
	hideNav = false,
	arrowReversed = false,
	next,
	className,
	...props
}) => {
	const logoContainer = useRef();
	const logo = useRef();
	const highlightCircle = useRef();
	const containerChild = useRef();
	const nextBtn = useRef();

	children = React.Children.map(children, child => {
		return React.cloneElement(child, {
			style: { opacity: 0, marginBottom: "5rem", transition: "all 300ms" },
		});
	});

	useEffect(() => {
		if (highlightCircle.current) {
			highlightCircle.current.classList.add(flash);
			timer(() => highlightCircle.current && highlightCircle.current.classList.remove(flash), 1500);
		}

		if (nextBtn.current) {
			nextBtn.current.style.width = "4rem";
			timer(() => nextBtn.current && (nextBtn.current.style.right = "10vw"), 300);
		}

		if (containerChild.current) {
			const containerChildren = [...containerChild.current.children];
			containerChildren.forEach((child, idx) => {
				timer(() => {
					child.style.removeProperty("opacity");
					child.style.removeProperty("margin-bottom");
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
		if (logoContainer.current)
			logoContainer.current.style.left = `${containerChild.current.getBoundingClientRect().x}px`;
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		// cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// on first render
	useLayoutEffect(handleResize, []);

	const handleNext = e => {
		if (containerChild.current) {
			[...containerChild.current.children].forEach(child => {
				child.style.marginBottom = "2rem";
				child.style.opacity = "0";
			});
		}
		document.body.style.maxHeight = "100vh";
		document.body.style.overflow = "hidden";
		e.currentTarget.style.width = 0;
		timer(() => navigate(next), 300);
	};

	return (
		<div
			className={css`
				background: var(--background-color);
				padding: 15rem calc(100vw / 8) 8rem calc(100vw / 8);
				overflow-x: hidden;
				min-height: 100vh;
				position: relative;
			`}>
			{!hideNav && (
				<Link
					to={"/" + Math.random().toString(16).slice(2)}
					ref={logoContainer}
					className={css`
						position: absolute;
						top: 8rem;
						left: 5rem;

						&:hover .logo-highlight,
						&:active .logo-highlight {
							width: 5.2rem;
							height: 5.2rem;
							opacity: 100%;
							top: -0.1rem;
							left: -0.1rem;
						}
					`}>
					<span
						ref={highlightCircle}
						className={cx(
							css`
								position: absolute;
								width: 5rem;
								height: 5rem;
								border-radius: 100%;
								background: var(--primary-color);
								z-index: 0;
								opacity: 0%;

								transition: all 600ms;
							`,
							"logo-highlight",
						)}></span>
					<Logo
						ref={logo}
						className={css`
							position: absolute;
							height: 5rem;
							width: 5rem;
							border-radius: 100%;
							box-shadow: 0px 0px 50px 0px rgba(100, 100, 100, 0.65);
						`}
					/>
				</Link>
			)}
			{next && (
				<button
					onClick={handleNext}
					ref={nextBtn}
					className={css`
						position: fixed;
						right: 14vw;
						bottom: 10vh;
						z-index: 1000;
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
							fill: var(--primary-color);
						}
					`}>
					<Right />
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
