import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { TradingTerminal } from "./TradingTerminal";

export interface MainProps {
	sessionId: string
}

export class Main extends React.Component<MainProps, {}> {
	constructor(props: MainProps) {
		super(props);
	}

	render() {
		
		return (
			<main>
				<Switch>
					<Route exact path="/trade" component={TradingTerminal} />
				</Switch>
			</main>
		);
	}
}