import * as React from "react";
import * as $ from "jquery";
import { Ticker, TickerProps } from "./Ticker";

export interface TickerBarProps {
	stocks: TickerProps[]
}

export class TickerBar extends React.Component<TickerBarProps, {}> {
	
	handleScroll(event: any, sign: number) {
		const tickerBar = $('div.scrolling-wrapper');
		if (sign == 1) {
			tickerBar.animate({'scrollLeft':`+=${$(".scrolling-wrapper").width()}px`}, 500);
		}
		else {
			tickerBar.animate({'scrollLeft':`-=${$(".scrolling-wrapper").width()}px`}, 500);
		}
	}

    render() {
    	const stocks = this.props.stocks;
        const tickers = stocks.map((stock) => 
        	<Ticker key={stock.companyName} stocksInExchange={stock.stocksInExchange} stockId={stock.stockId} companyName={stock.companyName} currentPrice={stock.currentPrice} previousPrice={stock.previousPrice} />
        );

        return (
        	<div className="ticker-wrapper">
	        	<div className="scrolling-wrapper">{tickers}</div>
	        	<div className="ticker-arrow-wrapper">
					<i className="chevron left icon inverted" onClick={e => this.handleScroll(e,-1)}></i>
						<br/>
					<i className="chevron right icon inverted" onClick={e => this.handleScroll(e, 1)}></i>	
				</div>
			</div>
        );
    }
}