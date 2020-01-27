import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { MortgageStocksRequest } from "../../../proto_build/actions/MortgageStocks_pb";
import { RetrieveMortgageStocksRequest } from "../../../proto_build/actions/RetrieveMortgageStocks_pb";
import { GetMortgageDetailsRequest } from "../../../proto_build/actions/GetMortgageDetails_pb";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Transaction as Transaction_pb, TransactionType } from "../../../proto_build/models/Transaction_pb";
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";
import { Fragment } from "react";
import { MortgageDetail } from "../../../proto_build/models/MortgageDetail_pb";

declare var $: any;

export interface MortgageProps {
    sessionMd: Metadata,
    notifications: Notification_pb[],
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stockPricesMap: { [index: number]: number },
    stocksOwnedMap: { [index: number]: number },
    depositRate: number,
    retrieveRate: number,
    latestTransaction: Transaction_pb,
    disclaimerElement: JSX.Element,
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userStockWorth: number,
    connectionStatus: boolean,
    isMarketOpen: boolean,
    reservedStocksWorth: number,
}

interface MortgageState {
    mortgageDetails: { [index: number]: any[] },
}

export class Mortgage extends React.Component<MortgageProps, MortgageState> {
    constructor(props: MortgageProps) {
        super(props);

        this.state = {
            mortgageDetails: {},
        };
    }

    componentDidMount() {
        $("#mortgage-tab .item").tab();
        this.getMyMortgages();
    }

    componentWillReceiveProps(newProps: MortgageProps) {
        if (newProps && newProps.latestTransaction && newProps.latestTransaction.getType() == TransactionType.MORTGAGE_TRANSACTION) {
            let mortgageDetails = this.state.mortgageDetails;
            const stockId = newProps.latestTransaction.getStockId()
            const latestTransaction: Transaction_pb = newProps.latestTransaction;

            // If the latest transaction is negative, then it means we mortgaged something
            if (latestTransaction.getStockQuantity() < 0) {

                // Create empty array if stock has never been mortgaged before
                if (! mortgageDetails[stockId]) {
                    mortgageDetails[stockId] = [];
                }

                let alreadyUpdated: boolean = false;
                // Search if it already exists. If it does, update it
                for (let i = 0; i < mortgageDetails[stockId].length; i++) {
                    if (mortgageDetails[stockId][i].getMortgagePrice() == latestTransaction.getPrice()) {
                        alreadyUpdated = true;
                        const quantity = mortgageDetails[stockId][i].getStocksInBank()
                        mortgageDetails[stockId][i].setStocksInBank(quantity + latestTransaction.getStockQuantity() * -1)
                    }
                }
                // If it doesn't already exist with that price, create a new one.
                if (! alreadyUpdated) {
                    let newMortgageDetail: MortgageDetail = new MortgageDetail;
                    newMortgageDetail.setUserId(latestTransaction.getUserId());
                    newMortgageDetail.setStocksInBank(latestTransaction.getStockQuantity() * -1);
                    newMortgageDetail.setStockId(latestTransaction.getStockId());
                    newMortgageDetail.setMortgagePrice(latestTransaction.getPrice());
                    mortgageDetails[stockId].push(newMortgageDetail);
                }
            }
            else {
                let pastMortgagesForStock: MortgageDetail[] = mortgageDetails[stockId];
                let newMortgagesForStock: MortgageDetail[] = [];
                for (let i=0; i<pastMortgagesForStock.length; i++) {
                    // Find the mortgage that has the same price and stockID as the transaction
                    if (pastMortgagesForStock[i].getMortgagePrice() == latestTransaction.getPrice()) {
                        // If the quantity of them are equal, remove it else modify
                        if (pastMortgagesForStock[i].getStocksInBank() != latestTransaction.getStockQuantity()) {
                            pastMortgagesForStock[i].setStocksInBank(
                                pastMortgagesForStock[i].getStocksInBank() - latestTransaction.getStockQuantity()
                            );
                            newMortgagesForStock.push(pastMortgagesForStock[i]);
                        }
                    } else {
                        newMortgagesForStock.push(pastMortgagesForStock[i]);
                    }
                }
                mortgageDetails[stockId] = newMortgagesForStock;
            }

            this.setState({
                mortgageDetails: mortgageDetails,
            });
        }
    }

