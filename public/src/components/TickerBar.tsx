import * as React from "react";
import { Ticker } from "./Ticker";

export interface TickerBarProps { data: any; data_len: any;}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class TickerBar extends React.Component<TickerBarProps, {}> {
    render() {

        var my_list_of_divs = '';

        for (var i = 0; i<this.props.data_len; i++){
        my_list_of_divs = my_list_of_divs + `${<Ticker company_name={this.props.data[i].company_name} current_price={this.props.data[i].current_price} previous_price={this.props.data[i].previous_price} />}`;
        }

        return (my_list_of_divs);
    }
}