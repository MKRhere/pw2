import { useState } from "react";

export type HookSet<T> = {
	size: number;
	set: Set<T>;
	add: (value: T) => void;
	remove: (value: T) => void;
	clear: () => void;
	has: (value: T) => boolean;
};

function useSet<T>(initialValues: T[] = []): HookSet<T> {
	const [set, setSet] = useState(new Set(initialValues));

	const add = (value: T) => {
		setSet(prevSet => new Set([...prevSet, value]));
	};

	const remove = (value: T) => {
		setSet(prevSet => {
			const newSet = new Set(prevSet);
			newSet.delete(value);
			return newSet;
		});
	};

	const clear = () => {
		setSet(new Set());
	};

	return {
		size: set.size,
		set,
		add,
		remove,
		clear,
		has: (value: T) => set.has(value),
	};
}

export default useSet;
