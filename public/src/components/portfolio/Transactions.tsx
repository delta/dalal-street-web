import * as React from "react";

export interface TransactionsProps {

}

interface TransactionsState {

}

export class Transactions extends React.Component<TransactionsProps, TransactionsState> {
    constructor(props: TransactionsProps) {
        super(props);
    }

    render() {
        return <h1>transactions</h1>
    }
}