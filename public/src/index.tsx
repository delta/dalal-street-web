import * as React from "react";
import * as ReactDOM from "react-dom";

import { BuySellBox } from "./components/trading_terminal/BuySellBox";
import { Navbar } from "./components/common/Navbar";
import { TickerBar } from "./components/common/TickerBar"


let data = [
	{
		"companyName": "Amazon",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Amazon1",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Amazon2",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Amazon3",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Amazon4",
		"currentPrice": 100,
		"previousPrice": 10
	}
];

ReactDOM.render(
    <Navbar />,
    document.getElementById("navbar")
);

ReactDOM.render(
    <TickerBar stocks={data} />,
    document.getElementById("ticker-bar")
);