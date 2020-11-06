export const getTimeout = () => {
	const clearables = new Set();

	const timeout = (f, t) => {
		const self = clearables.add(setTimeout(() => (f(), clearables.delete(self)), t));
	};

	const clearTimers = () => {
		clearables.forEach(timer => clearTimeout(timer));
		clearables.clear();
	};

	return [timeout, clearTimers];
};
