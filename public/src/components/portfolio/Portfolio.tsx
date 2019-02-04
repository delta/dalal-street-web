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

export interface PortfolioProps {
    sessionMd: Metadata,
    notifications: Notification_pb[],
    transactionCount: number,
    userCash: number,
    userTotal: number,
    connectionStatus: boolean,
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stockPricesMap: { [index: number]: number },
    stocksOwnedMap: { [index: number]: number },
    latestTransaction: Transaction_pb,
    disclaimerElement: JSX.Element
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
                    <TinyNetworth userCash={this.props.userCash} userTotal={this.props.userTotal} connectionStatus={this.props.connectionStatus} />
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="portfolio-container" className="main-container ui stackable grid pusher">
                    <div id="stockchart-container" className="row">
                        <StockChart
                            stockBriefInfoMap={this.props.stockBriefInfoMap}
                            chartData={this.props.stocksOwnedMap}
                        />
                    </div>
                    <div id="networth-container" className="row">
                        <Networth
                            userCash={this.props.userCash}
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
