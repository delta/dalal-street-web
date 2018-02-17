import * as React from "react";
import { Metadata } from "grpc-web-client";
import { Fragment } from "react";
import { OrderType } from "../../../proto_build/models/OrderType_pb";
import { StockBriefInfo } from "./TradingTerminal";
import { subscribe, unsubscribe } from "../../streamsutil";
import { DataStreamType, SubscriptionId } from "../../../proto_build/datastreams/Subscribe_pb";
import { DalalActionService, DalalStreamService } from "../../../proto_build/DalalMessage_pb_service";
import { GetMyOpenOrdersRequest, GetMyOpenOrdersResponse } from "../../../proto_build/actions/GetMyOrders_pb";
import { CancelOrderRequest } from "../../../proto_build/actions/CancelOrder_pb";
import { Ask as Ask_pb } from "../../../proto_build/models/Ask_pb";
import { Bid as Bid_pb } from "../../../proto_build/models/Bid_pb";

const LIMIT = OrderType.LIMIT;
const MARKET = OrderType.MARKET;
const STOPLOSS = OrderType.STOPLOSS;

declare var PNotify: any;

const orderTypeToStr = (ot: OrderType): string => {
	switch(ot) {
		case LIMIT: return "Limit";
		case MARKET: return "Market";
		case STOPLOSS: return "Stoploss";
	}
	return "";
}

export interface OpenOrdersProps {
	sessionMd: Metadata,
	stockBriefInfoMap: { [index:number]: StockBriefInfo }
}

interface OpenOrdersState {
	isLoading: boolean,
	openAsks: { [index:number]: Ask_pb },
	openBids: { [index:number]:  Bid_pb },
	subscriptionId: SubscriptionId,
}

declare var $:any;

export class OpenOrders extends React.Component<OpenOrdersProps, OpenOrdersState> {
	constructor(props: OpenOrdersProps) {
		super(props);
		this.state = {
			isLoading: false,
			openAsks: {},
			openBids: {},
			subscriptionId: new SubscriptionId,
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

				openAsks: resp.getOpenAskOrdersList().reduce((map,obj) => {
					map[obj.getId()] = obj;
					return map;
				}, {} as {[index:number]: Ask_pb}),
				
				openBids: resp.getOpenBidOrdersList().reduce((map,obj) => {
					map[obj.getId()] = obj;
					return map;
				}, {} as {[index:number]: Bid_pb})		
			});
			
