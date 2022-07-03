import React from "react";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();

	return (link: string) => (e: React.MouseEvent) => {
		if (e.ctrlKey) return window.open(link, "_blank", "noreferrer noopener");
		navigate(link);
	};
};

export function rewriteExtn(filename: string, extn: string) {
	const split = filename.split(".");
	split[split.length - 1] = extn;
	return split.join(".");
}
