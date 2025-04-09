import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { css, cx } from "@emotion/css";
import useLocation from "wouter/use-location";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Right } from "../assets/arrow-right.svg";
import { get, getTimeout } from "../util";
import Menu, { MenuEntries } from "./Menu";
import useMediaQuery from "../util/useMediaQuery";
import { AnimateEntry } from "./AnimateEntry";

const [timer, clear] = getTimeout();

const Container: React.FC<{
	children: React.ReactNode | React.ReactNode[];
	hideNav?: boolean;
	className?: string;
	delay?: number;
}> = ({ children, hideNav = false, className, delay = 100, ...props }) => {
	const [location, navigate] = useLocation();

	const mobile = useMediaQuery("(max-width: 50rem)");

	const logoContainer = useRef<HTMLButtonElement>(null);
	const highlightCircle = useRef<HTMLButtonElement>(null);
	const containerChild = useRef<HTMLDivElement>(null);
	const nextBtn = useRef<HTMLButtonElement>(null);

	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		// scroll back to top when new page is loaded
		window.scrollTo({ top: 0 });

		if (highlightCircle.current) {
			highlightCircle.current.classList.add("highlight");
			timer(
				() =>
					highlightCircle.current &&
					highlightCircle.current.classList.remove("highlight"),
				1500,
			);
		}

		if (nextBtn.current) {
			nextBtn.current.style.width = "4rem";
			timer(
				() => nextBtn.current && (nextBtn.current.style.right = "10vw"),
				300,
			);
		}

		// cleanup
		return clear;
	}, []);

	const handleResize = () => {
		if (containerChild.current && logoContainer.current)
			logoContainer.current.style.left = `${
				containerChild.current.getBoundingClientRect().x
			}px`;
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		// cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	type MouseKb = React.MouseEvent | React.KeyboardEvent | KeyboardEvent;

	const animateArrow = (e: MouseKb) => {
		if (containerChild.current) {
			(
				[...containerChild.current.children] as (HTMLElement | SVGElement)[]
			).forEach(child => {
				child.style.marginBottom = "2rem";
				child.style.opacity = "0";
			});
		}

		try {
			const target = e.currentTarget! as HTMLButtonElement;
			target.style.width = "0";
		} catch {}
	};

	const current = MenuEntries.findIndex(
		([, path]) => location === path || location.startsWith(path + "/"),
	);
	const next = get.next(MenuEntries, current)[1];
	const prev = get.prev(MenuEntries, current)[1];
	const end = current === MenuEntries.length - 1;

	const handlePrev = (e: MouseKb) => {
		animateArrow(e);
		timer(() => prev && navigate(prev), 300);
	};

	const handleNext = (e: MouseKb) => {
		animateArrow(e);
		timer(() => next && navigate(next), 300);
	};

	function kbnav(e: KeyboardEvent) {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

		switch (e.key) {
			case "ArrowLeft":
				return handlePrev(e);
			case "ArrowRight":
				return handleNext(e);
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", kbnav);

		// cleanup
		return () => window.removeEventListener("keydown", kbnav);
	}, []);

	// on first render
	useLayoutEffect(handleResize, []);

	return (
		<div
			className={css`
				--cntr-pad-b-start: 12rem;
				--cntr-pad-b-end: 8rem;
				--cntr-pad-inline: 10vw;
				--logo-size: 5rem;
				padding-block-start: var(--cntr-pad-b-start);
				padding-block-end: var(--cntr-pad-b-end);
				padding-inline: var(--cntr-pad-inline);
				overflow: hidden;
				min-height: 100vh;
				position: relative;
			`}>
			<div
				aria-hidden
				className={cx(
					"fog",
					css`
						position: fixed;
						width: 100vw;
						left: 0;
						bottom: 0;
						height: 8vh;
						background: rgb(0, 0, 0);
						background: linear-gradient(
							180deg,
							rgba(0, 0, 0, 0) 0%,
							rgba(0, 0, 0, 1) 100%
						);
						z-index: 1000;
						pointer-events: none;
					`,
				)}
			/>
			{!hideNav && (
				<span
					ref={logoContainer}
					className={css`
						position: absolute;
						/* prettier-ignore */
						top: calc(
							calc(var(--cntr-pad-b-start) / 2)
							- calc(var(--logo-size) / 2)
							+ 1rem
						);
						left: var(--cntr-pad-inline);
						background: none;
						border: 0;
						font-size: 1rem;
					`}
					onMouseOver={() => !mobile && setShowMenu(true)}
					onMouseOut={() => !mobile && setShowMenu(false)}>
					<button
						aria-label={mobile ? "Tap to show menu" : "Back to home"}
						ref={highlightCircle}
						className={cx(
							css`
								position: absolute;
								left: 0;
								height: var(--logo-size);
								width: var(--logo-size);
								border-radius: 100%;
								border: 0;
								background: none;
								cursor: pointer;

								& > svg {
									width: 100%;
									height: 100%;
									position: absolute;
									inset: 0;
									z-index: 1;
									outline: 0;
								}

								&::before {
									content: "";
									position: absolute;
									top: 0.5rem;
									left: -0.1rem;
									width: 5rem;
									height: 5rem;
									border-radius: 100%;
									background: var(--primary-colour);
									z-index: 0;
									opacity: 0;
									cursor: pointer;

									transition: all 600ms;
								}

								&:hover::before,
								&.highlight::before {
									opacity: 1;
								}

								&:hover::before,
								&:focus::before {
									width: 5.2rem;
									height: 5.2rem;
									top: -0.1rem;
									left: -0.1rem;
									outline: none;
								}

								&.highlight::before {
									width: 5.6rem;
									height: 5.6rem;
									top: -0.3rem;
									left: -0.3rem;
								}
							`,
						)}>
						<Logo
							viewBox="0 0 264 264"
							onClick={() => (mobile ? setShowMenu(true) : navigate("/"))}
						/>
					</button>
					<Menu show={showMenu} setShowMenu={setShowMenu} />
				</span>
			)}
			<button
				onClick={handleNext}
				ref={nextBtn}
				title={end ? "Back to start" : "Next page"}
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
					width: 0;
					transition: all 300ms;
					overflow: hidden;

					${end ? "rotate: 180deg;" : ""}

					&:hover, &:focus {
						/* disable some browser defaults */
						-webkit-tap-highlight-color: transparent;
						outline: none;
						touch-action: manipulation;
						* {
							fill: var(--primary-colour);
						}
					}
				`}>
				<Right
					className={css`
						height: "2rem";
						width: "2rem";
					`}
				/>
			</button>
			<AnimateEntry
				delay={delay}
				className={cx(
					css`
						width: 100%;
						max-width: 62rem;
						min-height: 100%;
						margin: auto;
						gap: 2rem;
						display: flex;
						flex-direction: column;
						position: relative;
					`,
					className,
				)}
				ref={containerChild}
				{...props}>
				{children}
			</AnimateEntry>
		</div>
	);
};

export default Container;
