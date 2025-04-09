import { css, cx } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";
import { composeRefs } from "../util";

const isOutsideViewport = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	const isOutside =
		rect.right < 0 ||
		rect.left > window.innerWidth ||
		rect.bottom < 0 ||
		rect.top > window.innerHeight;

	return isOutside;
};

export interface DraggableButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onOutsideViewport?: () => void;
}

interface Pos {
	x: number;
	y: number;
	rot: number;
	touchOffsetX?: number;
	touchOffsetY?: number;
}

interface Velocity extends Pos {
	timestamp: number;
}

const relativePos = (pos: Pos, container: DOMRect) => {
	return {
		x: pos.x - container.left,
		y: pos.y - container.top,
	};
};

const getEventPos = (e: MouseEvent | TouchEvent): Pos => {
	if ("touches" in e)
		return {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
			rot: 0,
		};

	return {
		x: e.clientX,
		y: e.clientY,
		rot: 0,
	};
};

export const DraggableButton = React.forwardRef<
	HTMLButtonElement,
	DraggableButtonProps
>(({ children, onOutsideViewport, ...props }, ref) => {
	const [transform, setTransform] = useState<Pos>({ x: 0, y: 0, rot: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<Pos | null>(null);
	const myRef = useRef<HTMLButtonElement | null>(null);
	const containerRef = useRef<DOMRect | null>(null);
	const lastVelocity = useRef<Velocity>({ x: 0, y: 0, rot: 0, timestamp: 0 });
	const lastPosition = useRef<Pos>({ x: 0, y: 0, rot: 0 });
	const animationFrame = useRef<number>();
	const [isOutside, setIsOutside] = useState(false);

	useEffect(() => {
		if (isOutside) onOutsideViewport?.();
	}, [isOutside, onOutsideViewport]);

	const updateContainerRef = () => {
		if (myRef.current?.parentElement) {
			containerRef.current =
				myRef.current.parentElement.getBoundingClientRect();
		}
	};

	const handleStart = (e: MouseEvent | TouchEvent) => {
		if (!myRef.current) return;
		if ("touches" in e) e.preventDefault();

		updateContainerRef();
		if (!containerRef.current) return;

		if (animationFrame.current) cancelAnimationFrame(animationFrame.current);

		const eventPos = getEventPos(e);
		setDragStart({
			x: eventPos.x,
			y: eventPos.y,
			rot: transform.rot,
		});
		lastPosition.current = eventPos;
		lastVelocity.current = { x: 0, y: 0, rot: 0, timestamp: performance.now() };

		setIsDragging(true);
	};

	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (!isDragging || !dragStart || !containerRef.current) return;
		if ("touches" in e) e.preventDefault();

		const currentPos = getEventPos(e);

		// Calculate movement since last frame
		const frameDelta = {
			x: currentPos.x - lastPosition.current.x,
			y: currentPos.y - lastPosition.current.y,
		};

		const now = performance.now();
		const elapsed = now - lastVelocity.current.timestamp;

		if (elapsed > 0) {
			lastVelocity.current = {
				x: (frameDelta.x / elapsed) * 16,
				y: (frameDelta.y / elapsed) * 16,
				rot: 0,
				timestamp: now,
			};
		}

		// Calculate rotation based on horizontal movement
		const ROTATION_FACTOR = 0.2;
		const rotationDelta = frameDelta.x * ROTATION_FACTOR;

		lastPosition.current = currentPos;

		// Update transform based on frame delta
		setTransform(prev => ({
			x: prev.x + frameDelta.x,
			y: prev.y + frameDelta.y,
			rot: prev.rot + rotationDelta,
		}));
	};

	const handleEnd = () => {
		setIsDragging(false);

		if (
			Math.abs(lastVelocity.current.x) > 0.1 ||
			Math.abs(lastVelocity.current.y) > 0.1
		)
			animationFrame.current = requestAnimationFrame(applyMomentum);

		if (myRef.current && isOutsideViewport(myRef.current)) setIsOutside(true);
	};

	const applyMomentum = () => {
		const now = performance.now();
		const elapsed = now - lastVelocity.current.timestamp;
		const decay = Math.pow(0.7, elapsed / 16);

		const newVelocity = {
			x: lastVelocity.current.x * decay,
			y: lastVelocity.current.y * decay,
			rot: lastVelocity.current.rot * decay,
			timestamp: now,
		};

		if (Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
			cancelAnimationFrame(animationFrame.current!);
			return;
		}

		setTransform(prev => ({
			x: prev.x + newVelocity.x,
			y: prev.y + newVelocity.y,
			rot: prev.rot,
		}));

		lastVelocity.current = newVelocity;
		animationFrame.current = requestAnimationFrame(applyMomentum);
	};

	useEffect(() => {
		if (!myRef.current) return;
		const el = myRef.current;

		// Always listen for drag start
		el.addEventListener("mousedown", handleStart, { passive: false });
		el.addEventListener("touchstart", handleStart, { passive: false });

		// Only add move/end handlers when dragging
		if (isDragging) {
			window.addEventListener("mousemove", handleMove, { passive: false });
			window.addEventListener("touchmove", handleMove, { passive: false });
			window.addEventListener("mouseup", handleEnd);
			window.addEventListener("touchend", handleEnd);
			window.addEventListener("touchcancel", handleEnd);
		}

		return () => {
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current);
			}

			el.removeEventListener("mousedown", handleStart);
			el.removeEventListener("touchstart", handleStart);
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("touchmove", handleMove);
			window.removeEventListener("mouseup", handleEnd);
			window.removeEventListener("touchend", handleEnd);
			window.removeEventListener("touchcancel", handleEnd);
		};
	}, [isDragging]);

	useEffect(() => {
		const el = myRef.current;
		if (!el) return;

		// Apply transform
		el.style.transform = `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rot}deg)`;

		if (!isDragging && isOutsideViewport(el)) setIsOutside(true);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsDragging(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [transform, isDragging]);

	return (
		<button
			ref={composeRefs(myRef, ref)}
			{...props}
			className={cx(
				props.className,
				css`
					position: absolute;
					transition: none;
					cursor: ${isDragging ? "grabbing" : "grab"};
					touch-action: none;
					will-change: transform;
					.dynamic-gradient {
						cursor: inherit;
					}
				`,
			)}>
			{children}
		</button>
	);
});
