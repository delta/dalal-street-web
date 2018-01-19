import * as React from "react";

import { OrderBook } from "./trading_terminal/OrderBook";
import { OpenOrders } from "./trading_terminal/OpenOrders";
import { SearchBar } from "./trading_terminal/SearchBar";
import { Notification } from "./common/Notification";
import { PlaceOrderBox } from "./trading_terminal/PlaceOrderBox";

import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../proto_build/models/Notification_pb"

export interface TradingTerminalProps {
	sessionMd: Metadata,
	notifications: Notification_pb[]
}

interface semantickedJquery {
	(selector: string): semantickedJquery
	dropdown(): void
	tab(): void
}

declare var $: semantickedJquery;

let stockDetails = [
	{
		"stockId": 1,
		"stockName": "Amazon",
		"stockFullName": "Amazon",
		"currentPrice": 100
	},
	{
		"stockId": 2,
		"stockName": "Facebook",
		"stockFullName": "Facebook",
		"currentPrice": 100
	},
	{
		"stockId": 3,
		"stockName": "Firefox",
		"stockFullName": "Firefox",
		"currentPrice": 100
	},
	{
		"stockId": 4,
		"stockName": "Github",
		"stockFullName": "Github",
		"currentPrice": 100
	},
	{
		"stockId": 5,
		"stockName": "Google",
		"stockFullName": "Google",
		"currentPrice": 100
	}
];

export class TradingTerminal extends React.Component<TradingTerminalProps, {}> {
    constructor(props: TradingTerminalProps) {
        super(props);
    }

    componentDidMount() {
    	$('.ui.dropdown').dropdown();
		$('.menu .item').tab();
    }

    render(){
        return(
			<div id="main_container" className="ui stackable grid pusher">
			
				<div className="row" id="top_bar">
					<div id="search-bar" className="left floated">	
						<SearchBar stockDetails={stockDetails} />
					</div>
					
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
				<div className="ui stackable grid pusher">
					<div className="row" id="trading-terminal-row1">
						<OrderBook />
						<div id="chart-container" className="ten wide column box">
						</div>
					</div>
					<div className="row" id="trading-terminal-row2">
						<PlaceOrderBox stockId={1} currentPrice={100} sessionMd={this.props.sessionMd}/>
						<OpenOrders userId={1} />
					</div>
				</div>
			</div>
        );
    }
}