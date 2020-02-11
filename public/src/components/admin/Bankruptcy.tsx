import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { SetBankruptcyRequest } from "../../../proto_build/actions/SetBankruptcy_pb";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

declare var $: any;

export interface BankruptcyProps{
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo } // get stock detail for a given stockid
}

export interface BankruptcyState{
    currentStockId: number
}

export class Bankruptcy extends React.Component<BankruptcyProps,BankruptcyState> {
    constructor(props: BankruptcyProps) {
        super(props);    
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.state = {
            currentStockId: currentStockId 
        }  
    }

    componentDidMount() {
		$("#bankruptcy-set").dropdown({
			onChange: this.handleStockChange,
		});
    }
    
	componentDidUpdate() {
		$("#bankruptcy-set").dropdown("refresh");
		$("#bankruptcy-set div.text").html($("#bankruptcy-set .item.selected").html())
    }

    handleStockChange = (stockId: string) => {
		const newStockId = Number(stockId);
        this.setState(prevState => {
			return {
				currentStockId: newStockId
			}
        });
    };

    setBankruptcy = async () => {
      const setBankruptcy = new SetBankruptcyRequest();
      const stockId = this.state.currentStockId;
      const stockName = this.props.stockBriefInfoMap[stockId].fullName;
      const sessionMd = this.props.sessionMd;
      try{
        setBankruptcy.setStockId(stockId);
        setBankruptcy.setIsBankrupt(true);
        const resp = await DalalActionService.setBankruptcy(setBankruptcy, sessionMd);
        // If any error occurs, it will be raised in DalalMessage_pb_Service
        showNotif(stockName+" has been successfully set Bankrupt!");
      }catch(e){
        console.log("Error happened while setting Bankruptcy! ", e.statusCode, e.statusMessage, e);
        if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
        } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
        }
      }
    }
      
    render() {
        const stockBriefInfoMap = this.props.stockBriefInfoMap;
        const options = [];
        for (const stockId in stockBriefInfoMap) {
            const stockInfo = stockBriefInfoMap[stockId];
            options.push(
            <div key={stockId} className="item row" data-value={stockId}>
                <div className="companyName four wide column">{stockInfo.fullName}</div>
            </div>
			);
        
        }
        
        return (
            <React.Fragment>
            <table id="bankruptcy-table">
                <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                        <td>
                        <div id="bankruptcy-set" className="ui fluid search selection dropdown">
				          <input name="stock" type="hidden" value={this.state.currentStockId.toString()}/>
				          <i className="dropdown icon"></i>
				          <div className="default text">Select Stock</div>
				          <div className="menu ui grid">
			        		{options}
				          </div>
			            </div>
                        </td>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.setBankruptcy.bind(this)} value="Set Bankrupt"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>	   
        );
    }
}