import * as React from "react";
import { MarketDepth } from "./MarketDepth"
import { TradingHistory } from "./TradingHistory";
import { Fragment } from "react";

import { Metadata } from "grpc-web-client";
import { DalalStreamService } from "../../../../proto_build/DalalMessage_pb_service";
import { DataStreamType } from "../../../../proto_build/datastreams/Subscribe_pb";
import { subscribe } from "../../../streamsutil";

declare var $: any;

export interface OrderBookProps {
	stockId: number
	sessionMd: Metadata
}

export class OrderBook extends React.Component<OrderBookProps, {}> {
	constructor(props: OrderBookProps) {
		super(props);
	}

	componentDidMount() {
		$("#orderbook-menu .item").tab();
	}

	handleMarketDepthStream = async () => {
		const sessionMd = this.props.sessionMd;
		const stockId = this.props.stockId;

		const subscriptionId = await subscribe(sessionMd, DataStreamType.MARKET_DEPTH, stockId + "");
		const stream = DalalStreamService.getMarketDepthUpdates(subscriptionId, sessionMd);

		for await (const update of stream) {
			console.log("Market Depth update", update.toObject());
		}
	};

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