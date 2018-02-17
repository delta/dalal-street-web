import * as React from "react";
import { Metadata } from "grpc-web-client";
import { TickerBar } from "./../common/TickerBar";
import { TickerProps, Ticker } from "./../common/Ticker";
import { DataStreamType, SubscriptionId, SubscribeRequest, } from "../../../proto_build/datastreams/Subscribe_pb"
import { subscribe, unsubscribe } from "../../streamsutil";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { Stock as Stock_pb} from "../../../proto_build/models/Stock_pb";
import { BuyStocksFromExchangeRequest } from "../../../proto_build/actions/BuyStocksFromExchange_pb";
import { Notification } from "../common/Notification";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb"

function isPositiveInteger(x: number): boolean {
    return (!isNaN(x) && x % 1 === 0 && x > 0);
}

declare var $:any;
declare var PNotify: any;

export interface MarketProps {
    sessionMd: Metadata,
    stockDetailsMap: { [index:number]: Stock_pb },
    notifications: Notification_pb[],
    disclaimerElement: JSX.Element  
}

export interface MarketState {
    stockData: TickerProps[],
    subscriptionId: SubscriptionId,
}

export class Market extends React.Component<MarketProps, MarketState> {
    constructor(props: MarketProps) {
        super(props);

        this.state = {
            stockData: [],
            subscriptionId: new SubscriptionId,
        }
    }

    showModal = (msg: string) => {
        let pnotifyNotif = PNotify.notice({
            title: 'You have a notification',
            text: msg,
            addClass: "pnotify-style",
            modules: {
                NonBlock: {
                    nonblock: true
                }
            },
        });
    }

    purchaseFromExchange = async (stockId: number) => {
        let quantity = $("#input-"+stockId).val()!;
        $("#input-" + stockId).val("");
        if (!isPositiveInteger(Number(quantity))) {
            this.showModal("Enter a positive integer!");
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
                this.showModal("Order successful!");
                console.log(resp.getStatusCode(), resp.toObject());
            } catch(e) {
                console.log("Error happened while placing order! ", e.statusCode, e.statusMessage, e);
                this.showModal("Oops! Something went wrong! " + e.statusMessage);
            }
        }

    }

    updateStockData = (props: MarketProps) => {
        let newTickerStockData: TickerProps[] = [];
        
        for (const update in props['stockDetailsMap']) {
            let objUpdate = props['stockDetailsMap'][update].toObject();
            newTickerStockData.push({
                stockId: objUpdate.id,
                companyName: objUpdate.shortName,
                currentPrice: objUpdate.currentPrice,
                previousPrice: objUpdate.previousDayClose,
                stocksInExchange: objUpdate.stocksInExchange,
            }); 
        }

        this.setState({
            stockData: newTickerStockData,
        });
    }

    componentDidMount() {
        this.updateStockData(this.props);
    }

    componentWillReceiveProps(newProps: MarketProps) {
        if (newProps){
            this.updateStockData(newProps);
        }
    }

    render() {

        let history: any[] = [];
        let percentageIncrease: number;
        let diffClass: string;
        for (let i=0; i<this.state.stockData.length; i++) {
            diffClass = "red";
            let objUpdate = this.state.stockData[i];
            percentageIncrease = (objUpdate.currentPrice - objUpdate.previousPrice)*100/(objUpdate.previousPrice+1);
            if (percentageIncrease >= 0) {
                diffClass = "green";
            }

            percentageIncrease = parseFloat(percentageIncrease.toFixed(2));
            history.push(
                <tr key={objUpdate.stockId}>
                    <td className="volume"><strong>{objUpdate.companyName}</strong></td>
                    <td className="volume"><strong>{objUpdate.currentPrice}</strong></td>
                    <td className={"volume " + diffClass}><strong>{percentageIncrease}{" %"}</strong></td>
                    <td className="volume"><strong>{objUpdate.stocksInExchange}</strong></td>
                    <td className="volume"><strong><input id={"input-"+objUpdate.stockId} placeholder="0" className="market-input"/></strong></td>
                    <td className="volume"><strong><button className="ui inverted green button" onClick={() => {this.purchaseFromExchange(objUpdate.stockId)}}>Buy</button></strong></td>                        
                </tr>
            );
        }

        return (
            <div id="market-container" className="ui stackable grid pusher main-container">
                <div className="row" id="top_bar">
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