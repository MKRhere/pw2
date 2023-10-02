import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";

import useLocation from "wouter/use-location";

import Home from "./pages/main/Home";
import Exp from "./pages/main/Exp";
import Projects from "./pages/main/Projects";
import Contact from "./pages/main/Contact";
import Live from "./pages/main/Live";

import NotFound from "./pages/main/404";
import BlogHome from "./pages/blog/Home";
import { BlogPost } from "./pages/blog/components/BlogContent";

function App() {
	const [location] = useLocation();

	switch (location) {
		case "/":
			return <Home />;
		case "/experience":
		case "/experience/":
			return <Exp />;
		case "/projects":
		case "/projects/":
			return <Projects />;
		case "/contact":
		case "/contact/":
			return <Contact />;
		case "/live":
		case "/live/":
			return <Live />;
		case "/blog":
		case "/blog/":
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
