import * as React from "react";

export interface TickerProps { company_name: any; current_price: any; previous_price: any; }

export class Ticker extends React.Component<TickerProps, {}> {

    render() {
        var difference = this.props.current_price - this.props.previous_price;
        var sign = '';
        if( difference > 0 )
            sign = '+';

        return (
        <div className="ticker_item">
            <h3 className='stock_name'>
                { this.props.company_name } 
            </h3>

            <span className = 'stock_price'>
            { `₹ ${this.props.current_price}`}
            </span>

            <br/>

            <span className = { difference > 0 ? 'profit' : 'loss' }>
                { `${sign}${difference} (${sign}${(difference)/this.props.current_price}%)`}
            </span>
        </div>
        );
    }
}