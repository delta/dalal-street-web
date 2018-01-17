import * as React from "react";
import { MarketDepth } from "./MarketDepth"
import { TradingHistory } from "./TradingHistory";

export interface OrderBookProps {

}

export class OrderBook extends React.Component<OrderBookProps, {}> {
	render() {
		return (
			<div id="orderbook" className="six wide column box">
				<div className="ui pointing secondary menu">
					<a className="item active" data-tab="market-depth">Market Depth</a>
					<a className="item" data-tab="trading-history">Trading History</a>
					<h3 className="panel-header right item">Order Book</h3>
				</div>
				<MarketDepth stockId={4} />
				<TradingHistory stockId={4} />
			</div>
		);
	}
}