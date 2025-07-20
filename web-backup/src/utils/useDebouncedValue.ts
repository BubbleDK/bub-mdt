import { useEffect, useState } from "react";

export function useDebouncedValue(value: string, delay = 500) {
	const [state, setState] = useState(value);
	const [isDebouncing, setIsDebouncing] = useState(false);

	useEffect(() => {
		setIsDebouncing(true);
		const t = setTimeout(() => {
			setState(value);
			setIsDebouncing(false);
		}, delay);
		return () => {
			clearTimeout(t);
		};
	}, [value, delay]);

	return { debouncedValue: state, isDebouncing };
}
