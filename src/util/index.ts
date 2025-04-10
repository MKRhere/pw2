import React from "react";
import useLocation from "wouter/use-location";

export const sleep = (t: number) => new Promise(r => setTimeout(r, t));

type Ref<T> =
	| React.MutableRefObject<T | null>
	| React.RefCallback<T | null>
	| React.ForwardedRef<T>;

export const composeRefs = <T>(...refs: Ref<T | null>[]) => {
	return (el: T) => {
		refs.forEach(ref => {
			if (typeof ref === "function") ref(el);
			else if (ref) ref.current = el;
		});
	};
};

export function* intersperse<T, U>(
	xs: T[],
	delim: (index: number) => U,
): Generator<T | U> {
	let first = true;
	let i = 0;
	for (const x of xs) {
		if (!first) {
			yield delim(i);
			i++;
		}
		first = false;
		yield x;
		i++;
	}
}

export const getTimeout = () => {
	const clearables = new Set<ReturnType<typeof setTimeout>>();

	const timeout = (f: (...attr: any[]) => any, t: number) => {
		const self = setTimeout(() => (f(), clearables.delete(self)), t);
		clearables.add(self);
	};

	const clearTimers = () => {
		clearables.forEach(timer => clearTimeout(timer));
		clearables.clear();
	};

	return [timeout, clearTimers] as const;
};

export function debounce<Fn extends (...args: any[]) => void>(
	func: Fn,
	wait: number,
): Fn {
	let timeoutId: number | null = null;
	return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			func.apply(this, args);
			timeoutId = null;
		}, wait);
	} as Fn;
}

export const throttle = <Fn extends (...args: any[]) => void>(
	fn: Fn,
	wait: number,
): Fn => {
	let inThrottle = false;
	let lastFn: ReturnType<typeof setTimeout> | undefined = undefined;
	let lastTime = 0;

	return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
		const context = this;
		if (!inThrottle) {
			fn.apply(context, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(function () {
				if (Date.now() - lastTime >= wait) {
					fn.apply(context, args);
					lastTime = Date.now();
				}
			}, Math.max(wait - (Date.now() - lastTime), 0));
		}
	} as Fn;
};

export const ellipses = (text: string, length: number = 100) =>
	text.length > length ? text.slice(0, length - 3) + "..." : text;

export const useNav = () => {
	const [location, navigate] = useLocation();

	return [
		location,
		(link: string) => (e: React.MouseEvent | KeyboardEvent) => {
			e?.preventDefault();
			if (e.ctrlKey) return window.open(link, "_blank", "noreferrer noopener");
			navigate(link);
		},
	] as const;
};

export function rewriteExtn(filename: string, extn: string) {
	const split = filename.split(".");
	split[split.length - 1] = extn;
	return split.join(".");
}

export function normalise(path: string) {
	return (
		(path.startsWith("/") ? "/" : "") +
		path.trim().split("/").filter(Boolean).join("/")
	);
}

export function comparePaths(p1: string, p2: string) {
	return normalise(p1) === normalise(p2);
}

// required css is inlined in index.html
export function setupCursorTracking(el: HTMLElement | null) {
	if (!el) return;

	el.addEventListener("mousemove", e => {
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		el.style.setProperty("--x", x + "px");
		el.style.setProperty("--y", y + "px");
	});
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function normaliseAngleDifference(delta: number): number {
	// Bring into range (-2PI, 2PI)
	delta = delta % (2 * Math.PI);
	if (delta > Math.PI) delta -= 2 * Math.PI;
	else if (delta <= -Math.PI) delta += 2 * Math.PI;
	return delta;
}
