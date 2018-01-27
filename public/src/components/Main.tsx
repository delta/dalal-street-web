import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Notification } from "./common/Notification";
import { TradingTerminal, StockBriefInfo } from "./trading_terminal/TradingTerminal";
import { SearchBar } from "./trading_terminal/SearchBar"
import { NotFound } from "./NotFound";

import { Leaderboard } from "./leaderboard/Leaderboard";
import { Portfolio } from "./portfolio/Portfolio";
import { Market } from "./market/Market";

import { Metadata } from "grpc-web-client";
import { DalalActionService, DalalStreamService } from "../../proto_build/DalalMessage_pb_service";
import { GetNotificationsRequest } from "../../proto_build/actions/GetNotifications_pb";
import { DataStreamType, SubscriptionId } from "../../proto_build/datastreams/Subscribe_pb";
import { subscribe, unsubscribe } from "../streamsutil";

import { User as User_pb } from "../../proto_build/models/User_pb";
import { Stock as Stock_pb } from "../../proto_build/models/Stock_pb";
import { Notification as Notification_pb } from "../../proto_build/models/Notification_pb";

import * as jspb from "google-protobuf";
export interface MainProps {
    sessionMd: 		Metadata
    user: 			User_pb

    stocksOwnedMap:  { [index:number]: number } // stocks owned by user for a given stockid
    stockDetailsMap: { [index:number]: Stock_pb } // get stock detail for a given stockid
    constantsMap:    { [index:string]: number } // various constants. Documentation found in server/actionservice/Login method

    marketIsOpenHackyNotif: 	string
    marketIsClosedHackyNotif: 	string
    isMarketOpen: 				boolean
}

interface MainState {
    notifications: 	Notification_pb[]
    userCash:		number
    userTotal:		number

    stocksOwnedMap:  { [index:number]: number } // stocks owned by user for a given stockid
    stockDetailsMap: { [index:number]: Stock_pb } // get stock detail for a given stockid

    isMarketOpen: 				boolean

	notifSubscriptionId: SubscriptionId
	stockSubscriptionId: SubscriptionId

	stockDetails: Stock_pb[]
}

