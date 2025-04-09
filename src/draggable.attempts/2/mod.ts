const rectangle = document.getElementById("rectangle")!;
const handle = document.getElementById("handle")!;
const reference = document.getElementById("reference")!;

class Vec2 {
	constructor(public x: number, public y: number) {}

	toString() {
		return `Vec<${this.x.toString().padStart(3, " ")}, ${this.y
			.toString()
			.padStart(3, " ")}>`;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	eq(v: Vec2) {
		return this.x === v.x && this.y === v.y;
	}

	add(x: number, y: number): Vec2;
	add(v: Vec2): Vec2;
	add(c: number): Vec2;
	add(x: number | Vec2, y?: number) {
		if (x instanceof Vec2) return new Vec2(this.x + x.x, this.y + x.y);
		if (typeof y === "number") return new Vec2(this.x + x, this.y + y);
		return new Vec2(this.x + x, this.y + x);
	}

	sub(x: number, y: number): Vec2;
	sub(v: Vec2): Vec2;
	sub(c: number): Vec2;
	sub(x: number | Vec2, y?: number) {
		if (x instanceof Vec2) return new Vec2(this.x - x.x, this.y - x.y);
		if (typeof y === "number") return new Vec2(this.x - x, this.y - y);
		return new Vec2(this.x - x, this.y - x);
	}

	mult(x: number, y: number): Vec2;
	mult(v: Vec2): Vec2;
	mult(c: number): Vec2;
	mult(x: number | Vec2, y?: number) {
		if (x instanceof Vec2) return new Vec2(this.x * x.x, this.y * x.y);
		if (typeof y === "number") return new Vec2(this.x * x, this.y * y);
		return new Vec2(this.x * x, this.y * x);
	}

	div(x: number, y: number): Vec2;
	div(v: Vec2): Vec2;
	div(c: number): Vec2;
	div(x: number | Vec2, y?: number) {
		if (x instanceof Vec2) return new Vec2(this.x / x.x, this.y / x.y);
		if (typeof y === "number") return new Vec2(this.x / x, this.y / y);
		return new Vec2(this.x / x, this.y / x);
	}
}

class State {
	public dragging: boolean;
	public origin: Vec2;
	public pos: Vec2;
	public size: Vec2;
	public rot: number;
	public cursor: Vec2;

	constructor({
		dragging,
		origin,
		pos,
		size,
		rot,
		cursor,
	}: {
		dragging: boolean;
		origin: Vec2;
		pos: Vec2;
		size: Vec2;
		rot: number;
		cursor: Vec2;
	}) {
		this.dragging = dragging;
		this.origin = origin;
		this.pos = pos;
		this.size = size;
		this.rot = rot;
		this.cursor = cursor;
	}

	toString() {
		return (
			`State [\n` +
			`  dragging: ${this.dragging},\n` +
			`  origin: ${this.origin},\n` +
			`  pos: ${this.pos},\n` +
			`  rot: ${this.rot},\n` +
			`  cursor: ${this.cursor}\n` +
			`]`
		);
	}

	clone() {
		return new State({
			dragging: this.dragging,
			origin: this.origin.clone(),
			size: this.size.clone(),
			pos: this.pos.clone(),
			rot: this.rot,
			cursor: this.cursor?.clone(),
		});
	}

