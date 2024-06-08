import { useState } from "react";
import useLocation from "wouter/use-location";

export type HookSet<T> = {
	set: Set<T>;
	size: number;
	add: (value: T) => void;
	remove: (value: T) => void;
	clear: () => void;
	has: (value: T) => boolean;
};

const flatten = (set: Set<string>, key: string) =>
	Array.from(set)
		.map(param => `${key}=${encodeURIComponent(param)}`)
		.join("&");

export function useSearchParams(key: string): HookSet<string> {
	const [, navigate] = useLocation();
	const [params, setParams] = useState(
		() => new Set(new URLSearchParams(window.location.search).getAll(key)),
	);

	const add = (value: string) => {
		setParams(prevSet => {
			const newSet = new Set(prevSet);
			newSet.add(value);
			navigate("?" + flatten(newSet, key), { replace: true });
			return newSet;
		});
	};

	const remove = (value: string) => {
		setParams(prevSet => {
			const newSet = new Set(prevSet);
			newSet.delete(value);
			navigate("?" + flatten(newSet, key), { replace: true });
			return newSet;
		});
	};

	const clear = () => {
		setParams(new Set());
		navigate("?", { replace: true });
	};

	return {
		set: params,
		size: params.size,
		add,
		remove,
		clear,
		has: (value: string) => params.has(value),
	};
}

export default useSearchParams;
