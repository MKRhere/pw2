import React from "react";
import useLocation from "wouter/use-location";

export const sleep = (t: number) => new Promise(r => setTimeout(r, t));

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
	const clearables = new Set<number>();

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

export const get = {
	next<X>(xs: X[], i: number) {
		return xs.at((i + 1) % xs.length)!;
	},
	prev<X>(xs: X[], i: number) {
		return xs.at((i - 1) % xs.length)!;
	},
};

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
