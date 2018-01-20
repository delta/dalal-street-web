import * as React from "react";
import { MarketDepth } from "../OrderBook/MarketDepth";
import { TradingHistory, Trade } from "./TradingHistory";
import { Fragment } from "react";

import { Metadata } from "grpc-web-client";
import { DalalStreamService } from "../../../../proto_build/DalalMessage_pb_service";
import { DataStreamType } from "../../../../proto_build/datastreams/Subscribe_pb";
import { MarketDepthUpdate } from "../../../../proto_build/datastreams/MarketDepth_pb";
import { subscribe } from "../../../streamsutil";

declare var $: any;

export interface OrderBookProps {
	stockId: number
	sessionMd: Metadata
}

interface OrderBookState {
	askDepth: { [index:number]: number },
	bidDepth: { [index:number]: number },
	latestTrades: Trade[]
}

export class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
	constructor(props: OrderBookProps) {
		super(props);
		this.state = {
			askDepth: {},
			bidDepth: {},
			latestTrades: [],
		}
	}

	componentDidMount() {
		alert("hi");
		$("#orderbook-menu .item").tab();
		this.handleMarketDepthStream();
	}

	handleMarketDepthStream = async () => {
		const sessionMd = this.props.sessionMd;
		const stockId = this.props.stockId;

		const subscriptionId = await subscribe(sessionMd, DataStreamType.MARKET_DEPTH, stockId + "");
		const stream = DalalStreamService.getMarketDepthUpdates(subscriptionId, sessionMd);

		for await (const update of stream) {
			console.log("got market depth update", update);
			// is it the first update?
			if (update.getAskDepthMap().toArray().length) {
				const askDepth: { [index:string]: number } = {};
				const bidDepth: { [index:string]: number } = {};

				update.getAskDepthMap().forEach((volume, price) => askDepth[price] = volume);
				update.getBidDepthMap().forEach((volume, price) => bidDepth[price] = volume);

				const latestTrades = update.getLatestTradesList().map(t => {
					return {
						tradePrice: t.getTradePrice(),
						tradeQuantity: t.getTradeQuantity(),
						tradeTime: t.getTradeTime(),
					}
				});

				this.setState({
					askDepth,
					bidDepth,
					latestTrades,
				});
				continue;
			}

			const askDepthDiff = update.getAskDepthDiffMap();
			const bidDepthDiff = update.getBidDepthDiffMap();
			const latestTradesDiff = update.getLatestTradesDiffList();

			const oldAskDepth = Object.assign({}, this.state.askDepth);
			const oldBidDepth = Object.assign({}, this.state.bidDepth);
			const oldLatestTrades = this.state.latestTrades.slice();

			askDepthDiff.forEach((volume, price) => {
				if (!oldAskDepth[price]) oldAskDepth[price] = 0;
				if (volume == 0) delete oldAskDepth[price];
				else 			 oldAskDepth[price] += volume;
			});

			bidDepthDiff.forEach((volume, price) => {
				if (!oldBidDepth[price]) oldBidDepth[price] = 0;
				if (volume == 0) delete oldBidDepth[price];
				else 			 oldBidDepth[price] += volume;
			});

			for (const t of latestTradesDiff) {
				oldLatestTrades.unshift({
					tradePrice: t.getTradePrice(),
					tradeQuantity: t.getTradeQuantity(),
					tradeTime: t.getTradeTime(),
				});
			}

			this.setState({
				askDepth: oldAskDepth,
				bidDepth: oldBidDepth,
				latestTrades: oldLatestTrades.slice(0, 20),
			});

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
				<MarketDepth stockId={this.props.stockId} askDepth={this.state.askDepth} bidDepth={this.state.bidDepth} />
				<TradingHistory stockId={this.props.stockId} latestTrades={this.state.latestTrades} />
			</Fragment>
		);
	}
}