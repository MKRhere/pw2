import React, { useEffect, useRef, useLayoutEffect, useContext } from "react";
import { css, cx } from "@emotion/css";
import useLocation from "wouter/use-location";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Right } from "../assets/arrow-right.svg";
import { getTimeout } from "../util";
import Menu, { MenuEntries, MenuPaths } from "./Menu";
import useMediaQuery from "../util/useMediaQuery";
import { AnimateEntry } from "./AnimateEntry";
import ContactForm from "./ContactForm";
import { AppContext } from "../AppContext";

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

	const context = useContext(AppContext);

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

	const relevantLocation = location.split("/").slice(0, 2).join("/");

	const handlePrev = (e: MouseKb) => {
		animateArrow(e);

		const current = MenuPaths.findIndex(path => relevantLocation === path);
		const index = (current - 1) % MenuPaths.length;
		const prev = MenuPaths.at(index)!;
		timer(() => navigate(prev), 300);
	};

	const handleNext = (e: MouseKb) => {
		animateArrow(e);

		const current = MenuPaths.findIndex(path => relevantLocation === path);
		const index = (current + 1) % MenuPaths.length;
		const next = MenuPaths.at(index)!;
		timer(() => navigate(next), 300);
	};

	function kbnav(e: KeyboardEvent) {
		if (context.contact.on) return;
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

		if (e.key === "ArrowLeft") return handlePrev(e);
		else if (e.key === "ArrowRight") return handleNext(e);
	}

	useEffect(() => {
		// scroll back to top when new page is loaded, only for top-level pages
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
			nextBtn.current.style.width = "3rem";
			timer(
				() => nextBtn.current && (nextBtn.current.style.right = "10vw"),
				300,
			);
		}

		window.addEventListener("keydown", kbnav);

		// cleanup
		return () => (window.removeEventListener("keydown", kbnav), clear());
	}, [relevantLocation, context.contact.on]);

	// on first render
	useLayoutEffect(handleResize, []);

	const end = relevantLocation === MenuEntries[MenuEntries.length - 1][1];

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
			<ContactForm toggle={context.contact} />
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
						z-index: 800;
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
					onMouseOver={() => !mobile && context.menu.set(true)}
					onMouseOut={() => !mobile && context.menu.set(false)}>
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
							onClick={() => (mobile ? context.menu.set(true) : navigate("/"))}
						/>
					</button>
					<Menu show={context.menu.on} setShowMenu={context.menu.set} />
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
					z-index: 900;
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
					"container",
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
