import * as React from 'react';
import { grpc } from "@improbable-eng/grpc-web";
import { showNotif, showErrorNotif, closeNotifs,showSuccessNotif } from "../../utils";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { UpdateStockPriceRequest } from "../../../proto_build/actions/UpdateStockPrice_pb";

interface UpdateStockPriceProps {
    sessionMd: grpc.Metadata,
}

interface UpdateStockPriceState {
    stockID: number
    price: number
}

export class UpdateStockPrice extends React.Component<UpdateStockPriceProps, UpdateStockPriceState> {
    constructor(props: UpdateStockPriceProps) {
        super(props);
        this.state = {
            stockID: 0,
            price: 0
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

    updateStockPrice = async () => {
        const updateStockReq = new UpdateStockPriceRequest();
        const stockID = this.state.stockID;
        const sessionMd = this.props.sessionMd;
        const stockPrice = this.state.price;
        try {
            updateStockReq.setStockId(stockID);
            updateStockReq.setNewPrice(stockPrice)
            const resp = await DalalActionService.updateStockPrice(updateStockReq, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showSuccessNotif("Prices of stockId "+stockID+" have been updated to Rs."+stockPrice+" successfully!","success");
        } catch (e) {
            console.log("Error happened while inspecting User ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }

    handleStockPriceChange = (e: any) => {
        const newPrice = Number(e.currentTarget.value)
        this.setState((prevState) => {
            return {
                price: newPrice
            }
        });
    }

    render() {
        let content = [];

        return (
            <React.Fragment>
                <table id="updateStockPrice-table">
                    <tbody className="ui bottom attached tab segment active inverted">
                        <tr>
                            <td>
                                <input type="integer" className="market-input" id="stock-id" name="stock-id" onChange={this.handleStockIDChange.bind(this)} placeholder="Stock ID" />
                            </td>
                            <td>
                                <input type="integer" className="market-input" id="stock-price" name="stock-price" onChange={this.handleStockPriceChange.bind(this)} placeholder="Price" />
                            </td>
                            <td>
                                <input type="button" className="ui inverted green button" onClick={this.updateStockPrice.bind(this)} value="Update Price" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}
