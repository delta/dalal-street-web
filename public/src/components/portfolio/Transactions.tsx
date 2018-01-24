import * as React from "react";
import { Fragment } from "react";
import { Metadata } from "grpc-web-client";


export interface TransactionsProps {
    sessionMd: Metadata,
    count: number,
}

export class Transactions extends React.Component<TransactionsProps, {}> {
    constructor(props: TransactionsProps) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="ui pointing secondary menu">
                    <h3 className="panel-header right item">Open Orders</h3>
                </div>
                <table className="ui inverted table unstackable">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Date Bought</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </Fragment>
        )
    }
}