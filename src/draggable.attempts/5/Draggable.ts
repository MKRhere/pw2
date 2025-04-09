interface Vec2 {
	x: number;
	y: number;
}

function getCursorPositionRelativeToElement(
	cursor: Vec2,
	element: HTMLElement,
): Vec2 {
	const size = {
		x: element.offsetWidth,
		y: element.offsetHeight,
	};

	const boundingRect = element.getBoundingClientRect();

	const computedStyle = window.getComputedStyle(element);
	const transformValue = computedStyle.transform;

	if (transformValue === "none" || !transformValue)
		return {
			x: cursor.x - boundingRect.left,
			y: cursor.y - boundingRect.top,
		};

	const matrix = new DOMMatrix(transformValue);

	const centerX = boundingRect.left + boundingRect.width / 2;
	const centerY = boundingRect.top + boundingRect.height / 2;

	const relativeToCenter = {
		x: cursor.x - centerX,
		y: cursor.y - centerY,
	};

	const inverseMatrix = matrix.inverse();

	inverseMatrix.e = 0;
	inverseMatrix.f = 0;

	const transformedPoint = {
		x:
			relativeToCenter.x * inverseMatrix.a +
			relativeToCenter.y * inverseMatrix.c,
		y:
			relativeToCenter.x * inverseMatrix.b +
			relativeToCenter.y * inverseMatrix.d,
	};

	return {
		x: transformedPoint.x + size.x / 2,
		y: transformedPoint.y + size.y / 2,
	};
}

export function makeDraggable(card: HTMLElement) {
	let position: Vec2 = { x: 0, y: 0 };
	let rotation = 0;
	let dragging = false;
	let offset__local: Vec2 = { x: 0, y: 0 };
	let grabAngleLocal = 0;

	let velocity: Vec2 = { x: 0, y: 0 };
	let angularVelocity = 0;

	const dampingFactor = 0.5;
	const springFactor = 0.2;
	const maxAngularVelocity = 0.95;
	const momentumDampening = 0.98;

	let lastMousePosition__page: Vec2 = { x: 0, y: 0 };
	let activePointerId: number | null = null;

	// Keep original factors for momentum physics
	const momentumDampingFactor = 0.7; // Renamed for clarity
	const momentumSpringFactor = 0.2; // Renamed for clarity
	const momentumMaxAngularVelocity = 0.95;
	const momentumDampeningDecay = 0.98; // Renamed for clarity

	// Add a specific damping factor for the active drag rotation spring
	const dragRotationDamping = 0.4; // TUNABLE: Higher value = more damping (less springy/oscillating)

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	const down = (e: PointerEvent) => {
		if (activePointerId !== null) return;

		dragging = true;
		activePointerId = e.pointerId;
		card.setPointerCapture(e.pointerId);

		velocity = { x: 0, y: 0 };
		angularVelocity = 0;

		offset__local = getCursorPositionRelativeToElement(
			{ x: e.pageX, y: e.pageY },
			card,
		);

		const cardWidth = card.offsetWidth;
		const cardHeight = card.offsetHeight;
		const grabCentre__local = {
			x: offset__local.x - cardWidth / 2,
			y: offset__local.y - cardHeight / 2,
		};
		grabAngleLocal = Math.atan2(grabCentre__local.y, grabCentre__local.x);

		lastMousePosition__page = { x: e.pageX, y: e.pageY };
	};

	// TODO: this function is still not working as expected
	// Come back to it some day
	const move = (e: PointerEvent) => {
		if (!dragging || e.pointerId !== activePointerId) return;

		const mx = e.pageX;
		const my = e.pageY;

		// Calculate mouse movement delta
		const mouseDelta = {
			x: mx - lastMousePosition__page.x,
			y: my - lastMousePosition__page.y,
		};

		position.x += mouseDelta.x;
		position.y += mouseDelta.y;

		// Update velocity (for momentum) and last mouse position
		velocity = mouseDelta; // Store the delta for momentum phase
		lastMousePosition__page = { x: mx, y: my };

		const rect = card.getBoundingClientRect();
		// Use rect dimensions in case transforms (like scale) affect offsetWidth/offsetHeight differently
		const cardWidth = rect.width;
		const cardHeight = rect.height;

		const currentCenter__page = {
			x: rect.left + cardWidth / 2 + window.scrollX,
			y: rect.top + cardHeight / 2 + window.scrollY,
		};

		const angleToMouse = Math.atan2(
			my - currentCenter__page.y,
			mx - currentCenter__page.x,
		);

		const angleToMouse_Local = angleToMouse - grabAngleLocal;

		const px = offset__local.x;
		const py = offset__local.y;

		const targetRotation =
			Math.atan2(my - position.y, mx - position.x) - Math.atan2(py, px);

		angularVelocity += (targetRotation - rotation) * springFactor;
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

		// position = {
		// 	x: mx - rx,
		// 	y: my - ry,
		// };
	};

	const up = (e: PointerEvent) => {
		if (e.pointerId === activePointerId) {
			dragging = false;
			activePointerId = null;
			// When dragging stops, the existing angularVelocity
			// is used by the render() loop for momentum.
		}
	};

	card.addEventListener("pointerdown", down, { passive: false });
	window.addEventListener("pointermove", move, { passive: false });
	window.addEventListener("pointerup", up, { passive: false });

	let frame = 0;
	function render() {
		if (!dragging) {
			// --- Momentum Phase ---
			// Use the angularVelocity calculated by the last 'move' or previous 'render' frame
			if (Math.abs(angularVelocity) > 0.001) {
				rotation += angularVelocity; // Apply momentum rotation
				angularVelocity *= momentumDampeningDecay; // Apply decay damping
			} else {
				angularVelocity = 0;
			}

			const speed = Math.sqrt(
				velocity.x * velocity.x + velocity.y * velocity.y,
			);
			if (speed > 0.01) {
				position.x += velocity.x;
				position.y += velocity.y;
				velocity.x *= momentumDampening;
				velocity.y *= momentumDampening;
			} else {
				velocity = { x: 0, y: 0 };
			}
		} // else: if dragging, rotation is updated in move()

		// --- Apply Transform ---
		card.style.transform = `
			translate(${position.x}px, ${position.y}px)
			rotate(${rotation}rad)
		`;
		card.style.transformOrigin = "50% 50%";
		frame = requestAnimationFrame(render);
	}
	render();

	return () => {
		card.removeEventListener("pointerdown", down);
		window.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", up);
		cancelAnimationFrame(frame);
		// Optional: Reset transform on cleanup?
		// card.style.transform = originalTransform || 'none';
		card.style.transformOrigin = "";
	};
}