// We tried out a couple of ways to pass notification from main
// But this served no purpose as it was going to re-render regardless..
export class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.state = {
            notifications: [],
            userCash: this.props.user.getCash(),
            userTotal: this.calculateTotal(this.props.user.getCash(), this.props.stocksOwnedMap, this.props.stockDetailsMap),
            stocksOwnedMap: this.props.stocksOwnedMap,
            stockDetailsMap: this.props.stockDetailsMap,
            isMarketOpen: this.props.isMarketOpen,
            notifSubscriptionId: new SubscriptionId,
            stockSubscriptionId: new SubscriptionId,
            stockDetails: [],
        };

        this.handleNotificationsStream();
        this.handleStockPricesStream();
    }

    getStockPrices(stockDetailsMap: { [index:number]: Stock_pb }) {
        const stockPrices: { [index:number]: number } = {};
        for (const stockId in stockDetailsMap) {
            stockPrices[stockId] = stockDetailsMap[stockId].getCurrentPrice();
        }
        return stockPrices;
    }
    calculateTotal(cash: number, stocksOwnedMap: { [index:number]: number }, stockDetailsMap: { [index:number]: Stock_pb }) {
        let total = cash;
        for (const stockId in stocksOwnedMap) {
            total += stocksOwnedMap[stockId] * stockDetailsMap[stockId].getCurrentPrice();
        }
        return total;
    }

    handleNotificationsStream = async () => {
        const sessionMd = this.props.sessionMd;

        // get old notifications
        const notifReq = new GetNotificationsRequest();
        notifReq.setCount(10);
        try {
            const notifs = await DalalActionService.getNotifications(notifReq, sessionMd);
            this.setState({
                notifications: notifs.getNotificationsList()
            });
        } catch(e) {
            alert("error getting notifs");
            console.log(e);
        }

        // subscribe to the news ones
        const subscriptionId = await subscribe(sessionMd, DataStreamType.NOTIFICATIONS);
        const stream = DalalStreamService.getNotificationUpdates(subscriptionId, sessionMd);

        this.setState({
            notifSubscriptionId: subscriptionId,
        });

        for await (const notifUpdate of stream) {
            const notif = notifUpdate.getNotification()!;
            const notifs = this.state.notifications.slice();
            notifs.unshift(notif);

            this.setState({
                notifications: notifs,
            });
            console.log("Notification update", notif.toObject());
        }
    };

    handleStockPricesStream = async () => {
        const sessionMd = this.props.sessionMd;

        const subscriptionId = await subscribe(sessionMd, DataStreamType.STOCK_PRICES);
        const stream = DalalStreamService.getStockPricesUpdates(subscriptionId, sessionMd);

        this.setState({
            stockSubscriptionId: subscriptionId,
        });

        for await (const stockPricesUpdate of stream) {
            const map = stockPricesUpdate.getPricesMap();
            const stocks: { [index:number]: Stock_pb } = Object.assign({}, this.state.stockDetailsMap);
            map.forEach((newPrice, stockId) => {
                const stock = stocks[stockId];
                const oldPrice = stock.getCurrentPrice();
                stocks[stockId].setCurrentPrice(newPrice);

                if (newPrice > stock.getAllTimeHigh()) {
                    stock.setAllTimeHigh(newPrice);
                } else if (newPrice > stock.getDayHigh()) {
                    stock.setDayHigh(newPrice);
                } else if (newPrice < stock.getDayLow()) {
                    stock.setDayLow(newPrice);
                } else if (newPrice < stock.getAllTimeLow()) {
                    stock.setAllTimeLow(newPrice);
                }

                stock.setUpOrDown(stock.getPreviousDayClose() < newPrice);
            });

            this.setState({
                stockDetailsMap: stocks,
                userTotal: this.calculateTotal(this.state.userCash, this.state.stocksOwnedMap, stocks),
            });
            console.log("Stock prices update", stockPricesUpdate.toObject());
        }
    };

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.notifSubscriptionId);
        unsubscribe(this.props.sessionMd, this.state.stockSubscriptionId);
    }

    getWrappedTradingTerminal = () => {
        const stockBriefInfoMap: { [index:number]: StockBriefInfo } = {};
        const stockPricesMap: { [index:number]: number } = {};
        for (const stockId in this.state.stockDetailsMap) {
            const stock = this.state.stockDetailsMap[stockId];

            stockBriefInfoMap[stockId] = {
                id: stock.getId(),
                shortName: stock.getShortName(),
                fullName: stock.getFullName(),
            };

            stockPricesMap[stockId] = stock.getCurrentPrice();
        }

        return (
            <TradingTerminal
                sessionMd={this.props.sessionMd}
                notifications={this.state.notifications}
                userName={this.props.user.getName()}
                userCash={this.state.userCash}
                stocksOwnedMap={this.state.stocksOwnedMap}
                stockBriefInfoMap={stockBriefInfoMap}
                stockPricesMap={stockPricesMap}
                constantsMap={this.props.constantsMap}
                isMarketOpen={this.state.isMarketOpen}
            />
        );
    }

    getWrappedLeaderboard = () => {
        return (
            <Leaderboard
                sessionMd={this.props.sessionMd}
                leaderboardCount={this.props.constantsMap['LEADERBOARD_COUNT']}
                notifications={this.state.notifications}
            />
        );
    }

    getWrappedPortfolio = () => {
        const stockBriefInfoMap: { [index:number]: StockBriefInfo } = {};
        const stockPricesMap: { [index:number]: number } = {};
        for (const stockId in this.state.stockDetailsMap) {
            const stock = this.state.stockDetailsMap[stockId];

            stockBriefInfoMap[stockId] = {
                id: stock.getId(),
                shortName: stock.getShortName(),
                fullName: stock.getFullName(),
            };

            stockPricesMap[stockId] = stock.getCurrentPrice();
        }

        return (
            <Portfolio
                sessionMd={this.props.sessionMd}
                notifications={this.state.notifications}
                stockBriefInfoMap={stockBriefInfoMap}
                stockPricesMap={stockPricesMap}
                transactionCount={this.props.constantsMap['GET_TRANSACTION_COUNT']}
            />
        );
    }

    getWrappedMarket = () => {
		return (
			<Market sessionMd={this.props.sessionMd}
					stockDetailsMap={this.props.stockDetailsMap}
			/>
		);
	}

    render() {
        return (
                <Switch>
                    <Route exact path="/trade" render={this.getWrappedTradingTerminal} />
                    <Route exact path="/portfolio" render={this.getWrappedPortfolio} />
                    <Route exact path="/leaderboard" render={this.getWrappedLeaderboard} />
                    <Route exact path="/market" render={this.getWrappedMarket} />
                    <Route component={NotFound} />
                </Switch>
        );
    }
}