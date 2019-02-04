import * as React from "react";
import { Metadata } from "grpc-web-client";
import { TickerBar } from "./../common/TickerBar";
import { TickerProps, Ticker } from "./../common/Ticker";
import { DataStreamType, SubscriptionId, SubscribeRequest, } from "../../../proto_build/datastreams/Subscribe_pb"
import { subscribe, unsubscribe } from "../../streamsutil";
import { DalalActionService, DalalStreamService } from "../../../proto_build/DalalMessage_pb_service";
import { Stock as Stock_pb } from "../../../proto_build/models/Stock_pb";
import { BuyStocksFromExchangeRequest } from "../../../proto_build/actions/BuyStocksFromExchange_pb";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { StockExchangeDataPoint } from "../../../proto_build/datastreams/StockExchange_pb";

import { showNotif, showErrorNotif, isPositiveInteger } from "../../utils";
import { Fragment } from "react";

declare var $: any;

export interface MarketProps {
    userCash: number,
    userTotal: number,
    connectionStatus: boolean,
    sessionMd: Metadata,
    stockDetailsMap: { [index: number]: Stock_pb },
    notifications: Notification_pb[],
    disclaimerElement: JSX.Element
}

export interface MarketState {
    stockData: { [index: number]: Stock_pb },
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

    purchaseFromExchange = async (event: any, stockId: number) => {
        let stockQuantity = $("#input-" + stockId).val() as number;
        $("#input-" + stockId).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer!");
            return;
        }

        const request = new BuyStocksFromExchangeRequest();
        try {
            request.setStockId(stockId);
            request.setStockQuantity(stockQuantity);
            const resp = await DalalActionService.buyStocksFromExchange(request, this.props.sessionMd);
            // no need to show notif. Transaction will show a notif for this.
        } catch (e) {
            console.log("Error happened while placing order! ", e.statusCode, e.statusMessage, e);
            if (e.IsGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
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
            percentageIncrease = (currentStock.getCurrentPrice() - currentStock.getPreviousDayClose()) * 100 / (currentStock.getPreviousDayClose() + 1);
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
                    <td className="volume"><strong><input id={"input-" + currentStock.getId()} placeholder="0" className="market-input" /></strong></td>
                    <td className="volume"><strong><button className="ui inverted green button" onClick={(e) => { this.purchaseFromExchange(e, currentStock.getId()) }}>Buy</button></strong></td>
                </tr>
            );
        }

        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userTotal={this.props.userTotal} connectionStatus={this.props.connectionStatus} />
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="market-container" className="ui stackable grid pusher main-container">
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
            </Fragment>
        );
    }
}
