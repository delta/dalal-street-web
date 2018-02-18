import * as React from "react";
import { Metadata } from "grpc-web-client";
import { TickerBar } from "./../common/TickerBar";
import { TickerProps, Ticker } from "./../common/Ticker";
import { DataStreamType, SubscriptionId, SubscribeRequest, } from "../../../proto_build/datastreams/Subscribe_pb"
import { subscribe, unsubscribe } from "../../streamsutil";
import { DalalActionService, DalalStreamService} from "../../../proto_build/DalalMessage_pb_service";
import { Stock as Stock_pb} from "../../../proto_build/models/Stock_pb";
import { BuyStocksFromExchangeRequest } from "../../../proto_build/actions/BuyStocksFromExchange_pb";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { StockExchangeDataPoint } from "../../../proto_build/datastreams/StockExchange_pb";

import { showNotif } from "../../utils";

function isPositiveInteger(x: number): boolean {
    return (!isNaN(x) && x % 1 === 0 && x > 0);
}

declare var $:any;

export interface MarketProps {
    userCash: number,
    userTotal: number,
    sessionMd: Metadata,
    stockDetailsMap: { [index:number]: Stock_pb },
    notifications: Notification_pb[],
    disclaimerElement: JSX.Element  
}

export interface MarketState {
    stockData: { [index: number]: Stock_pb},
    subscriptionId: SubscriptionId,
}

export class Market extends React.Component<MarketProps, MarketState> {
    constructor(props: MarketProps) {
        super(props);

        this.state = {
            stockData: props.stockDetailsMap,
            subscriptionId: new SubscriptionId,
        }
    }

    getStockExchangeStream = async () => {
        const subscribeId = await subscribe(this.props.sessionMd, DataStreamType.STOCK_EXCHANGE);
        const exchangeStream = DalalStreamService.getStockExchangeUpdates(subscribeId, this.props.sessionMd);
        this.setState({
            subscriptionId: subscribeId,
        });

        for await (const update of exchangeStream) {
            console.log(update);
            console.log(update.toObject());
            const exchangeMap = update.getStocksInExchangeMap();
            let currentStockData = this.state.stockData;
            exchangeMap.forEach((dataPoint, stockId) => {
                currentStockData[stockId].setStocksInExchange(dataPoint.getStocksInExchange());
            })

            this.setState({
                stockData: currentStockData,
            });
        }

    }

    purchaseFromExchange = async (stockId: number) => {
        let quantity = $("#input-"+stockId).val()!;
        $("#input-" + stockId).val("");
        if (!isPositiveInteger(Number(quantity))) {
            showNotif("Enter a positive integer!");
            return;
        }
        if (quantity) {
            let myQuantity: number = parseInt(quantity.toString());
            console.log("purchased stock of company " + stockId + " quantity " + myQuantity);

            try {
                const request = new BuyStocksFromExchangeRequest();
                request.setStockId(stockId);
                request.setStockQuantity(myQuantity);
                const resp = await DalalActionService.buyStocksFromExchange(request, this.props.sessionMd);
                showNotif("Order successful!");
                console.log(resp.getStatusCode(), resp.toObject());
            } catch(e) {
                console.log("Error happened while placing order! ", e.statusCode, e.statusMessage, e);
                if (e.IsGrpcError) {
                    showNotif("Oops! Unable to reach server. Please check your internet connection!");
                } else {
                    showNotif("Oops! Something went wrong! " + e.statusMessage);
                }
            }
        }
    }

    componentDidMount() {
        this.getStockExchangeStream();

    }

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.subscriptionId);
    }

    render() {

        let history: any[] = [];
        let percentageIncrease: number;
        let diffClass: string;
        const stockDetailsMap = this.props.stockDetailsMap;
        for (const stockId in stockDetailsMap) {
            diffClass = "red";
            let currentStock = stockDetailsMap[stockId];
            percentageIncrease = (currentStock.getCurrentPrice() - currentStock.getPreviousDayClose())*100/(currentStock.getPreviousDayClose()+1);
            if (percentageIncrease >= 0) {
                diffClass = "green";
            }

            percentageIncrease = parseFloat(percentageIncrease.toFixed(2));
            history.push(
                <tr key={currentStock.getId()}>
                    <td className="volume"><strong>{currentStock.getShortName()}</strong></td>
                    <td className="volume"><strong>{currentStock.getCurrentPrice()}</strong></td>
                    <td className={"volume " + diffClass}><strong>{percentageIncrease}{" %"}</strong></td>
                    <td className="volume"><strong>{currentStock.getStocksInExchange()}</strong></td>
                    <td className="volume"><strong><input id={"input-"+currentStock.getId()} placeholder="0" className="market-input"/></strong></td>
                    <td className="volume"><strong><button className="ui inverted green button" onClick={() => {this.purchaseFromExchange(currentStock.getId())}}>Buy</button></strong></td>
                </tr>
            );
        }

        return (
            <div id="market-container" className="ui stackable grid pusher main-container">
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userTotal={this.props.userTotal} />
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
                <div className="row">
                    <h2 className="ui center aligned icon header inverted">
                        <i className="pie chart icon"></i>
                        <div className="content">
                            Exchange
                            <div className="grey sub header">
                                Buy your way to glory
                            </div>
                        </div>
                    </h2>
                </div>
               <div className="row fifteen wide column centered" id="market-table">
               <table className="ui inverted table unstackable">
					<thead>
						<tr>
							<th>Company</th>
							<th>Current Price</th>
							<th>Increase</th>
                            <th>Available</th>
                            <th>Quantity</th>
                            <th>Action</th>
						</tr>
					</thead>
					<tbody>
						{history}
					</tbody>
				</table>
               </div>
               {this.props.disclaimerElement}
            </div>
        );
    }
}