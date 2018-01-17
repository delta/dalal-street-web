import * as React from "react";

import { SearchBar } from "../trading_terminal/SearchBar";
import { Notification } from "../common/Notification";

export interface TopbarProps { 
    messages: string[],
    icon: string
}

export class Topbar extends React.Component<TopbarProps, {}> {
    render(){
        return (
            <div className="row" id="top_bar">
                <div id="search-bar" className="left floated">
                    
                </div>
        
                <div id="notif-component">
                </div>
            </div>
        );
    }
}