import React from "react";

import { createRoot } from "react-dom/client";

import useLocation from "wouter/use-location";

import Home from "./pages/main/Home";
import Exp from "./pages/main/Exp";
import Projects from "./pages/main/Projects";
import Contact from "./pages/main/Contact";
import Live from "./pages/main/Live";

import NotFound from "./pages/main/404";
import BlogHome from "./pages/blog/Home";
import { BlogPost } from "./pages/blog/components/BlogContent";
import { normalise } from "./util";

function App() {
	const [location, navigate] = useLocation();

	const normalised = normalise(location);

	if (location !== normalised) {
		navigate(normalised, { replace: true });
		return null;
	}

	switch (normalised) {
		case "/":
			return <Home />;
		case "/experience":
			return <Exp />;
		case "/projects":
			return <Projects />;
		case "/contact":
			return <Contact />;
		case "/live":
			return <Live />;
		case "/blog":
		// return <BlogHome />;
		default:
			// if (location.startsWith("/blog")) return <BlogPost />;
			return <NotFound />;
	}
}

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
