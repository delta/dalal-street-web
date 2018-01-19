import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Notification } from "./common/Notification";
import { TradingTerminal } from "./TradingTerminal";
import { SearchBar } from "./trading_terminal/SearchBar"
import { NotFound } from "./NotFound";
import { subscribe } from "../streamsutil";
import { Metadata } from "grpc-web-client";
import { DalalStreamService } from "../../proto_build/DalalMessage_pb_service";
import { DataStreamType } from "../../proto_build/datastreams/Subscribe_pb";
import { Notification as Notification_pb } from "../../proto_build/models/Notification_pb"

export interface MainProps {
	sessionMd: Metadata
}

interface MainState {
	notifications: Notification_pb[]
}

// We tried out a couple of ways to pass notification from main
// But this served no purpose as it was going to re-render regardless..
export class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props);

		this.state = {
			notifications: []
		}

		this.handleNotificationsStream();
	}

	async handleNotificationsStream() {
		const sessionMd = this.props.sessionMd;

		const subscriptionId = await subscribe(sessionMd, DataStreamType.NOTIFICATIONS);
		const stream = DalalStreamService.getNotificationUpdates(subscriptionId, sessionMd);
	
		for await (const notifUpdate of stream) {
			const notif = notifUpdate.getNotification()!;
			const notifs = this.state.notifications.slice();
			notifs.unshift(notif);

			this.setState({
				notifications: notifs,
			});
			console.log("Notification update", notif.toObject());
		}
	}

	render() {
		return (
				<Switch>
					<Route exact path="/trade" render={() => 
						<TradingTerminal sessionMd={this.props.sessionMd} notifications={this.state.notifications}/>
					} />
					{/* <Route exact path="/portfolio" component={Portfolio} /> */}
					<Route component={NotFound} />
				</Switch>
				
		);
	}
}