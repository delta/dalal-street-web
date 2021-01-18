import * as React from 'react';
import { grpc } from "@improbable-eng/grpc-web";
import { showNotif, showErrorNotif, closeNotifs,showSuccessNotif } from "../../utils";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { AddStocksToExchangeRequest } from "../../../proto_build/actions/AddStocksToExchange_pb";

interface AddStocksToExchangeProps {
    sessionMd: grpc.Metadata,
}

interface AddStocksToExchangeState {
    stockID: number
    numberOfStocks: number
}

export class AddStocksToExchange extends React.Component<AddStocksToExchangeProps, AddStocksToExchangeState> {
    constructor(props: AddStocksToExchangeProps) {
        super(props);
        this.state = {
            stockID: 1,
            numberOfStocks: 10
        }
    }

    handleStockIDChange = (e: React.FormEvent<HTMLInputElement>) => {

        const stockID = Number(e.currentTarget.value);
        this.setState(prevState => {
            return {
                stockID: stockID
            }
        });
    };

    addStocks = async () => {
        const addStocksReq = new AddStocksToExchangeRequest();
        const stockID = this.state.stockID;
        const sessionMd = this.props.sessionMd;
        const numberOfStocks = this.state.numberOfStocks;
        try {
            addStocksReq.setStockId(stockID);
            addStocksReq.setNewStocks(numberOfStocks)
            const resp = await DalalActionService.addStocksToExchange(addStocksReq, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showSuccessNotif(numberOfStocks+" stocks of stockId "+stockID+" have been added to the exchange successfully!" ,"success");
        } catch (e) {
            console.log("Error happened while inspecting User ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }

    handleStockNumberChange = (e: any) => {
        const no = Number(e.currentTarget.value)
        this.setState((prevState) => {
            return {
                numberOfStocks: no
            }
        });
    }

    render() {
        let content = [];

        return (
            <React.Fragment>
                <table id="stocksToExchange-table">
                    <tbody className="ui bottom attached tab segment active inverted">
                        <tr>
                            <td>
                                <input type="integer" className="market-input" id="stock-id" name="stock-id" onChange={this.handleStockIDChange.bind(this)} placeholder="Stock ID" />
                            </td>
                            <td>
                                <input type="integer" className="market-input" id="stock-quantity" name="stock-quantity" onChange={this.handleStockNumberChange.bind(this)} placeholder="Stock Number" />
                            </td>
                            <td>
                                <input type="button" className="ui inverted green button" onClick={this.addStocks.bind(this)} value="Add Stocks" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}
