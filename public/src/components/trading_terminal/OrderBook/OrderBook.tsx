import * as React from "react";
import { MarketDepth } from "./MarketDepth"
import { TradingHistory } from "./TradingHistory";
import { Fragment } from "react";

declare var $: any;

export interface OrderBookProps {
	stockId: number
}

export class OrderBook extends React.Component<OrderBookProps, {}> {
	constructor(props: OrderBookProps) {
		super(props);
	}

	componentDidMount() {
		$("#orderbook-menu .item").tab();
	}

	render() {
		return (
			<Fragment>
				<div id="orderbook-menu" className="ui pointing secondary menu">
					<a className="item active" data-tab="market-depth">Market Depth</a>
					<a className="item" data-tab="trading-history">Trading History</a>
					<h3 className="panel-header right item">Order Book</h3>
				</div>
				<MarketDepth stockId={this.props.stockId} />
				<TradingHistory stockId={this.props.stockId} />
			</Fragment>
		);
	}
}