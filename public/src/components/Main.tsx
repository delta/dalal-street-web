import * as React from "react";
import { Notification } from "./common/Notification";
import { TradingTerminal, StockBriefInfo } from "./trading_terminal/TradingTerminal";
import { SearchBar } from "./trading_terminal/SearchBar"
import { NotFound } from "./NotFound";

import { showNotif, showSuccessNotif, showErrorNotif, showInfoNotif, isPositiveInteger, closeNotifs } from "../utils";

import { Leaderboard } from "./leaderboard/Leaderboard";
import { Portfolio } from "./portfolio/Portfolio";
import { Market } from "./market/Market";
import { News } from "./news/News";
import { Company } from "./companies/Companies";
import { Mortgage } from "./mortgage/Mortgage";
import { Help } from "./help/Help";

import { Metadata } from "grpc-web-client";
import { DalalActionService, DalalStreamService } from "../../proto_build/DalalMessage_pb_service";
import { GetNotificationsRequest } from "../../proto_build/actions/GetNotifications_pb";
import { DataStreamType, SubscriptionId } from "../../proto_build/datastreams/Subscribe_pb";
import { subscribe, unsubscribe } from "../streamsutil";

import { User as User_pb } from "../../proto_build/models/User_pb";
import { Stock as Stock_pb } from "../../proto_build/models/Stock_pb";
import { Notification as Notification_pb } from "../../proto_build/models/Notification_pb";
import { Transaction as Transaction_pb, TransactionType as TransactionType_pb, TransactionType } from "../../proto_build/models/Transaction_pb";

import * as jspb from "google-protobuf";
import { Admin } from "./admin/Admin";

declare var $: any;
declare var PNotify: any;
declare var moment: any;

export interface MainProps {
    sessionMd: 		Metadata
    user: 			User_pb

    stocksOwnedMap:  { [index:number]: number } // stocks owned by user for a given stockid
    stockDetailsMap: { [index:number]: Stock_pb } // get stock detail for a given stockid
    stocksReservedMap: {[index: number]: number} //stocks reserved from user for a given stockid
    constantsMap:    { [index:string]: number } // various constants. Documentation found in server/actionservice/Login method

    marketIsOpenHackyNotif: 	string
    marketIsClosedHackyNotif: 	string
    isMarketOpen: 				boolean
}

interface MainState {
    notifications: 	Notification_pb[]
    userCash:		number
    userReservedCash: number
    userTotal:		number

    stocksOwnedMap:    { [index:number]: number } // stocks owned by user for a given stockid
    stockDetailsMap:   { [index:number]: Stock_pb } // get stock detail for a given stockid
    stocksReservedMap: {[index: number]: number} //stocks reserved from user for a given stockid
    stockBriefInfoMap: { [index:number]: StockBriefInfo }

    isMarketOpen: 	boolean

    notifSubscriptionId: SubscriptionId
    stockSubscriptionId: SubscriptionId
    transactionSubcriptionId: SubscriptionId

    stockDetails: Stock_pb[]

    latestTransaction: Transaction_pb

    connectionStatus: boolean
    networkTimeOut: number
    networkTimeOutCounterNotifs: number
    networkTimeOutCounterTrans: number
    networkTimeOutCounterPrices: number
    successCounter: number // goes up to 3
}

