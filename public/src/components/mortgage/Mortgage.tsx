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
import { showNotif, showErrorNotif, isPositiveInteger } from "../../utils";
import { Fragment } from "react";

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
    userTotal: number,
}

interface MortgageState {
    mortgageDetailsStockNumbers: { [index: number]: number},
    mortgageDetailsMortgagePrice: {[index: number]: number},
    mortgageDetailsStockId: {[index: number]: number},
}

export class Mortgage extends React.Component<MortgageProps, MortgageState> {
    constructor(props: MortgageProps) {
        super(props);

        this.state = {
            mortgageDetailsStockNumbers: {},
            mortgageDetailsMortgagePrice: {},
            mortgageDetailsStockId: {},

        };
    }

    componentDidMount() {
        $("#mortgage-tab .item").tab();
        this.getMyMortgages();
    }

    componentDidUpdate(newProps: MortgageProps) {
        if (newProps && newProps.latestTransaction && newProps.latestTransaction.getType() == TransactionType.MORTGAGE_TRANSACTION) {
            let mortgageDetailsStockNumbers = this.state.mortgageDetailsStockNumbers;
            const id = newProps.latestTransaction.getId()

            // subtract because delta(mortgaged stocks) = -delta(stocksOwned)
            if (id in mortgageDetailsStockNumbers) {
                mortgageDetailsStockNumbers[id] -= newProps.latestTransaction.getStockQuantity();
            }
            else {
                mortgageDetailsStockNumbers[id] = -newProps.latestTransaction.getStockQuantity();
            }
            this.setState({
                mortgageDetailsStockNumbers: mortgageDetailsStockNumbers,
            });
        }
    }

    getMortgageCount = (id: number): number => {
        if (id in this.state.mortgageDetailsStockNumbers) {
            return this.state.mortgageDetailsStockNumbers[id];
        }
        return 0;
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

            let mortgageDetailsStockNumbers: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj) => {
                mortgageDetailsStockNumbers[obj.getId()] = obj.getStocksInBank();
            });
            let mortgageDetailsMortgagePrice: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj) => {
                mortgageDetailsMortgagePrice[obj.getId()] = obj.getMortgagePrice();
            });
            let mortgageDetailsStockId: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj) => {
                mortgageDetailsStockId[obj.getId()] = obj.getStockId();
            });
            await this.setState({
                mortgageDetailsStockNumbers: mortgageDetailsStockNumbers,
                mortgageDetailsMortgagePrice: mortgageDetailsMortgagePrice,
                mortgageDetailsStockId: mortgageDetailsStockId,
            });
        } catch (e) {
            console.log("Error happened while getting mortgages! ", e.statusCode, e.statusMessage, e);
            showNotif("Something went wrong! " + e.statusMessage);
        }
    }

    mortgageStocks = async (stockId: number) => {
        const stockQuantity = $("#mortgageinput-" + stockId).val() as number;
        $("#mortgageinput-" + stockId).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer", "Invalid input");
            return;
        }
        if (stockQuantity > this.props.stocksOwnedMap[stockId]) {
            showNotif("You own only " + this.props.stocksOwnedMap[stockId] + " stocks", "Invalid input");
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

     retrieveStocks = async (id: number) => {
        const stockId = this.state.mortgageDetailsStockId[id];
        const stockQuantity = $("#retrieveinput-" + id).val() as number;
        $("#retrieveinput-" + id).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer");
            return;
        }
        if (stockQuantity > this.getMortgageCount(id)) {
            showNotif("You have only " + this.getMortgageCount(id) + " stocks mortgaged");
            return;
        }
        const retrieveStocksRequest = new RetrieveMortgageStocksRequest();
        try {
            retrieveStocksRequest.setStockId(stockId);
            retrieveStocksRequest.setStockQuantity(stockQuantity);
            retrieveStocksRequest.setRetrievePrice(this.state.mortgageDetailsMortgagePrice[id]);

            const resp = await DalalActionService.retrieveMortgageStocks(retrieveStocksRequest, this.props.sessionMd);
            showNotif("Stocks retrieved successfully");
        } catch (e) {
            console.log("Error happened while retrieving stocks! ", e.statusCode, e.statusMessage, e);
            showNotif("Something went wrong! " + e.statusMessage);
        }
    }

    render() {
        const stockBriefInfoMap = this.props.stockBriefInfoMap;
        const stockPricesMap = this.props.stockPricesMap;
        const stocksOwnedMap = this.props.stocksOwnedMap;
        const mortgageDetailsStockNumbers = this.state.mortgageDetailsStockNumbers;
        const mortgageDetailsStockId = this.state.mortgageDetailsStockId;

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
                    <td><strong><button className="ui inverted green button" onClick={() => { this.mortgageStocks(Number(stockId)) }}>Mortgage</button></strong></td>
                </tr>
            );
       }

          // stocksOwned will change due to transactions stream in Main
          // but mortgaged stocks count must be updated after retrieving
          for (const id in mortgageDetailsStockNumbers){
            const stockId = mortgageDetailsStockId[id];
            if(stockId != undefined){
            retrieveTable.push(
                <tr key={id}>
                    <td><strong>{stockBriefInfoMap[stockId].shortName}</strong></td>
                    <td><strong>{this.getMortgageCount(Number(id))}</strong></td>
                    <td><strong>{stockPricesMap[stockId]}</strong></td>
                    <td><strong>{this.props.retrieveRate + "%"}</strong></td>
                    <td className="green"><strong>{(stockPricesMap[stockId] * this.props.retrieveRate) / 100}</strong></td>
                    <td><strong><input id={"retrieveinput-" + id} placeholder="0" className="mortgage-input" /></strong></td>
                    <td><strong><button className="ui inverted green button" onClick={() => { this.retrieveStocks(Number(id)) }}>Retrieve</button></strong></td>
                </tr>
            );
        }
      }

        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userTotal={this.props.userTotal} />
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
                                        <th>Current Price (₹)</th>
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