	eq(s: State) {
		return (
			this.dragging === s.dragging &&
			this.origin.eq(s.origin) &&
			this.pos.eq(s.pos) &&
			this.rot === s.rot &&
			this.cursor.eq(s.cursor)
		);
	}
}

function getCursorPositionRelativeToElement(
	cursor: Vec2,
	size: Vec2,
	element: HTMLElement,
) {
	const boundingRect = element.getBoundingClientRect();

	const computedStyle = window.getComputedStyle(element);
	const transformValue = computedStyle.transform;

	if (transformValue === "none" || !transformValue)
		return cursor.sub(boundingRect.left, boundingRect.top);

	const matrix = new DOMMatrix(transformValue);

	const centerX = boundingRect.left + boundingRect.width / 2;
	const centerY = boundingRect.top + boundingRect.height / 2;

	// temporarily convert relative to center for easier calculations
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

	// restore relative to top-left
	return new Vec2(
		transformedPoint.x + size.x / 2,
		transformedPoint.y + size.y / 2,
	);
}

interface Transform {
	translation: Vec2; // equivalent to state.pos
	rotation: number; // equivalent to state.rot
	scale?: Vec2; // if you need scaling, defaults to (1,1)
	origin: Vec2; // equivalent to state.origin
}

function getCursorPositionRelativeToElement2(
	cursor: Vec2, // cursor in page coordinates
	size: Vec2, // original element size
	transform: Transform,
) {
	const scale = transform.scale ?? new Vec2(1, 1);

	// First get cursor position relative to the element's translated position
	const relativeToElement = cursor.sub(transform.translation);

	// Calculate the actual pivot point (origin) for transformations
	const pivotPoint = transform.origin;

	// Get position relative to pivot point
	const relativeToPivot = relativeToElement.sub(pivotPoint);

	// Apply inverse rotation around pivot
	const cosTheta = Math.cos(-transform.rotation);
	const sinTheta = Math.sin(-transform.rotation);
	const rotatedPoint = new Vec2(
		relativeToPivot.x * cosTheta - relativeToPivot.y * sinTheta,
		relativeToPivot.x * sinTheta + relativeToPivot.y * cosTheta,
	);

	// Apply inverse scale if present
	const scaledPoint = transform.scale ? rotatedPoint.div(scale) : rotatedPoint;

	// Add back pivot offset to get final position
	return scaledPoint.add(pivotPoint);
}

const rect = rectangle.getBoundingClientRect();

// state is the source of truth
const state = new State({
	dragging: false,

	// initial origin
	origin: new Vec2(rect.width / 2, rect.height / 2),

	// initial position of the rectangle
	pos: new Vec2(0, 0),

	// size of the rectangle
	size: new Vec2(rect.width, rect.height),

	// initial rotation
	rot: 0,

	// placeholder cursor position
	cursor: new Vec2(0, 0),
});

{
	rectangle.style.transformOrigin = `${state.origin.x}px ${state.origin.y}px`;
	rectangle.style.transform = `translate(${state.pos.x}px, ${state.pos.y}px) rotate(${state.rot}rad)`;
	handle.style.transform = `translate(${state.origin.x}px, ${state.origin.y}px)`;
}

let prev = state.clone();

{
	const rect = rectangle.getBoundingClientRect();
	reference.style.transformOrigin = `${state.origin.x}px ${state.origin.y}px`;
	reference.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
	reference.style.width = `${rect.width}px`;
	reference.style.height = `${rect.height}px`;
}

rectangle.addEventListener("mousedown", e => {
	prev = state.clone();
	state.dragging = true;
});

window.addEventListener("mouseup", () => {
	state.dragging = false;
});

const degree = 180 / Math.PI;

window.addEventListener("mousemove", e => {
	state.cursor = new Vec2(e.pageX, e.pageY);

	if (!state.dragging) return;

	const deltaCursor = state.cursor.sub(prev.cursor);

	state.pos = state.pos.add(deltaCursor);

	const rect = rectangle.getBoundingClientRect();
	reference.style.transformOrigin = `${state.origin.x}px ${state.origin.y}px`;
	reference.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
	reference.style.width = `${rect.width}px`;
	reference.style.height = `${rect.height}px`;

	// state.origin = state.cursor.sub(new Vec2(rect.left, rect.top));
	// state.rot = 0.05 + prev.rot;
	state.origin = getCursorPositionRelativeToElement2(
		state.cursor,
		state.size,
		// rectangle,
		{
			translation: state.pos,
			rotation: state.rot,
			origin: state.origin,
		},
	);

	if (!state.eq(prev)) {
		// always keep DOM updated to state
		rectangle.style.transformOrigin = `${state.origin.x}px ${state.origin.y}px`;
		rectangle.style.transform = `translate(${state.pos.x}px, ${state.pos.y}px) rotate(${state.rot}rad)`;
		handle.style.transform = `translate(${state.origin.x}px, ${state.origin.y}px)`;
	}

	prev = state.clone();
});
