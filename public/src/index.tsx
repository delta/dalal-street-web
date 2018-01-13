import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import { BuySellBox } from "./components/BuySellBox";
import { Navbar } from "./components/Navbar";
import { TickerBar } from "./components/TickerBar"


// ReactDOM.render(
//     //<Hello compiler="TypeScript" framework="React" />,
//     //<Ticker company_name="Google" current_price="1000" previous_price="980" />,
//     //<BuySellBox company_id="Lol" current_price="123"/>,
//     document.getElementById("testreact")
// );


ReactDOM.render(
    <Navbar/>,
    document.getElementById("navbar")
);

// ReactDOM.render(
//     <TickerBar data=/>,
//     document.getElementById("navbar")
// );