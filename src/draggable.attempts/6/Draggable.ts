import {
	clamp,
	debounce,
	normaliseAngleDifference,
	throttle,
} from "../../util/index.ts";

interface Vec2 {
	x: number;
	y: number;
}

export interface DraggableOpts {
	initialRotation?: number;
	onViewportExit?: () => void;
	onViewportEnter?: () => void;
}

export function makeDraggable(card: HTMLElement, opts: DraggableOpts = {}) {
	// --- Initial Setup ---
	const calculateInitialCenter = (): Vec2 => {
		const rect = card.getBoundingClientRect();
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		};
	};

	// Use mutable objects to allow updates in resize handler
	let initialCenter = calculateInitialCenter();
	let center = { ...initialCenter };

	let rotation = opts.initialRotation ?? 0;
	let dragging = false;
	const state = { dragging };
	let offsetLocal: Vec2 = { x: 0, y: 0 };

	let velocity: Vec2 = { x: 0, y: 0 };
	let angularVelocity = 0;

	// --- Constants ---
	const dampingFactor = 0.7;
	const springFactor = 0.2;
	const maxAngularVelocity = 0.95;
	const RESIZE_DEBOUNCE_MS = 100;
	const VIEWPORT_CHECK_INTERVAL_MS = 100;

	// Adjust damping factors (base + velocity-dependent part)
	const baseDamping = 0.98; // Base exponential damping
	const angularVelocityDecay = 0.99;
	const velocityDecay = 0.005;
	const maxEffectiveSpeed = 50;

	// --- State ---
	let lastMousePosition: Vec2 = { x: 0, y: 0 };
	let activePointerId: number | null = null;
	let animationFrameId: number | null = null;
	let isOutsideViewport = false;

	// --- Helpers ---

	const checkViewportExit = throttle(() => {
		// Don't check if we're dragging, user may still be able to move the card back into view
		if (state.dragging) return;

		const rect = card.getBoundingClientRect();
		const outside =
			rect.right < 0 ||
			rect.bottom < 0 ||
			rect.left > window.innerWidth ||
			rect.top > window.innerHeight;

		if (outside !== isOutsideViewport) {
			isOutsideViewport = outside;
			if (isOutsideViewport) opts.onViewportExit?.();
			else opts.onViewportEnter?.();
		}
	}, VIEWPORT_CHECK_INTERVAL_MS);

	// --- Event Handlers ---
	const down = (e: PointerEvent) => {
		if (activePointerId !== null) return;

		state.dragging = true;
		activePointerId = e.pointerId;
		card.style.cursor = "grabbing";
		card.setPointerCapture(e.pointerId);
		velocity = { x: 0, y: 0 };

		const dx = e.pageX - center.x;
		const dy = e.pageY - center.y;
		const cos = Math.cos(-rotation);
		const sin = Math.sin(-rotation);
		offsetLocal = {
			x: dx * cos - dy * sin,
			y: dx * sin + dy * cos,
		};

		lastMousePosition = { x: e.pageX, y: e.pageY };
		angularVelocity = 0;
	};

	const move = (e: PointerEvent) => {
		if (!state.dragging || e.pointerId !== activePointerId) return;

		const mx = e.pageX;
		const my = e.pageY;

		velocity = {
			x: mx - lastMousePosition.x,
			y: my - lastMousePosition.y,
		};

		lastMousePosition = { x: mx, y: my };

		const px = offsetLocal.x;
		const py = offsetLocal.y;

		const targetRotation =
			Math.atan2(my - center.y, mx - center.x) - Math.atan2(py, px);

		const shortestAngleDifference = normaliseAngleDifference(
			targetRotation - rotation,
		);
		angularVelocity += shortestAngleDifference * springFactor;
		angularVelocity *= dampingFactor;
		angularVelocity = clamp(
			angularVelocity,
			-maxAngularVelocity,
			maxAngularVelocity,
		);

		rotation += angularVelocity;

		const cos = Math.cos(rotation);
		const sin = Math.sin(rotation);

		const rx = px * cos - py * sin;
		const ry = px * sin + py * cos;

		center = {
			x: mx - rx,
			y: my - ry,
		};
	};

	const up = (e: PointerEvent) => {
		if (e.pointerId === activePointerId) {
			state.dragging = false;
			activePointerId = null;
			card.style.cursor = "grab";
			// Momentum is handled in the render loop
		}
	};

	// Debounced Resize Handler using the Reset-Reflow-Recalculate-Reapply strategy
	const handleResize = debounce(() => {
		// 1. Store current visual state relative to the *old* initialCenter
		const currentDeltaX = center.x - initialCenter.x;
		const currentDeltaY = center.y - initialCenter.y;
		const currentRotation = rotation; // Rotation doesn't depend on initialCenter

		// 2. Temporarily remove the transform
		card.style.transition = "none"; // Disable transitions during adjustment
		card.style.transform = "none";

		// 3. Force browser reflow to get the *untouched* layout position
		// Reading offsetWidth is a common way to trigger this synchronously.
		void card.offsetWidth;

		// 4. Recalculate initialCenter based on the *new*, untouched layout
		const newInitialCenter = calculateInitialCenter();

		// 5. Update state variables
		initialCenter = newInitialCenter;
		// Adjust 'center' to maintain the same visual delta relative to the *new* initialCenter
		center.x = initialCenter.x + currentDeltaX;
		center.y = initialCenter.y + currentDeltaY;
		// rotation, velocity, angularVelocity remain unchanged

		// 6. Reapply the transform immediately before the next paint
		// Use the *stored* delta and rotation to put it back visually where it was
		card.style.transform = `translate(${currentDeltaX}px, ${currentDeltaY}px) rotate(${currentRotation}rad)`;

		// 7. Re-enable transitions if they were used
		card.style.transition = ""; // Or restore previous transition style if needed

		// The render loop will continue from this adjusted state.
	}, RESIZE_DEBOUNCE_MS); // Apply debouncing

	// --- Render Loop ---
	function render() {
		if (!state.dragging) {
			// --- Angular Momentum ---

			if (Math.abs(angularVelocity) > 0.001) {
				// Simple exponential damping
				rotation += angularVelocity;
				angularVelocity *= angularVelocityDecay;
			} else angularVelocity = 0;

			// --- Linear Momentum ---

			const speed = Math.sqrt(
				velocity.x * velocity.x + velocity.y * velocity.y,
			);

			if (speed > 0.01) {
				// Calculate speed-dependent damping
				// Clamp speed influence to avoid excessive damping
				const speedInfluence =
					Math.min(speed, maxEffectiveSpeed) / maxEffectiveSpeed;
				const currentDamping =
					baseDamping * (1 - speedInfluence * velocityDecay);
				// Ensure damping doesn't go below a minimum or above 1
				const effectiveDamping = clamp(currentDamping, 0.8, 0.995); // Adjust min/max clamp

				velocity.x *= effectiveDamping;
				velocity.y *= effectiveDamping;

				center.x += velocity.x;
				center.y += velocity.y;
			} else velocity = { x: 0, y: 0 };
		}

		const deltaX = center.x - initialCenter.x;
		const deltaY = center.y - initialCenter.y;

		card.style.transform = `
			translate(${deltaX}px, ${deltaY}px)
			rotate(${rotation}rad)
		`;

		checkViewportExit();
		animationFrameId = requestAnimationFrame(render);
	}

	card.style.cursor = "grab";
	card.style.touchAction = "none";
	card.style.userSelect = "none";

	card.style.transform = `translate(0px, 0px) rotate(${rotation}rad)`;

	card.addEventListener("pointerdown", down, { passive: true });
	window.addEventListener("pointermove", move, { passive: true });
	window.addEventListener("pointerup", up, { passive: true });
	window.addEventListener("pointercancel", up, { passive: true });
	window.addEventListener("resize", handleResize);

	render();

	return function cleanup() {
		if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
		card.removeEventListener("pointerdown", down);
		window.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", up);
		window.removeEventListener("pointercancel", up);
		window.removeEventListener("resize", handleResize);
		card.style.cursor = "";
		card.style.touchAction = "";
		card.style.userSelect = "";
	};
}
