import React from "react";

import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/main/Home";
import Exp from "./pages/main/Exp";
import Projects from "./pages/main/Projects";
import Contact from "./pages/main/Contact";
import Live from "./pages/main/Live";

import NotFound from "./pages/main/404";

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/experience" element={<Exp />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/live" element={<Live />} />

				<Route path="/*" element={NotFound} />
			</Routes>
		</Router>
	</React.StrictMode>,
	document.getElementById("root"),
);
