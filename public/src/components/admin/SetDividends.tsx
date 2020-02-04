import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { SetGivesDividendsRequest } from "../../../proto_build/actions/SetGivesDividends_pb";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

declare var $: any;

export interface DividendProps{
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo } // get stock detail for a given stockid
}

export interface DividendState{
    currentStockId: number
}

export class SetDividends extends React.Component<DividendProps,DividendState> {
    constructor(props: DividendProps) {
        super(props);    
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.state = {
            currentStockId: currentStockId 
        }  
    }

    componentDidMount() {
		$("#stock-set").dropdown({
			onChange: this.handleStockChange,
		});
    }
    
	componentDidUpdate() {
		$("#stock-set").dropdown("refresh");
		$("#stock-set div.text").html($("#stock-set .item.selected").html())
    }

    handleStockChange = (stockId: string) => {
		const newStockId = Number(stockId);
        this.setState(prevState => {
			return {
				currentStockId: newStockId
			}
        });
    };

    setDividends = async () => {
      const setDividendReq = new SetGivesDividendsRequest();
      const stockId = this.state.currentStockId;
      const stockName = this.props.stockBriefInfoMap[stockId].fullName;
      const sessionMd = this.props.sessionMd;
      try{
        setDividendReq.setStockId(stockId);
        setDividendReq.setGivesDividends(true);
        const resp = await DalalActionService.setGivesDividends(setDividendReq, sessionMd);
        // If any error occurs, it will be raised in DalalMessage_pb_Service
        showNotif("Dividend feature has been successfully set for "+stockName+"!");
      }catch(e){
        console.log("Error happened while setting dividend! ", e.statusCode, e.statusMessage, e);
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
            <table id="setDividend-table">
                <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                        <td>
                        <div id="stock-set" className="ui fluid search selection dropdown">
				          <input name="stock" type="hidden" value={this.state.currentStockId.toString()}/>
				          <i className="dropdown icon"></i>
				          <div className="default text">Select Stock</div>
				          <div className="menu ui grid">
			        		{options}
				          </div>
			            </div>
                        </td>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.setDividends.bind(this)} value="Set Dividends"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>	   
        );
    }
}