    getMortgageCount = (stockId: number, price: number): number => {
        let mortgageCount: number = 0;
        if (stockId in this.state.mortgageDetails) {
            let mortgages = this.state.mortgageDetails[stockId];
            mortgages.forEach((mortgageItem: MortgageDetail, _) => {
                if (mortgageItem.getMortgagePrice() == price) {
                    mortgageCount = mortgageItem.getStocksInBank();
                }
            });
        }
        return mortgageCount;
    }

    getStockCount = (stockId: number): number => {
        if (stockId in this.props.stocksOwnedMap) {
            return this.props.stocksOwnedMap[stockId];
        }
        return 0;
    }

    getMyMortgages = async () => {
        const getMortgagesRequest = new GetMortgageDetailsRequest();
        try {
            const resp = await DalalActionService.getMortgageDetails(getMortgagesRequest, this.props.sessionMd);
            let retrievedMortgages: { [index: number]: MortgageDetail[] } = {};
            resp.getMortgageDetailsList().forEach((stocksMortgaged, _) => {
                const stockId = stocksMortgaged.getStockId();
                if (! retrievedMortgages[stockId]) {
                    retrievedMortgages[stockId] = [];
                }
                retrievedMortgages[stockId].push(stocksMortgaged);
            });
            this.setState({
                mortgageDetails: retrievedMortgages,
            });
        } catch (e) {
            console.log("Error happened while getting mortgages! ", e.statusCode, e.statusMessage, e);
            showNotif("Something went wrong! " + e.statusMessage);
        }
    }

