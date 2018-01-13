import * as React from "react";
import { Ticker, TickerProps } from "./Ticker";

export interface TickerBarProps {
	stocks: TickerProps[]
}

export class TickerBar extends React.Component<TickerBarProps, {}> {
    render() {
    	const stocks = this.props.stocks;
        const tickers = stocks.map((stock) => 
        	<Ticker key={stock.companyName} companyName={stock.companyName} currentPrice={stock.currentPrice} previousPrice={stock.previousPrice} />
        );

        return (
        	<div className="scrolling-wrapper">{tickers}</div>
        );
    }
}