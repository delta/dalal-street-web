import * as React from "react";
import { Metadata } from "grpc-web-client";
import {SendNewsRequest} from "../../../proto_build/actions/SendNews_pb";
import {SendDividendsRequest} from "../../../proto_build/actions/SendDividends_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Dividend } from "./Dividend";
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";


type NumNumMap = { [index: number]: number };

export interface AdminProps {
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo }, // get stock detail for a given stockid
	stockPricesMap: NumNumMap
}

interface AdminState {
    // dividend feature
    currentStockId: number
    dividendAmount: number
}

export class Admin extends React.Component<AdminProps,AdminState> {
    constructor(props: AdminProps) {
        super(props);
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.state = {
            currentStockId: currentStockId,
            dividendAmount: 0
        }
    }


    // Submit states to backend for dividend feature

    applyDividend=async () => {
        const dividendStockId=this.state.currentStockId;
        const dividendAmount=this.state.dividendAmount;
        const sessionMd = this.props.sessionMd;
        const stockName = this.props.stockBriefInfoMap[dividendStockId].fullName;
        
        // Change to defaults: avoids multiple click issue
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.setState(prevState => {
            return {
                currentStockId: currentStockId,
                dividendAmount: 0
            }
        });
        

        if(isPositiveInteger(dividendAmount+1)){
        const dividendReq = new SendDividendsRequest();
        try{
            dividendReq.setDividendAmount(dividendAmount);
            dividendReq.setStockId(dividendStockId);
            const resp = await DalalActionService.sendDividends(dividendReq, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showNotif("Dividend has been successfully sent on "+stockName+"!");

        }catch(e){
            console.log("Error happened while applying dividend! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
        }
        else{
            showErrorNotif("Enter a valid integer!");
        }
    }


    // Updates stockid for dividend feature

    handleStockIdChange = (newStockId: number) => {
		this.setState(prevState => {
			return {
				currentStockId: newStockId
			}
		});
    };


    // Updates no.of stocks for dividend feature 

    handleDividendAmountChange = (newamount: number) => {
		this.setState(prevState => {
			return {
				dividendAmount: newamount
			}
		});
	};



    purchaseFromExchange = async (event: any) => {
        try {
            const request = new SendNewsRequest();
            request.setNews("This is the first news");
            const resp = await DalalActionService.sendNews(request, this.props.sessionMd);
        } catch (e) {
            console.log(e);
        }
    }
    render() {

        
        return (
            <React.Fragment>
                <div className="adminPanel">
                  <h1>ADMIN PANEL</h1>
                  <span>dsaaaaaaaaaaaaaaaaaaaaaaaa</span><button onClick = {(e) => { this.purchaseFromExchange(e) }}>Send</button>       
                </div>

                {/* Dividend Feature */}
                
                <div className="dividendPanel">
                  <Dividend 
                   sessionMd={this.props.sessionMd} 
                   stockBriefInfoMap={this.props.stockBriefInfoMap}
                   currentStockId={this.state.currentStockId}
                   dividendAmount={this.state.dividendAmount}
                   handleStockIdChangeCallback={this.handleStockIdChange}
                   handleDividendAmountChangeCallback={this.handleDividendAmountChange}
                   applyDividendCallback={this.applyDividend}

                  />
                </div>
                
            </React.Fragment>
        )
    }
}