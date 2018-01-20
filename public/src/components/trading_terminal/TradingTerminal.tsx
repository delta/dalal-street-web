import * as React from "react";

import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb"

import { OrderBook } from "./OrderBook/OrderBook";
import { OpenOrders } from "./OpenOrders";
import { SearchBar } from "./SearchBar";
import { Notification } from "../common/Notification";
import { PlaceOrderBox } from "./PlaceOrderBox";
import { Charts } from "./charts/Charts";

export type StockBriefInfo = {
	id: number
	shortName: string
	fullName: string
}

export interface TradingTerminalProps {
	sessionMd: Metadata,
	notifications: Notification_pb[]

	userName: string
	userCash: number

	stocksOwnedMap:    { [index:number]: number } // stocks owned by user for a given stockid
	stockBriefInfoMap: { [index:number]: StockBriefInfo } // get stock detail for a given stockid
	stockPricesMap:    { [index:number]: number }
	constantsMap:      { [index:string]: number } // various constants. Documentation found in server/actionservice/Login method

	isMarketOpen: boolean
}

interface TradingTerminalState {
	currentStockId: number
	currentPrice: number
	userCash: number
	stockPricesMap: { [index:number]: number }
}

export class TradingTerminal extends React.Component<TradingTerminalProps, TradingTerminalState> {
    constructor(props: TradingTerminalProps) {
		super(props);

		const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0])
        this.state = {
			currentStockId: currentStockId,
			currentPrice: this.props.stockPricesMap[currentStockId],
			userCash: this.props.userCash,
			stockPricesMap: this.props.stockPricesMap,
        };
	}

	// parent will update the stock prices or cash
	componentWillReceiveProps(nextProps: TradingTerminalProps) {
		this.setState(prevState => {
			return {
				userCash: nextProps.userCash,
				currentPrice: nextProps.stockPricesMap[prevState.currentStockId],
				stockPricesMap: nextProps.stockPricesMap,
			};
		});
	}

	// child will affect the current stock id
    handleStockIdChange = (newStockId: number) => {
    	this.setState(prevState => {
			return {
				currentStockId: newStockId,
				currentPrice: prevState.stockPricesMap[newStockId],
			}
		});
    };

    render() {
        return (
			<div id="trading-terminal" className="main-container ui stackable grid pusher">
				<div className="row" id="top_bar">
					<div id="search-bar">
						<SearchBar
							stockBriefInfoMap={this.props.stockBriefInfoMap}
							stockPricesMap={this.state.stockPricesMap}
							handleStockIdCallback={this.handleStockIdChange}
							defaultStock={this.state.currentStockId} />
					</div>
					<div id="current-price-container" className="left floated">
						<b>Current price: {this.state.currentPrice}</b>
					</div>

					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
				<div className="row">
					<div id="order-book-container" className="six wide column box">
						<OrderBook stockId={this.state.currentStockId} sessionMd={this.props.sessionMd} />
					</div>

					<div id="charts-container" className="ten wide column box">
						<Charts stockId={this.state.currentStockId} />
					</div>

					<div id="place-order-box-container" className="six wide column box">
						<PlaceOrderBox
							stockId={this.state.currentStockId}
							currentPrice={this.state.currentPrice}
							sessionMd={this.props.sessionMd} />
					</div>

					<div id="open-orders-container" className="ten wide column box">
						<OpenOrders sessionMd={this.props.sessionMd} stockBriefInfoMap={this.props.stockBriefInfoMap} />
					</div>
				</div>
			</div>
        );
    }
}