import * as React from "react";
import { Metadata } from "grpc-web-client";

import { subscribe, unsubscribe } from "../../streamsutil";
import { DataStreamType, SubscriptionId } from "../../../proto_build/datastreams/Subscribe_pb";
import { DalalActionService, DalalStreamService } from "../../../proto_build/DalalMessage_pb_service";

import { GetTransactionsRequest } from "../../../proto_build/actions/GetTransactions_pb";
import { TransactionUpdate } from "../../../proto_build/datastreams/Transactions_pb";
import { Transaction as Transaction_pb, TransactionType } from "../../../proto_build/models/Transaction_pb";

import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

// Moment will be exposed globally by the MomentJS script included in index.html
declare var moment: any;

const FROM_EXCHANGE_TRANSACTION = TransactionType.FROM_EXCHANGE_TRANSACTION;
const ORDER_FILL_TRANSACTION = TransactionType.ORDER_FILL_TRANSACTION;
const MORTGAGE_TRANSACTION = TransactionType.MORTGAGE_TRANSACTION;
const DIVIDEND_TRANSACTION = TransactionType.DIVIDEND_TRANSACTION;

// Utility function to convert TransactionType to a string
const transactionTypeToStr = (trType: TransactionType): string => {
    switch(trType) {
		case FROM_EXCHANGE_TRANSACTION : return "Exchange";
		case ORDER_FILL_TRANSACTION : return "OrderFill";
		case MORTGAGE_TRANSACTION : return "Mortgage";
		case DIVIDEND_TRANSACTION : return "Dividend";
    }
    return "";
}

const transactionTime = (trTime: string): string => {
    let hours = moment.duration(moment().diff(trTime)).asHours();
    if (hours > 21) {
        return moment(trTime).format("DD-MM-YY HH:mm");
    }
    return moment(trTime).fromNow();
}

export interface TransactionsProps {
    sessionMd: Metadata,
    transactionCount: number,
    stockBriefInfoMap: { [index:number]: StockBriefInfo },
    transactionUpdatesCallback: (stockId: number, stockQuantity: number, total: number) => void,
}

interface TransactionsState {
    subscriptionId: SubscriptionId,
    transactions: Transaction_pb[],
}

export class Transactions extends React.Component<TransactionsProps, TransactionsState> {
    constructor(props: TransactionsProps) {
        super(props);

        this.state = {
            subscriptionId: new SubscriptionId,
            transactions: [],
        };
    }

    componentDidMount() {
        this.getOldTransactions();
    }

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.subscriptionId);
    }

    getOldTransactions = async () => {
        const transactionsRequest = new GetTransactionsRequest();

        // lastTransactionId = 0 fetches the latest transactions
        transactionsRequest.setLastTransactionId(0);
        transactionsRequest.setCount(this.props.transactionCount); 

        try {
            const resp = await DalalActionService.getTransactions(transactionsRequest, this.props.sessionMd);
            console.log(resp.getStatusCode(), resp.toObject());
            this.setState({
                transactions: resp.getTransactionsList()
            });

            this.handleTransactionsStream();
        } catch(e) {
            // error could be grpc error or Dalal error. Both handled in exception
			console.log("Error happened! ", e.statusCode, e.statusMessage, e);
        }
    }

    handleTransactionsStream = async () => {
        const props = this.props;
        const subscriptionId = await subscribe(props.sessionMd, DataStreamType.TRANSACTIONS);

		this.setState({
			subscriptionId: subscriptionId,
		});

		const stream = DalalStreamService.getTransactionUpdates(subscriptionId, props.sessionMd);
        for await (const update of stream) {
            const newTransaction = update.getTransaction()!;
            this.props.transactionUpdatesCallback(
                newTransaction.getStockId(),
                newTransaction.getStockQuantity(),
                newTransaction.getTotal());

            let updatedTransactions = this.state.transactions.slice();
            updatedTransactions.unshift(newTransaction);

            this.setState({
                transactions: updatedTransactions,
            });
        }
    }

    render() {
        const currentTransactions = this.state.transactions;
        let transactionsContent = currentTransactions.map((transaction) => (
            <tr key={transaction.getId()}>
                <td>
                    <strong>
                        {this.props.stockBriefInfoMap[transaction.getStockId()].fullName}
                    </strong>
                </td>
                <td><strong>{transactionTypeToStr(transaction.getType())}</strong></td>
                <td className={transaction.getStockQuantity() >= 0 ? "green" : "red"}>
                    <strong>{transaction.getStockQuantity()}</strong>
                </td>
                <td><strong>{transaction.getPrice()}</strong></td>
                <td className={transaction.getTotal() >= 0 ? "green" : "red"}>
                    <strong>{transaction.getTotal()}</strong>
                </td>
                <td><strong>{transactionTime(transaction.getCreatedAt())}</strong></td>
            </tr>
        ));
        return (
            <table className="ui inverted table unstackable">
                <thead>
                    <tr><th colSpan={6} className="ui white header">
                        Your transactions
                    </th></tr>
                    <tr>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionsContent}
                </tbody>
            </table>
        );
    }
}