			this.handleMyOrderUpdates();
		}
		catch(e) {
			// error could be grpc error or Dalal error. Both handled in exception
			this.setState({
				isLoading: false
			});
			console.log("Error happened! ", e.statusCode, e.statusMessage, e);
		}
	};

	componentWillUnmount() {
		unsubscribe(this.props.sessionMd, this.state.subscriptionId);
	}

	showModal = (msg: string) => {
        let pnotifyNotif = PNotify.notice({
			title: 'You have a notification',
			text: msg,
			addClass: "pnotify-style",
			modules: {
				NonBlock: {
					nonblock: true
				}
			},
		});
	}
	
	confirmCancelModal = (that: any, orderId: string, isAsk: boolean) => {
		$("#open-orders-confirm-modal")
		.modal({
		  closable  : false,
		  onDeny    : function(){
		  },
		  onApprove : function() {
			that.handleCancelOrder(orderId, isAsk);
		  }
		})
		.modal('show')
	  ;
	}

	handleMyOrderUpdates = async () => {
		const sessionMd = this.props.sessionMd;
		const subscriptionId = await subscribe(sessionMd, DataStreamType.MY_ORDERS);
		const stream = DalalStreamService.getMyOrderUpdates(subscriptionId, sessionMd);

		this.setState({
			subscriptionId: subscriptionId,
		});

		for await (const myOrderUpdate of stream) {
			const orderId = myOrderUpdate.getId();

			// If it's a new order, directly push it to map
			if (myOrderUpdate.getIsNewOrder()) {

				if (myOrderUpdate.getIsAsk()) {
					// It's a newly placed Ask order
					let updatedAsks = this.state.openAsks;
					updatedAsks[orderId] = new Ask_pb();
					updatedAsks[orderId].setId(orderId);
					updatedAsks[orderId].setStockId(myOrderUpdate.getStockId());
					updatedAsks[orderId].setStockQuantity(myOrderUpdate.getStockQuantity());
					updatedAsks[orderId].setOrderType(myOrderUpdate.getOrderType());
					updatedAsks[orderId].setPrice(myOrderUpdate.getOrderPrice());
					this.setState({
						openAsks: updatedAsks
					});
				}
				else {
					// It's a newly placed Bid order
					let updatedBids = this.state.openBids;
					updatedBids[orderId] = new Bid_pb();
					updatedBids[orderId].setId(orderId);
					updatedBids[orderId].setStockId(myOrderUpdate.getStockId());
					updatedBids[orderId].setStockQuantity(myOrderUpdate.getStockQuantity());
					updatedBids[orderId].setOrderType(myOrderUpdate.getOrderType());
					updatedBids[orderId].setPrice(myOrderUpdate.getOrderPrice());
					this.setState({
						openBids: updatedBids
					});
				}
			}
			else {
				// It's an existing open order
				if (myOrderUpdate.getIsAsk()) {
					let updatedAsks = this.state.openAsks;

					if (myOrderUpdate.getIsClosed()) {
						// If order is closed, remove it from the map						
						delete updatedAsks[orderId];
					}
					else {
						// Update StockQuantityFilled
						let currentFilled = updatedAsks[orderId].getStockQuantityFulfilled();
						updatedAsks[orderId].setStockQuantityFulfilled(currentFilled + myOrderUpdate.getTradeQuantity());
					}

					this.setState({
						openAsks: updatedAsks
					});
				}
				else {
					let updatedBids = this.state.openBids;
					// If order is closed, remove it from the map
					if (myOrderUpdate.getIsClosed()) {
						delete updatedBids[orderId];
					}
					else {
						let currentFilled = updatedBids[orderId].getStockQuantityFulfilled();
						updatedBids[orderId].setStockQuantityFulfilled(currentFilled + myOrderUpdate.getTradeQuantity());
					}

					this.setState({
						openBids: updatedBids
					});
				}
			}
		}
	}

	handleCancelOrder = async (orderId: string, isAsk: boolean) => {

		const cancelOrderRequest = new CancelOrderRequest();
		cancelOrderRequest.setOrderId(Number(orderId));
		cancelOrderRequest.setIsAsk(isAsk);

		try {
			const resp = await DalalActionService.cancelOrder(cancelOrderRequest, this.props.sessionMd);
			console.log(resp.getStatusCode(), resp.toObject());

			if (isAsk) {
				let currOpenAsks = this.state.openAsks;
				delete currOpenAsks[Number(orderId)];

				this.setState({
					openAsks: currOpenAsks
				});
			}
			else {
				let currOpenBids = this.state.openBids;
				delete currOpenBids[Number(orderId)];

				this.setState({
					openBids: currOpenBids
				});
			}
			this.showModal("Order cancelled successfully!");
		} catch(e) {
			// error could be grpc error or Dalal error. Both handled in exception
			console.log("Error happened! ", e.statusCode, e.statusMessage, e);
			this.showModal("Error cancelling order!");
		}
	}

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

		// Check if any order has been placed
		if (Object.keys(openAsks).length === 0 && Object.keys(openBids).length === 0) {
			return (
				<Fragment>
					<div className="ui pointing secondary menu">
						<h3 className="panel-header right item">Open Orders</h3>
					</div>
					<div className="ui segment">
						<div className="ui active dimmer">
							<div className="ui medium text no-open-orders">No open orders.</div>
						</div>
					<p></p>
					</div>
				</Fragment>
			);
		}

		const stockInfo = this.props.stockBriefInfoMap;
		let orderElements: any[] = [];

		// counter is used to set key
		let counter = 0;
		for (const askId in openAsks) {
			const stockId = openAsks[askId].getStockId();
			const orderType = orderTypeToStr(openAsks[askId].getOrderType());
			const price = orderType == "Market" ? "N/A" : openAsks[askId].getPrice();

			counter = counter + 1;
			orderElements.push(
				<tr key={counter}>
					<td className="red volume"><strong>{stockInfo[stockId].fullName}</strong></td>
					<td className="red volume"><strong>Sell/{orderType}</strong></td>
					<td className="red volume"><strong>{openAsks[askId].getStockQuantity()}</strong></td>
					<td className="red volume"><strong>{openAsks[askId].getStockQuantityFulfilled()}</strong></td>
					<td className="red volume"><strong>{price}</strong></td>
					<td onClick={e => this.confirmCancelModal(this,askId,true)} className="red cancel-order-button">❌</td>
				</tr>
			);
		}

		for (let bidId in openBids) {
			const stockId = openBids[bidId].getStockId();
			const orderType = orderTypeToStr(openBids[bidId].getOrderType());
			const price = orderType == "Market" ? "N/A" : openBids[bidId].getPrice();

			counter = counter + 1;
			orderElements.push(
				<tr key={counter}>
					<td className="green volume"><strong>{stockInfo[stockId].fullName}</strong></td>
					<td className="green volume"><strong>Buy/{orderTypeToStr(openBids[bidId].getOrderType())}</strong></td>
					<td className="green volume"><strong>{openBids[bidId].getStockQuantity()}</strong></td>
					<td className="green volume"><strong>{openBids[bidId].getStockQuantityFulfilled()}</strong></td>
					<td className="green volume"><strong>{price}</strong></td>
					<td onClick={e => this.confirmCancelModal(this,bidId,false)} className="red cancel-order-button">❌</td>
				</tr>
			);
		}

		return (
			<Fragment>
				<div className="ui pointing secondary menu">
					<h3 className="panel-header right item">Open Orders</h3>
				</div>
				<div>
					<div id="open-orders-confirm-modal" className="ui tiny modal">
						<div className="header">Confirmation</div>
						<div className="content">
							<p>Are you really sure about this?</p>
						</div>
						<div className="actions">
							<div className="ui approve green basic button">
							<i className="checkmark icon"/>
							Yes
							</div>
							<div className="ui cancel red basic button">
							<i className="remove icon"></i>
							No
							</div>
						</div>
					</div>
				</div>
				<table className="ui inverted table unstackable">
					<thead>
						<tr>
							<th>Company</th>
							<th>Type</th>
							<th>Volume</th>
							<th>Filled</th>
							<th>Price</th>
							<th>Cancel</th>
						</tr>
					</thead>
					<tbody>
						{orderElements}
					</tbody>
				</table>
			</Fragment>
		);
	}
}
