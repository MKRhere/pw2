import { Toggle } from "./util";
import { createContext } from "react";

export interface AppContext {
	menu: Toggle;
	contact: Toggle;
}

// state will be set upon initialisation
export const AppContext = createContext<AppContext>({} as AppContext);
