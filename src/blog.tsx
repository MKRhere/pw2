import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";

import BlogHome from "./pages/blog/Home";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BlogHome />
	</React.StrictMode>,
);
