import { Router } from "@reach/router";

import Home from "./pages/Home";
import Exp from "./pages/Exp";
import Projects from "./pages/Projects";

function App() {
	return (
		<Router>
			<Home path="/" />
			<Exp path="/experience" />
			<Projects path="/projects" />
		</Router>
	);
}

export default App;
