import { css, cx } from "@emotion/css";
import React, { useState, useRef } from "react";

export interface FlippableProps {
	front: React.ReactNode;
	back: React.ReactNode;
	className?: string;
	defaultFlipped?: boolean;
}

export const Flippable: React.FC<FlippableProps> = ({
	front,
	back,
	className,
	defaultFlipped,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isFlipped, setIsFlipped] = useState(defaultFlipped);
	const mouseDownTime = useRef<number>(0);
	const DRAG_THRESHOLD = 250; // milliseconds

	const handleMouseDown = () => {
		mouseDownTime.current = Date.now();
	};

	const handleClick = () => {
		if (Date.now() - mouseDownTime.current < DRAG_THRESHOLD) {
			setIsFlipped(prev => !prev);

			ref.current?.animate(
				[
					{ transform: "scale(1)" },
					{ transform: "scale(1.2)", offset: 0.4 },
					{ transform: "scale(1.2)", offset: 0.6 },
					{ transform: "scale(1)" },
				],
				{
					duration: 600,
					easing: "cubic-bezier(0.4, 0, 0.2, 1)",
				},
			);
		}
	};

	return (
		<div
			ref={ref}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			onTouchStart={handleMouseDown}
			className={cx(
				css`
					position: relative;
					width: 100%;
					height: 100%;
					transform-style: preserve-3d;
					cursor: pointer;
					transition: rotate 0.6s cubic-bezier(0.4, 0, 0.2, 1);
					rotate: ${isFlipped ? "y 180deg" : "y 0deg"};

					.card-face {
						position: absolute;
						width: 100%;
						height: 100%;
						backface-visibility: hidden;
						-webkit-backface-visibility: hidden; /* Safari */
					}

					.card-back {
						rotate: y 180deg;
					}
				`,
				className,
			)}>
			<div className="card-face card-front">{front}</div>
			<div className="card-face card-back">{back}</div>
		</div>
	);
};
