import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Exp from "./pages/Exp";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Live from "./pages/Live";

import NotFound from "./pages/404";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/experience" component={Exp} />
				<Route exact path="/projects" component={Projects} />
				<Route exact path="/contact" component={Contact} />
				<Route exact path="/live" component={Live} />

				<Route component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
