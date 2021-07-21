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
