import * as React from "react";

import { OrderBook } from "./OrderBook/OrderBook";
import { OpenOrders } from "./OpenOrders";
import { SearchBar } from "./SearchBar";
import { Notification } from "../common/Notification";
import { PlaceOrderBox } from "./PlaceOrderBox";
import { Charts } from "./charts/Charts";

import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb"

export interface TradingTerminalProps {
	sessionMd: Metadata,
	notifications: Notification_pb[]
}

interface TradingTerminalState {
	stockId: number
}

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

export class TradingTerminal extends React.Component<TradingTerminalProps, TradingTerminalState> {
    constructor(props: TradingTerminalProps) {
        super(props);
        this.state = {
        	stockId: 1
        }
    }

    componentDidMount() {
    	//$('.ui.dropdown').dropdown();
		//$('.menu .item').tab();
    }

    handleStockIdChange = (newStockId: number) => {
    	console.log("Chal gaya bhai apna with value", newStockId);
    	this.setState({
    		stockId: newStockId
    	});
    };

    render(){
        return(
			<div id="trading-terminal" className="main-container ui stackable grid pusher">
				<div className="row" id="top_bar">
					<div id="search-bar" className="">
						<SearchBar stockDetails={stockDetails} handleStockIdCallback={this.handleStockIdChange} defaultStock={this.state.stockId}/>
					</div>

					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
				<div className="row">
					<div id="order-book-container" className="six wide column box">
						<OrderBook stockId={this.state.stockId} />
					</div>

					<div id="charts-container" className="ten wide column box">
						<Charts stockId={this.state.stockId} />
					</div>

					<div id="place-order-box-container" className="six wide column box">
						<PlaceOrderBox stockId={this.state.stockId} currentPrice={100} sessionMd={this.props.sessionMd}/>
					</div>

					<div id="open-orders-container" className="ten wide column box">
						<OpenOrders sessionMd={this.props.sessionMd} />
					</div>
				</div>
			</div>
        );
    }
}