import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Topbar } from "./common/Topbar";
import { TradingTerminal } from "./TradingTerminal";
import { NotFound } from "./NotFound";

export interface MainProps {
	sessionId: string
}

export class Main extends React.Component<MainProps, {}> {
	constructor(props: MainProps) {
		super(props);
	}

	render() {
		
		return (
			<div id="main_container" className="ui stackable grid pusher">
				<Topbar userId={1} />
				<Switch>
					<Route exact path="/trade" component={TradingTerminal} />
					<Route component={NotFound} />
				</Switch>
			</div>
		);
	}
}