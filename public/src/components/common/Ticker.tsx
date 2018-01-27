import * as React from "react";

export interface TickerProps {
    stockId: number,    
    companyName: string,
    currentPrice: number,
    previousPrice: number,
    stocksInExchange: number,
}

export class Ticker extends React.Component<TickerProps, {}> {

    render() {
        let difference = this.props.currentPrice - this.props.previousPrice;
        let sign = '';
        if( difference > 0 )
            sign = '+';
        let tempNumber = (difference)/this.props.previousPrice * 100;
        tempNumber = parseFloat(tempNumber.toFixed(2));

        return (
        <div className="ticker_item">
            <h4 className='stock_name'>
                { this.props.companyName } 
            </h4>

            <span className = 'stock_price'>
            { `₹ ${this.props.currentPrice}`}
            </span>

            <span className = { difference > 0 ? 'profit' : 'loss' }>
                <strong>{ `${sign}${difference} (${sign}${tempNumber}%)`}</strong>
            </span>
        </div>
        );
    }
}