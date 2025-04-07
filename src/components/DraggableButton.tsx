import { css, cx } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";

export interface DraggableButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface Pos {
	x: number;
	y: number;
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

export const DraggableButton = React.forwardRef<
	HTMLButtonElement,
	DraggableButtonProps
>(({ children, ...props }, ref) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [rotation, setRotation] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [isInitialized, setIsInitialized] = useState(false);
	const myRef = useRef<HTMLButtonElement | null>(null);
	const containerRef = useRef<DOMRect | null>(null);
	const lastVelocity = useRef<Velocity>({ x: 0, y: 0, timestamp: 0 });
	const lastPosition = useRef<Pos>({ x: 0, y: 0 });
	const animationFrame = useRef<number>();

	// Capture initial rotation on mount
	useEffect(() => {
		const el = myRef.current;
		if (!el || isInitialized) return;

		// Extract initial rotation from transform style
		const rotate = window.getComputedStyle(el).rotate;
		setRotation(parseFloat(rotate));

		const rect = el.getBoundingClientRect();
		const parentRect = el.parentElement?.getBoundingClientRect() ?? rect;

		// Convert current position to top/left
		const top = rect.top - parentRect.top;
		const left = rect.left - parentRect.left;

		// Set position and clear any bottom/right values
		el.style.position = "absolute";
		el.style.transition = "none";

		setPosition({ x: left, y: top });
		setIsInitialized(true);
	}, []);

	useEffect(() => {
		const el = myRef.current;
		if (!el || !isInitialized) return;

		containerRef.current = el.parentElement?.getBoundingClientRect() ?? null;

		// Remove the transition property entirely
		el.style.left = `${position.x}px`;
		el.style.top = `${position.y}px`;
		el.style.rotate = `${rotation}deg`;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsDragging(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [position, isInitialized, rotation, isDragging]);

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

		if ("touches" in e) {
			e.preventDefault();
		}

		// Cancel any ongoing momentum animation
		if (animationFrame.current) {
			cancelAnimationFrame(animationFrame.current);
		}

		setIsDragging(true);

		const eventPos = getEventPos(e);
		const relative = relativePos(eventPos, containerRef.current);

		// Initialize last position with current position
		lastPosition.current = position;
		lastVelocity.current = { x: 0, y: 0, timestamp: performance.now() };

		setDragOffset({
			x: relative.x - position.x,
			y: relative.y - position.y,
		});
	};

	const calculateRotation = (velocity: Velocity) => {
		// Use a simpler rotation calculation based on position change
		const ROTATION_FACTOR = 0.2; // Adjust this to make rotation more or less sensitive

		// Use the actual position change for rotation
		const positionDelta = lastPosition.current.x - position.x;

		// Add to current rotation based on movement
		return rotation + positionDelta * ROTATION_FACTOR;
	};

	const handleMove = (e: MouseEvent | TouchEvent) => {
		if (!isDragging || !containerRef.current) return;

		if ("touches" in e) {
			e.preventDefault();
		}

		const eventPos = getEventPos(e);
		const relative = relativePos(eventPos, containerRef.current);
		const newPosition = {
			x: relative.x - dragOffset.x,
			y: relative.y - dragOffset.y,
		};

		// Calculate velocity
		const now = performance.now();
		const elapsed = now - lastVelocity.current.timestamp;
		if (elapsed > 0) {
			const newVelocity = {
				x: ((newPosition.x - lastPosition.current.x) / elapsed) * 16,
				y: ((newPosition.y - lastPosition.current.y) / elapsed) * 16,
				timestamp: now,
			};
			lastVelocity.current = newVelocity;
			lastPosition.current = newPosition;

			// Update rotation based on velocity
			setRotation(calculateRotation(newVelocity));
		}

		setPosition(newPosition);
	};

	const handleEnd = () => {
		setIsDragging(false);

		// Start momentum animation
		if (
			Math.abs(lastVelocity.current.x) > 0.1 ||
			Math.abs(lastVelocity.current.y) > 0.1
		) {
			animationFrame.current = requestAnimationFrame(applyMomentum);
		}
	};

	const applyMomentum = () => {
		const now = performance.now();
		const elapsed = now - lastVelocity.current.timestamp;

		// Apply decay factor (0.95 = more momentum, 0.8 = less momentum)
		const decay = Math.pow(0.7, elapsed / 16);

		const newVelocity = {
			x: lastVelocity.current.x * decay,
			y: lastVelocity.current.y * decay,
			timestamp: now,
		};

		// Stop animation when velocity is very low
		if (Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
			cancelAnimationFrame(animationFrame.current!);
			return;
		}

		setPosition(prev => ({
			x: prev.x + newVelocity.x,
			y: prev.y + newVelocity.y,
		}));

		lastVelocity.current = newVelocity;
		animationFrame.current = requestAnimationFrame(applyMomentum);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMove);
			window.addEventListener("mouseup", handleEnd);
			window.addEventListener("touchmove", handleMove, { passive: false });
			window.addEventListener("touchend", handleEnd);
			window.addEventListener("touchcancel", handleEnd);
		}

		return () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleEnd);
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
