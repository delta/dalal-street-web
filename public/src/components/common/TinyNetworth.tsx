import * as React from "react";
import { Fragment } from "react";

declare var $: any;

export interface TinyNetworthProps {
    userCash: number,
    userTotal: number,
}

export class TinyNetworth extends React.Component<TinyNetworthProps, {}> {
    constructor(props: TinyNetworthProps) {
        super(props);
    }

    componentDidMount() {
        $("#tiny-networth .box").popup();
    }

    render() {
        const stockWorth = this.props.userTotal - this.props.userCash;
        const stockWorthClass = stockWorth >= 0 ? "green" : "red";
        return (
            <div id="tiny-networth" className="ui statistics">
                <div className="ui six wide column box" data-content="Cash in hand">
                    <h3 className={"ui center aligned " + stockWorthClass + " header inverted"}>
                        <i className="fa fa-money"></i> &nbsp;&nbsp;
                        {this.props.userTotal}
                    </h3>
                </div>
                <div className="ui six wide column box" data-content="Worth of stocks owned by you">
                    <h3 className={"ui center aligned " + stockWorthClass + " header inverted"}>
                        <i className="line chart icon small"></i>
                        {stockWorth}
                    </h3>
                </div>
                <div className="ui five wide column box" data-content="Your net worth">
                    <h3 className="ui center aligned green header inverted">
                        <i className="database icon very small"></i>
                        {this.props.userTotal}
                    </h3>
                </div>
            </div>
        );
    }
}