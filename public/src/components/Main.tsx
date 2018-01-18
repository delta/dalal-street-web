import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Notification } from "./common/Notification";
import { TradingTerminal } from "./TradingTerminal";
import { SearchBar } from "./trading_terminal/SearchBar"
import { NotFound } from "./NotFound";
import { Layout } from "./Layout";

export interface MainProps {
	sessionId: string
}
// We tried out a couple of ways to pass notification from main
// But this served no purpose as it was going to re-render regardless..
export class Main extends React.Component<MainProps, {}> {
	constructor(props: MainProps) {
		super(props);
	}

	render() {
		return (

				<Switch>
					<Route exact path="/trade" component={TradingTerminal} />
					{/* <Route exact path="/portfolio" component={Wrapper2} /> */}
					<Route component={NotFound} />
				</Switch>
				
		);
	}
}