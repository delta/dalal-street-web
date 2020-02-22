import * as React from "react";
import { Fragment } from "react";
import { addCommas } from "../../utils";

declare var $: any;

export interface TinyNetworthProps {
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userReservedStocksWorth: number,
    connectionStatus: boolean,
    userStockWorth: number,
    isMarketOpen: boolean,
    isBlocked: boolean,
}

export class TinyNetworth extends React.Component<TinyNetworthProps, {}> {
    constructor(props: TinyNetworthProps) {
        super(props);
    }

    componentDidMount() {
        $("#tiny-networth .box").popup();
    }

    render() {
        const stockWorth = this.props.userStockWorth;
        const stockWorthClass = stockWorth >= 0 ? "green" : "red";
        const netWorthClass = this.props.userTotal >= 0 ? "green" : "red";
        let connection = "";
        let connectionStatusClass = "";
        let connectionMessage = "";
        
        if(this.props.isMarketOpen && !this.props.isBlocked){
             connection = this.props.connectionStatus == true ? "Connected" : "Disconnected";
             connectionStatusClass = this.props.connectionStatus == true ? "green" : "red";
             connectionStatusClass += " inverted";
             connectionMessage = "Server connection status";
        }
        else if(this.props.isBlocked){
            connection = this.props.connectionStatus == true ? "Blocked": "Disconnected";
            connectionStatusClass = "red";
            connectionStatusClass += " inverted";
            connectionMessage = "This account is blocked temporarily for doing inappropiate actions";
        }
        else {
            connection = "Closed";
            connectionStatusClass = "black";
            connectionMessage = "Market is closed";
        }

        return (
            <div id="tiny-networth" className="ui statistics">
              <div className="ui six wide column box" data-content={connectionMessage}>
                  <h3 className={"ui center aligned " + connectionStatusClass + " header"}>
                      <i className="wifi icon small"></i>
                       {connection}
                  </h3>
              </div>
                <div className="ui six wide column box" data-content="Cash in hand">
                    <h3 className={"ui center aligned green header inverted"}>
                        <i className="fa fa-money"></i> &nbsp;&nbsp;
                        {addCommas(this.props.userCash)}
                    </h3>
                </div>
                <div className="ui six wide column box" data-content="Reserved Cash">
                    <h3 className={"ui center aligned black header inverted"}>
                        <i className="fa fa-registered"></i> &nbsp;&nbsp;
                        {addCommas(this.props.userReservedCash)}
                    </h3>
                </div>
                <div className="ui six wide column box" data-content="Worth of stocks owned by you">
                    <h3 className={"ui center aligned " + stockWorthClass + " header inverted"}>
                        <i className="line chart icon small"></i>
                        {addCommas(stockWorth)}
                    </h3>
                </div>
                <div className="ui six wide column box" data-content="Reserved Stocks worth">
                    <h3 className={"ui center aligned black header inverted"}>
                        <i className="balance scale icon small"></i>
                        {addCommas(this.props.userReservedStocksWorth)}
                    </h3>
                </div>
                <div className="ui five wide column box" data-content="Your net worth">
                    <h3 className={"ui center aligned " + netWorthClass + " header inverted"}>
                        <i className="database icon very small"></i>
                        {addCommas(this.props.userTotal)}
                    </h3>
                </div>
            </div>
        );
    }
}
