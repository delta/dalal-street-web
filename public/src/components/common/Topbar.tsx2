import * as React from "react";
import { Switch, Route } from "react-router-dom";

import { SearchBar } from "../trading_terminal/SearchBar";
import { Notification } from "../common/Notification";

export interface TopbarProps { 
    userId: number
}

export class Topbar extends React.Component<TopbarProps, {}> {
    render(){
        let icon = "open envelope icon";
        let messages  = ["hi there ","my name", "is Akshay", "Pai."];
        let stockDetails = [
            {
                "stockId": 1,
                "stockName": "Amazon",
                "stockFullName": "Amazon",
                "currentPrice": 100
            },
            {
                "stockId": 2,
                "stockName": "Facebook",
                "stockFullName": "Facebook",
                "currentPrice": 100
            },
            {
                "stockId": 3,
                "stockName": "Firefox",
                "stockFullName": "Firefox",
                "currentPrice": 100
            },
            {
                "stockId": 4,
                "stockName": "Github",
                "stockFullName": "Github",
                "currentPrice": 100
            },
            {
                "stockId": 5,
                "stockName": "Google",
                "stockFullName": "Google",
                "currentPrice": 100
            }
        ];
        return (
            <div className="row" id="top_bar">
                <Switch>
                    <Route exact path="/trade" render={(props) => (
                        <SearchBar {...props} stockDetails={stockDetails} />
                    )} />
                </Switch>
        
                <div id="notif-component">
                    <Notification messages={messages} icon={icon} />
                </div>
            </div>
        );
    }
}