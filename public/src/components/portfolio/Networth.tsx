import * as React from "react";
import { Fragment } from "react";
import { addCommas } from "../../utils";

export interface NetworthProps {
    userCash: number,
    userReservedCash: number,
    userReservedStocks: number,
    userStockWorth: number,
    userTotal: number,
}

interface NetworthState {

}

export class Networth extends React.Component<NetworthProps, NetworthState> {
    constructor(props: NetworthProps) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const stockWorthClass = this.props.userStockWorth >= 0 ? "green" : "red";
        const netWorthClass = this.props.userTotal >= 0 ? "green" : "red";
        return (
            <Fragment>
                <div className="ui three wide column">
                    <h1 className="ui center aligned green header inverted">
                        ₹ {addCommas(this.props.userCash)}
                        <div className="sub header">Cash in Hand</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className={"ui center aligned green header inverted"}>
                        ₹ {addCommas(this.props.userReservedCash)}
                        <div className="sub header">Reserved Cash</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className={"ui center aligned " + stockWorthClass + " header inverted"}>
                        ₹ {addCommas(this.props.userStockWorth)}
                        <div className="sub header">Stock Worth</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className={"ui center aligned green header inverted"}>
                        ₹ {addCommas(this.props.userReservedStocks)}
                        <div className="sub header">Reserved Stock Worth</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className={"ui center aligned " + netWorthClass+ " header inverted"}>
                        ₹ {addCommas(this.props.userTotal)}
                        <div className="sub header">Net Worth</div>
                    </h1>
                </div>
            </Fragment>
        );
    }
}
