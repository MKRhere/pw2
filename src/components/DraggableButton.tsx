import { css, cx } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";

export interface DraggableButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface Pos {
	x: number;
	y: number;
}

const relativePos = (pos: Pos, container: DOMRect) => {
	return {
		x: pos.x - container.left,
		y: pos.y - container.top,
	};
};

export const DraggableButton = React.forwardRef<
	HTMLButtonElement,
	DraggableButtonProps
>(({ children, ...props }, ref) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const myRef = useRef<HTMLButtonElement | null>(null);
	const containerRef = useRef<DOMRect | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	// Convert initial position and set up element on mount
	useEffect(() => {
		const el = myRef.current;
		if (!el || isInitialized) return;

		const rect = el.getBoundingClientRect();
		const parentRect = el.parentElement?.getBoundingClientRect() ?? rect;

		// Convert current position to top/left
		const top = rect.top - parentRect.top;
		const left = rect.left - parentRect.left;

		// Set position and clear any bottom/right values
		el.style.position = "absolute";
		el.style.top = `${top}px`;
		el.style.left = `${left}px`;
		el.style.bottom = "unset";
		el.style.right = "unset";

		setPosition({ x: left, y: top });
		setIsInitialized(true);
	}, []);

	useEffect(() => {
		const el = myRef.current;
		if (!el || !isInitialized) return;

		containerRef.current = el.parentElement?.getBoundingClientRect() ?? null;

		el.style.transition = "none";
		el.style.left = `${position.x}px`;
		el.style.top = `${position.y}px`;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsDragging(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [position, isInitialized]);

	const getEventPos = (
		e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
	): Pos => {
		if ("touches" in e) {
			return {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
			};
		}
		return {
			x: e.clientX,
			y: e.clientY,
		};
	};

	const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
		if (!myRef.current || !containerRef.current) return;

		// Prevent scrolling on touch devices
		if ("touches" in e) {
			e.preventDefault();
		}

		setIsDragging(true);

		const eventPos = getEventPos(e);
		const relative = relativePos(eventPos, containerRef.current);

		setDragOffset({
			x: relative.x - position.x,
			y: relative.y - position.y,
		});
	};

	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (!isDragging || !containerRef.current) return;

		// Prevent scrolling on touch devices
		if ("touches" in e) {
			e.preventDefault();
		}

		const eventPos = getEventPos(e);
		const relative = relativePos(eventPos, containerRef.current);

		setPosition({
			x: relative.x - dragOffset.x,
			y: relative.y - dragOffset.y,
		});
	};

	const handleEnd = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			// Mouse events
			window.addEventListener("mousemove", handleMove);
			window.addEventListener("mouseup", handleEnd);

			// Touch events
			window.addEventListener("touchmove", handleMove, { passive: false });
			window.addEventListener("touchend", handleEnd);
			window.addEventListener("touchcancel", handleEnd);
		}

		return () => {
			// Mouse events
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleEnd);

			// Touch events
			window.removeEventListener("touchmove", handleMove);
			window.removeEventListener("touchend", handleEnd);
			window.removeEventListener("touchcancel", handleEnd);
		};
	}, [isDragging, dragOffset]);

	return (
		<button
			ref={el => {
				if (!el) return;

				// Start with absolute positioning
				el.style.position = "absolute";
				myRef.current = el;

				// Store initial container bounds
				const parent = el.parentElement;
				if (parent) {
					containerRef.current = parent.getBoundingClientRect();
				}

				if (ref)
					if (typeof ref === "function") ref(el);
					else ref.current = el;
			}}
			onMouseDown={handleStart}
			onTouchStart={handleStart}
			{...props}
			className={cx(
				props.className,
				css`
					cursor: ${isDragging ? "grabbing" : "grab"};
					touch-action: none; /* Prevent scrolling while dragging on touch devices */
					.dynamic-gradient {
						cursor: inherit;
					}
				`,
			)}>
			{children}
		</button>
	);
});
