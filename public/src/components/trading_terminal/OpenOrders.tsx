import * as React from "react";
import { Metadata } from "grpc-web-client";
import { Fragment } from "react";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { GetMyOpenOrdersRequest, GetMyOpenOrdersResponse } from "../../../proto_build/actions/GetMyOrders_pb";
import { Ask as Ask_pb } from "../../../proto_build/models/Ask_pb";
import { Bid as Bid_pb } from "../../../proto_build/models/Bid_pb";

export interface OpenOrdersProps{
	sessionMd: Metadata
}

interface OpenOrdersState {
	isLoading: boolean,
	openAsks: Ask_pb[],
	openBids: Bid_pb[]
}

export class OpenOrders extends React.Component<OpenOrdersProps, OpenOrdersState> {
	constructor(props: OpenOrdersProps) {
		super(props);
		this.state = {
			isLoading: false,
			openAsks: [],
			openBids: []
		};
	}

	componentDidMount() {
		this.setState({
			isLoading: true
		});
		this.fetchExistingOpenOrders();
	}

	fetchExistingOpenOrders = async () => {
		const getOpenOrdersRequest = new GetMyOpenOrdersRequest();

		try {
			const resp = await DalalActionService.getMyOpenOrders(getOpenOrdersRequest, this.props.sessionMd);
			this.setState({
				isLoading: false,
				openAsks: resp.getOpenAskOrdersList(),
				openBids: resp.getOpenBidOrdersList()			
			});
			console.log(resp.getStatusCode(), resp.toObject());
		}
		catch(e) {
			// error could be grpc error or Dalal error. Both handled in exception
			this.setState({
				isLoading: false
			});
			console.log("Error happened! ", e.statusCode, e.statusMessage, e);
		}
	};

	render() {

		if (this.state.isLoading) {
			return (
				<Fragment>
					<div className="ui pointing secondary menu">
						<h3 className="panel-header right item">Open Orders</h3>
					</div>
					<div className="ui segment">
					<div className="ui active dimmer">
						<div className="ui medium text loader">Fetching your orders...</div>
					</div>
					<p></p>
					</div>
				</Fragment>
			);
		}

		const openAsks = this.state.openAsks;
		const openBids = this.state.openBids;

		let askElements = openAsks.map((openAsk) =>
			<tr>
				<td className="red volume"><strong>{openAsk.getStockId()}</strong></td>
				<td className="red volume"><strong>Sell</strong></td>
				<td className="red volume"><strong>{openAsk.getStockQuantity()}</strong></td>
				<td className="red volume"><strong>{openAsk.getStockQuantityFulfilled()}</strong></td>
				<td className="red volume"><strong>{openAsk.getPrice()}</strong></td>
			</tr>
		);

		let bidElements = openBids.map((openBid) =>
			<tr>
				<td className="green volume"><strong>{openBid.getStockId()}</strong></td>
				<td className="green volume"><strong>Buy</strong></td>
				<td className="green volume"><strong>{openBid.getStockQuantity()}</strong></td>
				<td className="green volume"><strong>{openBid.getStockQuantityFulfilled()}</strong></td>
				<td className="green volume"><strong>{openBid.getPrice()}</strong></td>
			</tr>
		);
		
		return (
			<Fragment>
				<div className="ui pointing secondary menu">
					<h3 className="panel-header right item">Open Orders</h3>
				</div>
				<table className="ui inverted table unstackable">
					<thead>
						<tr>
							<th>Company</th>
							<th>Type</th>
							<th>Volume</th>
							<th>Filled</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{askElements}
						{bidElements}
					</tbody>
				</table>
			</Fragment>
		);
	}
}
