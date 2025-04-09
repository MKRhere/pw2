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
	onPageExit?: () => void;
	onPageEnter?: () => void;
}

export function makeDraggable(card: HTMLElement, opts: DraggableOpts = {}) {
	// --- Initial Setup ---
	const calculateInitialCenter = (): Vec2 => {
		const rect = card.getBoundingClientRect();
		return {
			x: rect.left + rect.width / 2 + window.scrollX,
			y: rect.top + rect.height / 2 + window.scrollY,
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
	let isOutsideBounds = false;

	// --- Helpers ---

	const checkPageBounds = throttle(() => {
		if (state.dragging) return;

		const rect = card.getBoundingClientRect();
		const pageLeft = rect.left + window.scrollX;
		const pageTop = rect.top + window.scrollY;
		const pageRight = rect.right + window.scrollX;
		const pageBottom = rect.bottom + window.scrollY;

		const outside =
			pageRight < 0 ||
			pageBottom < 0 ||
			pageLeft > document.documentElement.scrollWidth ||
			pageTop > document.documentElement.scrollHeight;

		if (outside !== isOutsideBounds) {
			isOutsideBounds = outside;
			if (isOutsideBounds) opts.onPageExit?.();
			else opts.onPageEnter?.();
		}
	}, VIEWPORT_CHECK_INTERVAL_MS);

	// --- Event Handlers ---
	const down = (e: PointerEvent) => {
		if (activePointerId !== null) return;

		state.dragging = true;
		activePointerId = e.pointerId;
		card.style.cursor = "grabbing";
		document.body.style.cursor = "grabbing";
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

		document.body.style.userSelect = "none";
		document.body.style.webkitUserSelect = "none";
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

	const cancel = () => {
		state.dragging = false;
		activePointerId = null;
		document.body.style.cursor = "";
		card.style.cursor = "grab";
		document.body.style.userSelect = "auto";
		document.body.style.webkitUserSelect = "auto";
		// Momentum is handled in the render loop
	};

	const up = (e: PointerEvent | FocusEvent | KeyboardEvent) => {
		if ("pointerId" in e && e.pointerId === activePointerId) return cancel();
		else if ("key" in e && e.key === "Escape") return cancel();
		else return cancel();
	};

	// Debounced Resize Handler using the Reset-Reflow-Recalculate-Reapply strategy
	const handleResize = debounce(() => {
		// 1. Store current visual state relative to the *old* initialCenter
		const currentDeltaX = center.x - initialCenter.x;
		const currentDeltaY = center.y - initialCenter.y;

		// 2. Temporarily remove the transform
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
		card.style.transform = `translate(${currentDeltaX}px, ${currentDeltaY}px) rotate(${rotation}rad)`;

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

		checkPageBounds();
		animationFrameId = requestAnimationFrame(render);
	}

	card.style.cursor = "grab";
	card.style.touchAction = "none";

	card.style.transform = `translate(0px, 0px) rotate(${rotation}rad)`;
	card.style.willChange = "transform";

	const abort = new AbortController();
	const evtOpts = { passive: true, signal: abort.signal };

	card.addEventListener("pointerdown", down, evtOpts);
	window.addEventListener("pointermove", move, evtOpts);
	window.addEventListener("pointerup", up, evtOpts);
	window.addEventListener("pointercancel", up, evtOpts);
	window.addEventListener("blur", up, evtOpts);
	window.addEventListener("keydown", up, evtOpts);
	window.addEventListener("resize", handleResize);

	render();

	return function cleanup() {
		abort.abort();
		if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
		document.body.style.cursor = "";
		card.style.touchAction = "";
		card.style.userSelect = "";
	};
}
