import * as React from "react";
import { Metadata } from "grpc-web-client";

import { Networth } from "./Networth";
import { StockChart } from "./StockChart";
import { Transactions } from "./Transactions";

import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Transaction as Transaction_pb } from "../../../proto_build/models/Transaction_pb";

import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

import { GetPortfolioRequest } from "../../../proto_build/actions/GetPortfolio_pb";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Fragment } from "react";
import { StockCharts } from "./StockCharts";
declare var $: any; // $ will be exposed globally by jQuery

export interface PortfolioProps {
    sessionMd: Metadata,
    notifications: Notification_pb[],
    transactionCount: number,
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userName: string,
    connectionStatus: boolean,
    isMarketOpen: boolean,
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stockPricesMap: { [index: number]: number },
    stocksOwnedMap: { [index: number]: number },
    stocksReservedMap: { [index: number]: number },
    latestTransaction: Transaction_pb,
    disclaimerElement: JSX.Element,
    reservedStocksWorth: number,
}

interface PortfolioState {
}


export class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
    constructor(props: PortfolioProps) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth={this.props.reservedStocksWorth} userTotal={this.props.userTotal} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} />
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                    <div id="portfolio-name"> <h3>{this.props.userName}'s Portfolio</h3></div>
                </div>
                <div id="portfolio-container" className="main-container ui stackable grid pusher">
                    <StockCharts
                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                        stocksOwnedMap={this.props.stocksOwnedMap}
                        stocksReservedMap={this.props.stocksReservedMap}
                    />

                    <div id="networth-container" className="row">
                        <Networth
                            userCash={this.props.userCash}
                            userReservedCash={this.props.userReservedCash}
                            userTotal={this.props.userTotal}
                        />
                    </div>
                    <div id="transactions-container" className="row fifteen wide column centered">
                        <Transactions
                            sessionMd={this.props.sessionMd}
                            transactionCount={this.props.transactionCount}
                            stockBriefInfoMap={this.props.stockBriefInfoMap}
                            latestTransaction={this.props.latestTransaction}
                        />
                    </div>
                    {this.props.disclaimerElement}
                </div>
            </Fragment>
        );
    }
}
