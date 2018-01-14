import * as React from "react";

export interface TickerProps {
    companyName: string,
    currentPrice: number,
    previousPrice: number
}

export class Ticker extends React.Component<TickerProps, {}> {

    render() {
        let difference = this.props.currentPrice - this.props.previousPrice;
        let sign = '';
        if( difference > 0 )
            sign = '+';

        return (
        <div className="ticker_item">
            <h4 className='stock_name'>
                { this.props.companyName } 
            </h4>

            <span className = 'stock_price'>
            { `₹ ${this.props.currentPrice}`}
            </span>

            <span className = { difference > 0 ? 'profit' : 'loss' }>
                <strong>{ `${sign}${difference} (${sign}${(difference)/this.props.currentPrice * 100}%)`}</strong>
            </span>
        </div>
        );
    }
}