// We tried out a couple of ways to pass notification from main
// But this served no purpose as it was going to re-render regardless..
export class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        const stockBriefInfoMap : { [index:number]: StockBriefInfo } = {};
        for (const stockId in this.props.stockDetailsMap) {
            const stock = this.props.stockDetailsMap[stockId];

            stockBriefInfoMap[stockId] = {
                id: stock.getId(),
                shortName: stock.getShortName(),
                fullName: stock.getFullName(),
                previousDayClose: stock.getPreviousDayClose(),
            };
        }

        this.state = {
            notifications: [],
            userCash: this.props.user.getCash(),
            userReservedCash: this.props.user.getReservedCash(),
            userTotal: this.calculateTotal(this.props.user.getCash(), this.props.stocksOwnedMap, this.props.stockDetailsMap),
            stocksOwnedMap: this.props.stocksOwnedMap,
            stockDetailsMap: this.props.stockDetailsMap,
            stocksReservedMap: this.props.stocksReservedMap,
            stockBriefInfoMap: stockBriefInfoMap,
            isMarketOpen: this.props.isMarketOpen,
            notifSubscriptionId: new SubscriptionId,
            stockSubscriptionId: new SubscriptionId,
            transactionSubcriptionId: new SubscriptionId,
            stockDetails: [],
            latestTransaction: new Transaction_pb,
            networkTimeOut: moment(),
            networkTimeOutCounterNotifs: 1,
            networkTimeOutCounterTrans: 1,
            networkTimeOutCounterPrices: 1,
            successCounter: 0,
            connectionStatus: true,
        };

        this.handleNotificationsStream();
        this.handleStockPricesStream();
        this.handleTransactionsStream();
    }

    disclaimerElement = (
        <div className="row disclaimer-footer">
            Disclaimer : Stock prices and news articles released in this game are entirely fictitious and in no way related to the real world.<br></br>
            &copy; Made with <span className="red">&hearts;</span> by <a href="https://delta.nitt.edu">Delta Force</a>
         </div>
    );

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

    connectionSucceeded = () => {
        if (this.state.successCounter == 2) {
            showSuccessNotif("Connected to server", "Success");
            this.setState({
                networkTimeOut: moment(),
                successCounter: 0,
                networkTimeOutCounterNotifs: 1,
                networkTimeOutCounterTrans: 1,
                networkTimeOutCounterPrices: 1,
                connectionStatus: true,
            });
        } else {
            let sc = this.state.successCounter;
            this.setState({
                successCounter: sc+1,
            });
        }
    }

    getStreamCounter = (flag: string) => {
       if(flag === "notifications")
          return this.state.networkTimeOutCounterNotifs;
       else if(flag === "transactions")
          return this.state.networkTimeOutCounterTrans;
       else if(flag === "stockPrices")
          return this.state.networkTimeOutCounterPrices;
        else return -1;
    }

    setStreamCounter = (flag: string, counter : number) => {
        if(flag === "notifications")
           this.setState({
             networkTimeOutCounterNotifs:counter,
           });
        if(flag === "transactions")
          this.setState({
          networkTimeOutCounterTrans:counter,
          });
        if(flag === "stockPrices")
          this.setState({
            networkTimeOutCounterPrices:counter,
          });
    }

    retryStream = (func: Function, flag: string) => {
      this.setState({
        connectionStatus: false,
      });
      let counter = this.getStreamCounter(flag);
       if(counter != -1 && counter <= 3600)
       {
          counter = counter * 1.24;
          this.setStreamCounter(flag,counter);
          const endtime = moment();
          if(endtime.diff(this.state.networkTimeOut) >= 20000)
            {
              this.setState({
                networkTimeOut: moment(),
              });
              PNotify.removeAll();

              showErrorNotif("Unable to connect to server. Please check your internet connection. Retrying in " + (Math.round(counter)) + "s", "Network error");
              }
          setTimeout(func,counter*1000);
      }
    }

    handleNotificationsStream = async () => {
        const sessionMd = this.props.sessionMd;

        // get old notifications
        const notifReq = new GetNotificationsRequest();
        notifReq.setCount(10);
        try {
            const notifs = await DalalActionService.getNotifications(notifReq, sessionMd);
            if(notifs.getNotificationsList().length === 0){
              let blankNotif : Notification_pb = new Notification_pb;
              blankNotif.setText("Nothing new here");
              let blankNotifList = this.state.notifications;
              blankNotifList[0] = blankNotif;
               this.setState({
                 notifications:blankNotifList
               });
             }
               else
            this.setState({
                notifications: notifs.getNotificationsList()
            });
        } catch(e) {
            console.log(e);
            return this.retryStream(this.handleNotificationsStream.bind(this),"notifications");
        }

        // subscribe to the news ones
        let subscriptionId, stream;
        try {
            subscriptionId = await subscribe(sessionMd, DataStreamType.NOTIFICATIONS);
            stream = DalalStreamService.getNotificationUpdates(subscriptionId, sessionMd);

            this.setState({
                notifSubscriptionId: subscriptionId,
            });
        }
        catch(e) {
            console.log(e);
            return this.retryStream(this.handleNotificationsStream.bind(this),"notifications");
        }

        this.connectionSucceeded();

        try {
            for await (const notifUpdate of stream) {
                const notif = notifUpdate.getNotification()!;
                // checking for market close
                let isMarketOpen: boolean = this.state.isMarketOpen;
                if (notif.getText() == this.props.marketIsClosedHackyNotif) {
                    isMarketOpen = false;
                } else if (notif.getText() == this.props.marketIsOpenHackyNotif) {
                    isMarketOpen = true;
                }

                showInfoNotif(notif.getText(), "New Notification");

                const notifs = this.state.notifications.slice();
                notifs.unshift(notif);

                this.setState({
                    isMarketOpen: isMarketOpen,
                    notifications: notifs,
                });
            }
        }
        catch(e) {
            console.log(e);
            return this.retryStream(this.handleNotificationsStream.bind(this),"notifications");
        }
    };

    componentDidMount() {
        if (!localStorage.getItem('first_time_dalal')) {
            showInfoNotif("Do checkout the help section before you start trading", "New notification");
        }
    }

    handleStockPricesStream = async () => {
        const sessionMd = this.props.sessionMd;

        let subscriptionId, stream;
        try {
            subscriptionId = await subscribe(sessionMd, DataStreamType.STOCK_PRICES);
            stream = DalalStreamService.getStockPricesUpdates(subscriptionId, sessionMd);

            this.setState({
                stockSubscriptionId: subscriptionId,
            });
        }
        catch(e) {
            console.log(e);
            return this.retryStream(this.handleStockPricesStream.bind(this), "stockPrices");
        }

        this.connectionSucceeded();

        try {
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
            }
        }
        catch(e) {
            console.log(e);
            return this.retryStream(this.handleStockPricesStream.bind(this), "stockPrices");
        }
    };

    handleTransactionsStream = async () => {
        const props = this.props;

        let subscriptionId, stream;
        try {
            subscriptionId = await subscribe(props.sessionMd, DataStreamType.TRANSACTIONS);
            stream = DalalStreamService.getTransactionUpdates(subscriptionId, props.sessionMd);

            this.setState({
                transactionSubcriptionId: subscriptionId,
            });
        }
        catch(e) {
            console.log(e);
            return this.retryStream(this.handleTransactionsStream.bind(this), "transactions");
        }

        // Getting copy of stocksOwnedMap
        // To be updated by transactions stream
        let stocksOwnedMap = this.state.stocksOwnedMap;
        let stocksReservedMap = this.state.stocksReservedMap;
        let userCash = this.state.userCash;
        let reservedCash = this.state.userReservedCash;

        this.connectionSucceeded();

        try {
            for await (const update of stream) {
                const newTransaction = update.getTransaction()!;
                console.log(newTransaction)
                            
                userCash+=newTransaction.getTotal();
                reservedCash+=newTransaction.getReservedCashTotal();
                if (newTransaction.getStockId() in stocksOwnedMap) {
                    stocksOwnedMap[newTransaction.getStockId()] += newTransaction.getStockQuantity();
                }
                else {
                    stocksOwnedMap[newTransaction.getStockId()] = newTransaction.getStockQuantity();
                }

                if (newTransaction.getStockId() in stocksReservedMap) {
                    stocksReservedMap[newTransaction.getStockId()] += newTransaction.getReservedStockQuantity();
                }
                else {
                    stocksReservedMap[newTransaction.getStockId()] = newTransaction.getReservedStockQuantity();
                }                  

                try {
                    let notif = "";
                    const stockName = this.state.stockDetailsMap[newTransaction.getStockId()].getShortName();
                    const stockQty = newTransaction.getStockQuantity();
                    const price = newTransaction.getPrice();
                    const total = newTransaction.getTotal();
                    const stockOrStocks = "stock" + (Math.abs(stockQty) > 1 ? "s" : "");
                    switch (newTransaction.getType()) {
                        case TransactionType_pb.FROM_EXCHANGE_TRANSACTION:
                            notif = `You have bought ${stockQty} ${stockOrStocks} of ${stockName} @ ₹ ${price} from Exchange`;
                            break;
                        case TransactionType_pb.MORTGAGE_TRANSACTION:
                            notif = `You have ${total < 0 ? "retrieved" : "mortgaged"} ${Math.abs(stockQty)} ${stockOrStocks} of ${stockName} @ ₹ ${-total/stockQty}`
                            break;
                        case TransactionType_pb.TAX_TRANSACTION:
                            notif = `A total of ₹ ${-1*total} has been deducted from you as tax on the last profit you made`;
                            break
                        case TransactionType_pb.PLACE_ORDER_TRANSACTION:
                            notif = `A total of ${ stockQty < 0 ? Math.abs(stockQty) + " stocks" : "₹ " + Math.abs(total) } has been reserved for the order placed.`;
                            break;
                        case TransactionType_pb.CANCEL_ORDER_TRANSACTION:
                            notif = `A total of ${ stockQty < 0 ? Math.abs(stockQty) + " stocks" : "₹ " + Math.abs(total) } has been returned for cancelling the order.`;
                            break;
                        case TransactionType_pb.ORDER_FILL_TRANSACTION:
                            notif = `${stockQty > 0 ? "Buy ":"Sell"} order completed successfully! `;
                            break;
                        default:
                            console.error("Useless Transaction, left unprocessed ", newTransaction.getType());
                    }

                    if (notif != "") {
                        showSuccessNotif(notif, "New Transaction!");
                    }
                }
                catch (e) {
                    console.error("Unexpected error: ", e);
                }

                this.setState(() => {
                    // const newCash = prevState.userCash + newTransaction.getTotal();
                    return {
                        stocksOwnedMap: stocksOwnedMap,
                        stocksReservedMap: stocksReservedMap,
                        userCash: userCash,
                        userReservedCash: reservedCash,
                        userTotal: this.calculateTotal(userCash, stocksOwnedMap, this.state.stockDetailsMap),
                        latestTransaction: newTransaction,
                    };
                });
            }
        }
        catch (e) {
            console.log(e);
            return this.retryStream(this.handleTransactionsStream.bind(this), "transactions");
        }
    }

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.notifSubscriptionId);
        unsubscribe(this.props.sessionMd, this.state.stockSubscriptionId);
        unsubscribe(this.props.sessionMd, this.state.transactionSubcriptionId);
    }

    render() {
        //Use window.location.pathname because react router is removed
        //and hence react's history wont be changing ie
        //pushing to path in App cannot be retrieved by Route exact path
        //because the history for react will not have those changes reflected

        switch (window.location.pathname) {
            case "/trade":
                return <TradingTerminal
                    sessionMd={this.props.sessionMd}
                    notifications={this.state.notifications}
                    userName={this.props.user.getName()}
                    userReservedCash={this.state.userReservedCash}
                    userCash={this.state.userCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    stocksOwnedMap={this.state.stocksOwnedMap}
                    stockBriefInfoMap={this.state.stockBriefInfoMap}
                    stockPricesMap={this.getStockPrices(this.state.stockDetailsMap)}
                    constantsMap={this.props.constantsMap}
                    isMarketOpen={this.state.isMarketOpen}
                    disclaimerElement={this.disclaimerElement}
                />
            case "/portfolio":
                return <Portfolio
                    sessionMd={this.props.sessionMd}
                    notifications={this.state.notifications}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    isMarketOpen={this.state.isMarketOpen}
                    stockBriefInfoMap={this.state.stockBriefInfoMap}
                    stockPricesMap={this.getStockPrices(this.state.stockDetailsMap)}
                    stocksOwnedMap={this.state.stocksOwnedMap}
                    stocksReservedMap={this.state.stocksReservedMap}
                    transactionCount={this.props.constantsMap['GET_TRANSACTION_COUNT']}
                    latestTransaction={this.state.latestTransaction}
                    disclaimerElement={this.disclaimerElement}
                    userName={this.props.user.getName()}
                />;
            case "/market":
                return <Market sessionMd={this.props.sessionMd}
                    stockDetailsMap={this.state.stockDetailsMap}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    notifications={this.state.notifications}
                    disclaimerElement={this.disclaimerElement}
                    isMarketOpen={this.state.isMarketOpen}
                />;
            case "/leaderboard":
                return <Leaderboard
                    sessionMd={this.props.sessionMd}
                    leaderboardCount={this.props.constantsMap['LEADERBOARD_COUNT']}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    isMarketOpen={this.state.isMarketOpen}
                    notifications={this.state.notifications}
                    disclaimerElement={this.disclaimerElement}
                />;
            case "/news":
                return <News
                    sessionMd={this.props.sessionMd}
                    newsCount={this.props.constantsMap["MARKET_EVENT_COUNT"]}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    isMarketOpen={this.state.isMarketOpen}
                    notifications={this.state.notifications}
                    disclaimerElement={this.disclaimerElement}
                />;
            case "/companies":
                return <Company
                    sessionMd={this.props.sessionMd}
                    notifications={this.state.notifications}
                    stockBriefInfoMap={this.state.stockBriefInfoMap}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    isMarketOpen={this.state.isMarketOpen}
                    stockPricesMap={this.getStockPrices(this.state.stockDetailsMap)}
                    disclaimerElement={this.disclaimerElement}
                />

            case "/mortgage":
                return <Mortgage
                    sessionMd={this.props.sessionMd}
                    notifications={this.state.notifications}
                    stockBriefInfoMap={this.state.stockBriefInfoMap}
                    stockPricesMap={this.getStockPrices(this.state.stockDetailsMap)}
                    stocksOwnedMap={this.state.stocksOwnedMap}
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    depositRate={this.props.constantsMap['MORTGAGE_DEPOSIT_RATE']}
                    retrieveRate={this.props.constantsMap['MORTGAGE_RETRIEVE_RATE']}
                    latestTransaction={this.state.latestTransaction}
                    disclaimerElement={this.disclaimerElement}
                    isMarketOpen={this.state.isMarketOpen}
                />

            case "/help":
                return <Help
                    userCash={this.state.userCash}
                    userReservedCash={this.state.userReservedCash}
                    userTotal={this.state.userTotal}
                    connectionStatus={this.state.connectionStatus}
                    isMarketOpen={this.state.isMarketOpen}
                    notifications={this.state.notifications}
                    disclaimerElement={this.disclaimerElement}
                />;

            case "/admin":
                return <Admin
                    sessionMd={this.props.sessionMd}
                />
            default:
                return <NotFound />;
        }
    }
}
