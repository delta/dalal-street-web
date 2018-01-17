import * as React from "react";

import { MarketDepth } from "./trading_terminal/MarketDepth"
import { TradingHistory } from "./trading_terminal/TradingHistory";
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
        return(<h1>hi</h1>);
    }
}