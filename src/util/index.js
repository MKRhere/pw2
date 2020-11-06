export const getTimeout = () => {
	const set = new Set();

	const timeout = (f, t) => {
		const self = set.add(setTimeout(() => (f(), set.delete(self)), t));
	};

	const clearTimers = () => {
		set.forEach(timer => clearTimeout(timer));
		set.clear();
	};

	return [timeout, clearTimers];
};
