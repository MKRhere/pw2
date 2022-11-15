import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/main/Home";
import Exp from "./pages/main/Exp";
import Projects from "./pages/main/Projects";
import Contact from "./pages/main/Contact";
import Live from "./pages/main/Live";

import NotFound from "./pages/main/404";
import BlogHome from "./pages/blog/Home";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/experience" element={<Exp />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/live" element={<Live />} />

				{/* <Route path="/blog" element={<BlogHome />} /> */}
				{/* <Route path="/blog/*" element={<BlogHome />} /> */}

				<Route path="/*" element={<NotFound />} />
			</Routes>
		</Router>
	</React.StrictMode>,
);
