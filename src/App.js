import { Router } from "@reach/router";

import Home from "./pages/Home";
import Exp from "./pages/Exp";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

import NotFound from "./pages/404";

function App() {
	return (
		<Router>
			<Home path="/" />
			<Exp path="/experience" />
			<Projects path="/projects" />
			<Contact path="/contact" />

			<NotFound path="*" />
		</Router>
	);
}

export default App;
