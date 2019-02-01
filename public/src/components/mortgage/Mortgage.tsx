import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { MortgageStocksRequest } from "../../../proto_build/actions/MortgageStocks_pb";
import { RetrieveMortgageStocksRequest } from "../../../proto_build/actions/RetrieveMortgageStocks_pb";
import { GetMortgageDetailsRequest } from "../../../proto_build/actions/GetMortgageDetails_pb";
import { MortgageDetail } from "../../../proto_build/models/MortgageDetail_pb";
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
    mortgageDetails: { [index: number]: MortgageDetail[]},

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
   ComponentWillUpdate(prevProps: MortgageProps, prevState: MortgageState, newProps: MortgageProps, newState: MortgageState){
        this.getMyMortgages();
  }

    componentWillReceiveProps(newProps: MortgageProps) {
        if (newProps && newProps.latestTransaction && newProps.latestTransaction.getType() == TransactionType.MORTGAGE_TRANSACTION) {
             let mortgageDetails = this.state.mortgageDetails;
             const id = newProps.latestTransaction.getStockId();
             const price = newProps.latestTransaction.getPrice();
             const stockQuantity = newProps.latestTransaction.getStockQuantity();
             console.log("id"+id+" "+price+" "+stockQuantity);
             let samePriceFlag = 0;
             let newStockFlag = 1;

             if(stockQuantity > 0) { //this means stock has been mortgaged, we need to check whether it has been mortgaged at same price as before or at new price or if it is a new stock mortgaged
               for(const stockId in mortgageDetails){
                 if(Number(stockId) === id){ //this means that this stock was already mortgaged before and now it has been mortgaged at same or new price
                   mortgageDetails[stockId].forEach((stocksMortgaged,index) => {
                     if(stocksMortgaged.getStocksInBank() === stockQuantity && stocksMortgaged.getMortgagePrice() === price)//this is when it is mortgaged at same price
                        {   let MortgageDetailsArray :MortgageDetail[] = mortgageDetails[stockId];
                            stocksMortgaged.setStocksInBank(stocksMortgaged.getStocksInBank() + stockQuantity);
                            MortgageDetailsArray[index] = stocksMortgaged;
                            mortgageDetails[stockId] = MortgageDetailsArray;
                            samePriceFlag =1;
                            newStockFlag = 0;
                    }
                  });
                  if(samePriceFlag === 0){// it is mortgaged at some different price
                   let MortgageDetailsArray :MortgageDetail[] = mortgageDetails[stockId];
                   MortgageDetailsArray[MortgageDetailsArray.length] = new MortgageDetail();
                   MortgageDetailsArray[MortgageDetailsArray.length].setStocksInBank(stockQuantity);
                   MortgageDetailsArray[MortgageDetailsArray.length].setMortgagePrice(price);
                   mortgageDetails[stockId] = MortgageDetailsArray;
                   newStockFlag = 0;
                }
            }
          }
            if(newStockFlag === 1){ //the stock has not been mortgaged before  ....add it to the list
                  let MortgageDetailsArray :MortgageDetail[] = [];
                  let stocksMortgaged = new MortgageDetail();
                  stocksMortgaged.setStocksInBank(stockQuantity);
                  stocksMortgaged.setMortgagePrice(price);
                  MortgageDetailsArray.push(stocksMortgaged);
                  mortgageDetails[id] = MortgageDetailsArray;

            }
          }
         else{// this means stock has been retrieved due to which either the row has to be deleted or no of stocks reduced
              mortgageDetails[id].forEach((stocksMortgaged,index) => {
              if(stocksMortgaged.getMortgagePrice() === price)
              {
                if(stocksMortgaged.getStocksInBank() === -stockQuantity ){//delete this object
                   let MortgageDetailsArray : MortgageDetail[] = mortgageDetails[id];
                   delete MortgageDetailsArray[index];
                   mortgageDetails[id] = MortgageDetailsArray;
                }else {
                  let MortgageDetailsArray :MortgageDetail[] = mortgageDetails[id];
                  stocksMortgaged.setStocksInBank(stocksMortgaged.getStocksInBank() + stockQuantity);
                  MortgageDetailsArray[index] = stocksMortgaged;
                  mortgageDetails[id] = MortgageDetailsArray;
              }
            }
          });     //MortgageDetail = [];
        }
      }
    }        //mortgageDetails[stockId] = MortgageDetail.push(stocksMortgaged)

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
            console.log("resp"+resp);
            /*let mortgageDetailsStockNumbers: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj,index) => {
                mortgageDetailsStockNumbers[index] = obj.getStocksInBank();
            });
            let mortgageDetailsMortgagePrice: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj,index) => {
                mortgageDetailsMortgagePrice[index] = obj.getMortgagePrice();
            });
            let mortgageDetailsStockId: { [index: number]: number } = {};
            resp.getMortgageDetailsList().forEach((obj,index) => {
                mortgageDetailsStockId[index] = obj.getStockId();
            });*/
            let MortgageDetailsArray : MortgageDetail[];
            let mortgageDetails: { [index: number]: MortgageDetail[] } = {};
            resp.getMortgageDetailsList().forEach((stocksMortgaged,_) => {
                const stockId = stocksMortgaged.getStockId();
                if(!mortgageDetails[stockId])
                  MortgageDetailsArray  = [];
                MortgageDetailsArray.push(stocksMortgaged);
                mortgageDetails[stockId] = MortgageDetailsArray;
                console.log(MortgageDetailsArray+"stockId"+stockId);
            });
            this.setState({
                mortgageDetails: mortgageDetails,
            });
            console.log("mortgageDetails"+this.state.mortgageDetails);
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

     retrieveStocks = async (stockId: number,price: number,quantity: number,tableIndex: string) => {
        console.log(tableIndex);
        const id = "retrieveinput-"+tableIndex;
        console.log(id);
        const stockQuantity = $("#"+id).val(); //as number;
        console.log(stockQuantity);
        //$(`#retrieveinput-${tableIndex}`).val("");
        if (!isPositiveInteger(stockQuantity)) {
            showNotif("Enter a positive integer");
            return;
        }
        if (stockQuantity > quantity) {
            showNotif("You have only " + quantity + " stocks mortgaged");
            return;
        }
        const retrieveStocksRequest = new RetrieveMortgageStocksRequest();
        try {
            retrieveStocksRequest.setStockId(stockId);
            retrieveStocksRequest.setStockQuantity(stockQuantity);
            retrieveStocksRequest.setRetrievePrice(price);

            const resp = await DalalActionService.retrieveMortgageStocks(retrieveStocksRequest, this.props.sessionMd);
            showNotif("Stocks retrieved successfully");
            //this.getMyMortgages();
        } catch (e) {
            console.log("Error happened while retrieving stocks! ", e.statusCode, e.statusMessage, e);
            showNotif("Something went wrong! " + e.statusMessage);
        }
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
                    <td><strong><button className="ui inverted green button" onClick={() => { this.mortgageStocks(Number(stockId)) }}>Mortgage</button></strong></td>
                </tr>
            );
       }

            // stocksOwned will change due to transactions stream in Main
            // but mortgaged stocks count must be updated after retrieving
          for (const stockId in mortgageDetails){
            mortgageDetails[stockId].forEach((stocksMortgaged, index) => {
              const stockQuantity = stocksMortgaged.getStocksInBank();
              console.log(stockQuantity);
              const retrievePrice = stocksMortgaged.getMortgagePrice() * this.props.retrieveRate / 100;
              console.log(retrievePrice);
              const tableIndex = `id-${stockId}price-${retrievePrice}qty-${stockQuantity}`;
              console.log("index is"+tableIndex);
              retrieveTable.push(
                <tr key={tableIndex}>
                    <td><strong>{stockBriefInfoMap[stockId].shortName}</strong></td>
                    <td><strong>{stockQuantity}</strong></td>
                    <td><strong>{stocksMortgaged.getMortgagePrice()}</strong></td>
                    <td><strong>{this.props.retrieveRate + "%"}</strong></td>
                    <td className="green"><strong>{retrievePrice}</strong></td>
                    <td><strong><input id={"retrieveinput-"+tableIndex} placeholder="0" className="mortgage-input" /></strong></td>
                    <td><strong><button className="ui inverted green button" onClick={() => { this.retrieveStocks(Number(stockId),Number(retrievePrice),Number(stockQuantity),tableIndex) }}>Retrieve</button></strong></td>
                </tr>
            );
          });
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