    mortgageStocks = async (stockId: number) => {
        closeNotifs();
        const stockQuantity = $("#mortgageinput-" + stockId).val() as number;
        $("#mortgageinput-" + stockId).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer", "Invalid input");
            return;
        }
        const stocksOwned: number = this.props.stocksOwnedMap[stockId]? this.props.stocksOwnedMap[stockId]: 0;
        if (stockQuantity > stocksOwned) {
            showNotif("You own only " + stocksOwned + " stocks", "Invalid input");
            return;
        }
        const mortgageStocksRequest = new MortgageStocksRequest();
        try {
            mortgageStocksRequest.setStockId(stockId);
            mortgageStocksRequest.setStockQuantity(stockQuantity);

            const resp = await DalalActionService.mortgageStocks(mortgageStocksRequest, this.props.sessionMd);
            // notif will be shown by transacions stream
        } catch (e) {
            console.log("Error happened while mortgaging stocks! ", e.statusCode, e.statusMessage, e);
            showErrorNotif("Something went wrong! " + e.statusMessage);
        }
    }

    retrieveStocks = async (stockId: number, price: number) => {
        closeNotifs();
        const uniqueKey = this.getUniqueIdFromMortgageDetail(stockId, price);
        const stockQuantity = $("#retrieveinput-" + uniqueKey).val() as number;
        $("#retrieveinput-" + stockId).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer");
            return;
        }
        if (stockQuantity > this.getMortgageCount(stockId, price)) {
            showNotif("You have only " + this.getMortgageCount(stockId, price) + " stocks mortgaged");
            return;
        }
        const retrieveStocksRequest = new RetrieveMortgageStocksRequest();
        try {
            retrieveStocksRequest.setStockId(stockId);
            retrieveStocksRequest.setStockQuantity(stockQuantity);
            retrieveStocksRequest.setRetrievePrice(price);

            const resp = await DalalActionService.retrieveMortgageStocks(retrieveStocksRequest, this.props.sessionMd);
            showNotif("Stocks retrieved successfully");
        } catch (e) {
            console.log("Error happened while retrieving stocks! ", e.statusCode, e.statusMessage, e);
            showNotif("Something went wrong! " + e.statusMessage);
        }
    }

    // getUniqueIdFromMortgageDetail returns unique id string of form stockId-mortgagePrice
    getUniqueIdFromMortgageDetail(stockId: number, price: number) {
        return `${stockId}-${price}`;
    }

    render() {
        const stockBriefInfoMap = this.props.stockBriefInfoMap;
        const stockPricesMap = this.props.stockPricesMap;
        const stocksOwnedMap = this.props.stocksOwnedMap;
        const mortgageDetails = this.state.mortgageDetails;

        const mortgageTable: any[] = [];
        const retrieveTable: any[] = [];

        for (const stockId in stockBriefInfoMap) {
            mortgageTable.push(
                <tr key={stockId}>
                    <td><strong>{stockBriefInfoMap[stockId].shortName}</strong></td>
                    <td><strong>{this.getStockCount(Number(stockId))}</strong></td>
                    <td><strong>{stockPricesMap[stockId]}</strong></td>
                    <td><strong>{this.props.depositRate + "%"}</strong></td>
                    <td className="green"><strong>{(stockPricesMap[stockId] * this.props.depositRate) / 100}</strong></td>
                    <td><strong><input id={"mortgageinput-" + stockId} placeholder="0" className="mortgage-input" /></strong></td>
                    <td><strong><button disabled={this.props.isMarketOpen ? false : true} className="ui inverted green button" onClick={() => { this.mortgageStocks(Number(stockId)) }}>Mortgage</button></strong></td>
                </tr>
            );
        }

        for (const stockId in mortgageDetails) {
            let mortgages = mortgageDetails[stockId];
            mortgages.forEach((mortgageItem: MortgageDetail, _) => {
                const mortgagePrice = mortgageItem.getMortgagePrice();
                const uniqueKey = this.getUniqueIdFromMortgageDetail(mortgageItem.getStockId(), mortgagePrice)
                retrieveTable.push(
                    <tr key={uniqueKey}>
                        <td><strong>{stockBriefInfoMap[stockId].shortName}</strong></td>
                        <td><strong>{mortgageItem.getStocksInBank()}</strong></td>
                        <td><strong>{mortgagePrice}</strong></td>
                        <td><strong>{this.props.retrieveRate + "%"}</strong></td>
                        <td className="green"><strong>{(mortgagePrice * this.props.retrieveRate) / 100}</strong></td>
                        <td><strong><input id={"retrieveinput-" + uniqueKey} placeholder="0" className="mortgage-input" /></strong></td>
                        <td><strong><button disabled={this.props.isMarketOpen ? false : true} className="ui inverted green button" onClick={() => { this.retrieveStocks(Number(stockId), mortgagePrice) }}>Retrieve</button></strong></td>
                    </tr>
                );
            });
        }
        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth={this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen}/>
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="mortgage-container" className="ui stackable grid pusher main-container">
                    <div className="row">
                        <h2 className="ui center aligned icon header inverted">
                            <i className="university icon"></i>
                            <div className="content">
                                Mortgage / Retrieve
                            <div className="grey sub header">
                                    Take calculated risks
                            </div>
                            </div>
                        </h2>
                    </div>
                    <div className="row fifteen wide column centered">
                        <div id="mortgage-tab" className="ui top attached tabular menu">
                            <a className="active item" data-tab="mortgage">Mortgage</a>
                            <a className="item" data-tab="retrieve">Retrieve</a>
                        </div>
                        <div className="ui bottom attached active tab segment" data-tab="mortgage">
                            <table className="ui inverted table unstackable">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Stocks Owned</th>
                                        <th>Current Price (₹)</th>
                                        <th>Deposit Rate</th>
                                        <th>Amount per Stock (₹)</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mortgageTable}
                                </tbody>
                            </table>
                        </div>
                        <div className="ui bottom attached tab segment" data-tab="retrieve">
                            <table className="ui inverted table unstackable">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Stocks Mortgaged</th>
                                        <th>Mortgaged Price (₹)</th>
                                        <th>Retrieval Rate</th>
                                        <th>Amount per Stock (₹)</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {retrieveTable}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {this.props.disclaimerElement}
                </div>
            </Fragment>
        );
    }
}
