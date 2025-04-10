import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import useLocation from "wouter/use-location";

import { normalise, useToggle } from "./util";
import Container from "./components/Container";
import { AppContext } from "./AppContext";

const Home = lazy(() => import("./pages/main/Home"));
const Exp = lazy(() => import("./pages/main/Exp"));
const Work = lazy(() => import("./pages/main/Work"));
const Contact = lazy(() => import("./pages/main/Contact"));

const NotFound = lazy(() => import("./pages/main/404"));

function App() {
	const [location, navigate] = useLocation();

	const normalised = normalise(location);

	if (location !== normalised) {
		navigate(normalised, { replace: true });
		return null;
	}

	let child: React.ReactNode;

	if (normalised === "/") child = <Home />;
	else if (normalised === "/experience") child = <Exp />;
	else if (normalised.startsWith("/experience/")) child = <Exp />;
	else if (normalised === "/work") child = <Work />;
	else if (normalised === "/contact") child = <Contact />;
	// if (normalised === "/live") return <Live />;
	// if (normalised === "/blog") return <BlogHome />;
	// if (location.startsWith("/blog")) return <BlogPost />;
	else child = <NotFound />;

	return (
		<Container>
			<Suspense>{child}</Suspense>
		</Container>
	);
}

const ContextApp = () => {
	const context: AppContext = {
		menu: useToggle(false),
		contact: useToggle(false),
	};

	return (
		<AppContext.Provider value={context}>
			<App />
		</AppContext.Provider>
	);
};

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ContextApp />
	</React.StrictMode>,
);
