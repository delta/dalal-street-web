import * as React from "react";
import * as ReactDOM from "react-dom";

import { PlaceOrderBox } from "./components/trading_terminal/PlaceOrderBox";
import { Navbar } from "./components/common/Navbar";
import { TickerBar } from "./components/common/TickerBar";
import {Notification } from "./components/common/Notification";

let icon_name = "open envelope icon";
let	messages  = ["hi there ","my name", "is Akshay", "Pai."];

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
	},
	{
		"companyName": "Google",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Google1",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Google2",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Google3",
		"currentPrice": 100,
		"previousPrice": 10
	},
	{
		"companyName": "Google4",
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

ReactDOM.render(
    <Notification messages={messages} icon={icon_name} />,
    document.getElementById("notif-component")
);