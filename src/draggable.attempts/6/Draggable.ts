interface Vec2 {
	x: number;
	y: number;
}

// --- Debounce Utility ---
function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): T {
	let timeoutId: number | null = null;
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => {
			func.apply(this, args);
			timeoutId = null; // Clear after execution
		}, wait);
	} as T;
}

export function makeDraggable(card: HTMLElement) {
	// --- Initial Setup ---
	const calculateInitialCenter = () => {
		const rect = card.getBoundingClientRect();
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		};
	};

	// Use mutable objects to allow updates in resize handler
	let initialCenter = calculateInitialCenter();
	let center = { ...initialCenter };

	let rotation = 0;
	let dragging = false;
	let offsetLocal = { x: 0, y: 0 };

	let velocity = { x: 0, y: 0 };
	let angularVelocity = 0;

	// --- Constants ---
	const dampingFactor = 0.7;
	const springFactor = 0.2;
	const maxAngularVelocity = 0.95;
	const momentumDampening = 0.98;
	const RESIZE_DEBOUNCE_MS = 100; // Debounce time for resize

	// --- State ---
	let lastMousePosition = { x: 0, y: 0 };
	let activePointerId: number | null = null;
	let animationFrameId: number | null = null;

	// --- Helpers ---
	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function normaliseAngleDifference(delta: number): number {
		// Bring into range (-2PI, 2PI)
		delta = delta % (2 * Math.PI);
		if (delta > Math.PI) delta -= 2 * Math.PI;
		else if (delta <= -Math.PI) delta += 2 * Math.PI;
		return delta;
	}

	// --- Event Handlers ---
	const down = (e: PointerEvent) => {
		if (activePointerId !== null) return;

		dragging = true;
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
		// Stop momentum on new grab
		angularVelocity = 0;
	};

	const move = (e: PointerEvent) => {
		if (!dragging || e.pointerId !== activePointerId) return;

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

		// Apply spring physics to rotation
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
			dragging = false;
			activePointerId = null;
			card.style.cursor = "grab";
			// Momentum is handled in the render loop
		}
	};

	// Debounced Resize Handler using the Reset-Reflow-Recalculate-Reapply strategy
	const handleResize = debounce(() => {
		console.log("handle resize triggered");
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
		if (!dragging) {
			if (Math.abs(angularVelocity) > 0.01) {
				rotation += angularVelocity;
				angularVelocity *= momentumDampening;
			} else {
				angularVelocity = 0;
			}

			const speed = Math.sqrt(
				velocity.x * velocity.x + velocity.y * velocity.y,
			);

			if (speed > 0.01) {
				center.x += velocity.x * 0.4;
				center.y += velocity.y * 0.4;
				velocity.x *= momentumDampening;
				velocity.y *= momentumDampening;
			} else {
				velocity = { x: 0, y: 0 };
			}
		}

		const deltaX = center.x - initialCenter.x;
		const deltaY = center.y - initialCenter.y;

		card.style.transform = `
			translate(${deltaX}px, ${deltaY}px)
			rotate(${rotation}rad)
		`;

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
