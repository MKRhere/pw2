import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import useLocation from "wouter/use-location";

import { normalise } from "./util";

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

	if (normalised === "/") return <Home />;
	if (normalised === "/experience") return <Exp />;
	if (normalised.startsWith("/experience/")) return <Exp />;
	if (normalised === "/work") return <Work />;
	if (normalised === "/contact") return <Contact />;
	// if (normalised === "/live") return <Live />;
	// if (normalised === "/blog") return <BlogHome />;
	// if (location.startsWith("/blog")) return <BlogPost />;
	return <NotFound />;
}

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Suspense>
			<App />
		</Suspense>
	</React.StrictMode>,
);
