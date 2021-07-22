// SPDX-FileCopyrightText: (c) 2019 Antonio Russo
// SPDX-License-Identifier: MIT
// Refer: https://github.com/beautifulinteractions/beautiful-react-hooks/blob/5d100663f2b32e2c0c51edf35a05c7487b4b854f/src/useMediaQuery.js

import { useEffect, useState } from "react";

/**
 * Accepts a media query string then uses the
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API to determine if it
 * matches with the current document.<br />
 * It also monitor the document changes to detect when it matches or stops matching the media query.<br />
 * Returns the validity state of the given media query.
 *
 */
const useMediaQuery = (mediaQuery: string) => {
	const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(mediaQuery);
		const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches);

		try {
			mediaQueryList.addEventListener("change", documentChangeHandler);
		} catch (e) {
			//Safari isn't supporting mediaQueryList.addEventListener
			console.error(e);
			mediaQueryList.addListener(documentChangeHandler);
		}

		documentChangeHandler();

		return () => {
			try {
				mediaQueryList.removeEventListener("change", documentChangeHandler);
			} catch (e) {
				//Safari isn't supporting mediaQueryList.removeEventListener
				console.error(e);
				mediaQueryList.removeListener(documentChangeHandler);
			}
		};
	}, [mediaQuery]);

	return isVerified;
};

export default useMediaQuery;
