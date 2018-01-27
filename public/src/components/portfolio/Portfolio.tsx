import * as React from "react";
import { Metadata } from "grpc-web-client";

import { Networth } from "./Networth";
import { StockChart } from "./StockChart";
import { Transactions } from "./Transactions";

import { Notification } from "../common/Notification";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";

import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

import { GetPortfolioRequest } from "../../../proto_build/actions/GetPortfolio_pb";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

export interface PortfolioProps {
    sessionMd: Metadata,
    notifications: Notification_pb[],
    transactionCount: number,
    stockBriefInfoMap: { [index:number]: StockBriefInfo },
    stockPricesMap: { [index:number]: number },
}

interface PortfolioState {
    userCash: number,
    userTotal: number,
    chartData: { [index:number]: number },
}

export class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
    constructor(props: PortfolioProps) {
        super(props);

        this.state = {
            userCash: 0,
            userTotal: 0,
            chartData: {},
        };
    }

    componentDidMount() {
        this.getPortfolio();
    }

    componentWillReceiveProps(nextProps: PortfolioProps) {
        // Recalculate net worth on stock price updates
        if (nextProps.stockPricesMap) {
            let total = this.state.userCash;
            const stocksOwnedMap = this.state.chartData;
            for (const stockId in stocksOwnedMap) {
                total += stocksOwnedMap[stockId] * nextProps.stockPricesMap[stockId];
            }
            this.setState({
                userTotal: total,
            });
        }
    }

    getPortfolio = async () => {
        const portfolioRequest = new GetPortfolioRequest();
        try {
            const resp = await DalalActionService.getPortfolio(portfolioRequest,this.props.sessionMd);
            const user = resp.getUser()!;

            let stocksOwnedMap: { [index:number]: number } = {};

            resp.getStocksOwnedMap().forEach((stocksOwned, stockId) => {
                stocksOwnedMap[stockId] = stocksOwned;
            });

            // calculate total as server does not update
            // total of every user on stock price update
            let total = user.getCash();
            for (const stockId in stocksOwnedMap) {
                total += stocksOwnedMap[stockId] * this.props.stockPricesMap[stockId];
            }

            this.setState({
                userCash: user.getCash(),
                userTotal: total,
                chartData: stocksOwnedMap,
            });
        }
        catch(e) {
            // error could be grpc error or Dalal error. Both handled in exception
			console.log("Error happened! ", e.statusCode, e.statusMessage, e);
        }
    }

    transactionUpdatesCallback = (stockId: number, stockQuantity: number, total: number) => {
        this.setState((prevState) => {
            const newCash = prevState.userCash + total;
            let newChartData = prevState.chartData;

            if (!newChartData[stockId]) {
                newChartData[stockId] = 0;
            }
            newChartData[stockId] += stockQuantity;

            // not checking <= 0 because of negative sign may occur during short selling
            if (newChartData[stockId] == 0) {
                delete newChartData[stockId];
            }
            return {
                userCash: newCash,
                chartData: newChartData,
            };
        });
    }

    render() {
        return (
            <div id="portfolio-container" className="main-container ui stackable grid pusher">
				<div className="row" id="top_bar">
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
                <div id="stockchart-container" className="row">
                    <StockChart
                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                        chartData={this.state.chartData}
                    />
                </div>
                <div id="networth-container" className="row">
                    <Networth
                        userCash={this.state.userCash}
                        userTotal={this.state.userTotal}
                    />
                </div>
                <div id="transactions-container" className="row fifteen wide column centered">
                    <Transactions
                        sessionMd={this.props.sessionMd}
                        transactionCount={this.props.transactionCount}
                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                        transactionUpdatesCallback={this.transactionUpdatesCallback}
                    />
                </div>
            </div>
        );
    }
}