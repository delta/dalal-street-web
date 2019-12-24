import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

declare var $: any;

export interface DividendProps{
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo } // get stock detail for a given stockid
    currentStockId: Number
    dividendAmount:Number
    handleStockIdChangeCallback: (newStockId: number) => void
    applyDividendCallback: () => void
    handleDividendAmountChangeCallback:(newamount: number )=> void
}


export class Dividend extends React.Component<DividendProps,{}> {
    constructor(props: DividendProps) {
        super(props);      
    }

    componentDidMount() {
		$("#stock-container").dropdown({
			onChange: this.handleStockChange,
		});
	}

	// just semantic things.
	componentDidUpdate() {
		$("#stock-container").dropdown("refresh");
		$("#stock-container div.text").html($("#stock-container .item.selected").html())
	}


    handleStockChange = (stockId: string) => {
		const newStockId = Number(stockId);
		this.props.handleStockIdChangeCallback(newStockId);
	};

    handleDividendAmountChange= (e:any) =>{
        const value=e.target.value;
        this.props.handleDividendAmountChangeCallback(value);
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
            <table id="dividend-table">
                <tbody>
                    <tr>
                        <td>
                        <div id="stock-container" className="ui fluid search selection dropdown">
				          <input name="stock" type="hidden" value={this.props.currentStockId.toString()}/>
				          <i className="dropdown icon"></i>
				          <div className="default text">Select Stock</div>
				          <div className="menu ui grid">
			        		{options}
				          </div>
			            </div>
                        </td>
                        <td>
                          <input type="integer" className="market-input" id="dividend-amount" name="dividend-amount" onChange={this.handleDividendAmountChange.bind(this)} value={this.props.dividendAmount.toString()}/>
                        </td>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.props.applyDividendCallback.bind(this)} value="Send Dividends"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>	   
        );
    }
}

