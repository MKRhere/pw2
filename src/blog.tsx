import React from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

import BlogHome from "./pages/blog/Home";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<BlogHome />
		</Router>
	</React.StrictMode>,
);
