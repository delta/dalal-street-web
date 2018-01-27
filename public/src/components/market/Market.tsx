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

export interface MarketProps {
    sessionMd: Metadata,
    stockDetailsMap: { [index:number]: Stock_pb },
    notifications: Notification_pb[],   
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

    purchaseFromExchange = async (stockId: number) => {
        let quantity = $("#input-"+stockId).val()!;
        if (quantity) {
                let myQuantity: number = parseInt(quantity.toString());
                console.log("purchased stock of company " + stockId + " quantity " + myQuantity);   
            

            try {
                const request = new BuyStocksFromExchangeRequest();
                request.setStockId(stockId);
                request.setStockQuantity(myQuantity);
                const resp = await DalalActionService.buyStocksFromExchange(request, this.props.sessionMd);
                console.log(resp.getStatusCode(), resp.toObject());
            } catch(e) {
                console.log("Error happened while placing order! ", e.statusCode, e.statusMessage, e);                
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
        let tempNumber: number;
        let diffClass: string;
        for (let i=0; i<this.state.stockData.length; i++) {
            diffClass = "red";
            let objUpdate = this.state.stockData[i];
            tempNumber = (objUpdate.currentPrice - objUpdate.previousPrice)*100/(objUpdate.previousPrice+1);
            if (tempNumber > 0) {
                diffClass = "green";
            }
            
            tempNumber = parseFloat(tempNumber.toFixed(2));
            history.push(
                <tr key={objUpdate.stockId}>
                    <td className="volume"><strong>{objUpdate.companyName}</strong></td>
                    <td className="volume"><strong>{objUpdate.currentPrice}</strong></td>
                    <td className={"volume " + diffClass}><strong>{tempNumber}{" %"}</strong></td>
                    <td className={"volume"} ><strong>{objUpdate.stocksInExchange}</strong></td>
                    <td className="volume"><strong><input id={"input-"+objUpdate.stockId} placeholder="0" className="market-input"/></strong></td>
                    <td className="volume"><strong><button className="market-button" onClick={() => {this.purchaseFromExchange(objUpdate.stockId)}}>Buy</button></strong></td>                        
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
                <div className="row" id="market-top-row" >
                    <TickerBar stocks={this.state.stockData}/>
               </div> 
               <div className="row" id="market-table">
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
            </div>
        );
    }
}