import * as React from "react";


import { OrderBook } from "./trading_terminal/OrderBook";
import { OpenOrders } from "./trading_terminal/OpenOrders";
import { SearchBar } from "./trading_terminal/SearchBar";
import { Notification } from "./common/Notification";
import { PlaceOrderBox } from "./trading_terminal/PlaceOrderBox";

export interface TradingTerminalProps {
}

export class TradingTerminal extends React.Component<TradingTerminalProps, {}> {
    constructor(props: TradingTerminalProps) {
        super(props);
    }
    render(){
        return(
        	<div className="ui stackable grid pusher">
        		<div className="row" id="trading-terminal-row1">
					<OrderBook />
					<div id="chart-container" className="ten wide column box">
						
					</div>
				</div>
				<div className="row" id="trading-terminal-row2">
					<PlaceOrderBox stockId={4} currentPrice={100} />
					<OpenOrders userId={1} />
				</div>
        	</div>
        );
    }
}