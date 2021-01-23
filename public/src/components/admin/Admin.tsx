import * as React from "react";
import { Metadata } from "grpc-web-client";
import { SendNewsRequest } from "../../../proto_build/actions/SendNews_pb";
import { SendDividendsRequest } from "../../../proto_build/actions/SendDividends_pb";
import { CloseMarketRequest } from "../../../proto_build/actions/CloseMarket_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Dividend } from "./Dividend";
import { Notifications } from "./Notification";
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";
import { MarketState } from "./MarketState";
import { MarketEvent } from "./MarketEvent";
import { Bankruptcy } from "./Bankruptcy";
import { SetDividends } from "./SetDividends";
import { InspectUser } from "./InspectUser"
import { BlockUser } from "./BlockUser";
import { AddStocksToExchange } from "./StocksToExhange";
import { UnBlockUser } from "./UnBlockUser";
import { UnBlockAllUsers } from "./UnBlockAllUsers"
import { UpdateStockPrice } from "./UpdateStockPrice";
import { UpdateEndOfDayValues } from "./updateEndOfdayValues";

type NumNumMap = { [index: number]: number };

export interface AdminProps {
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo }, // get stock detail for a given stockid
    stockPricesMap: NumNumMap,
    isMarketOpen: boolean
}

interface AdminState {
    // dividend feature
    currentStockId: number
    dividendAmount: number
}

export class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: AdminProps) {
        super(props);
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.state = {
            currentStockId: currentStockId,
            dividendAmount: 0
        }
    }
    // Submit states to backend for dividend feature
    applyDividend = async () => {
        var dividendStockId = this.state.currentStockId;
        var dividendAmount = this.state.dividendAmount;
        const sessionMd = this.props.sessionMd;
        const stockName = this.props.stockBriefInfoMap[dividendStockId].fullName;
        // Change to defaults: avoids multiple click issue
        $("#dividend-amount").val("");
        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        this.setState(prevState => {
            return {
                dividendAmount: 0,
            }
        });
        if (isPositiveInteger(dividendAmount + 1)) {
            const dividendReq = new SendDividendsRequest();
            try {
                dividendReq.setDividendAmount(dividendAmount);
                dividendReq.setStockId(dividendStockId);
                const resp = await DalalActionService.sendDividends(dividendReq, sessionMd);
                // If any error occurs, it will be raised in DalalMessage_pb_Service
                showNotif("Dividend has been successfully sent on " + stockName + "!");
            } catch (e) {
                console.log("Error happened while applying dividend! ", e.statusCode, e.statusMessage, e);
                if (e.isGrpcError) {
                    showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
                } else {
                    showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
                }
            }
        }
        else {
            showErrorNotif("Enter a valid integer!");
        }
    }
    // Updates stockid for dividend feature
    handleStockIdChange = (newStockId: number) => {
        this.setState(prevState => {
            return {
                currentStockId: newStockId
            }
        });
    };
    // Updates no.of stocks for dividend feature 
    handleDividendAmountChange = (newamount: number) => {
        this.setState(prevState => {
            return {
                dividendAmount: newamount
            }
        });
    };
    purchaseFromExchange = async (event: any) => {
        try {
            const request = new CloseMarketRequest();
            const resp = await DalalActionService.closeMarket(request, this.props.sessionMd);
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <React.Fragment>
                <div id="admin-panel" className="main-container ui stackable grid pusher">
                    <table>
                        <tbody>
                            <tr>
                                <td className="dividendPanel">
                                    <Dividend
                                        sessionMd={this.props.sessionMd}
                                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                                        currentStockId={this.state.currentStockId}
                                        dividendAmount={this.state.dividendAmount}
                                        handleStockIdChangeCallback={this.handleStockIdChange}
                                        handleDividendAmountChangeCallback={this.handleDividendAmountChange}
                                        applyDividendCallback={this.applyDividend}
                                    />
                                </td>
                                <td className="marketStatus">
                                    <MarketState
                                        sessionMd={this.props.sessionMd}
                                        isMarketOpen={this.props.isMarketOpen}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Notifications sessionMd={this.props.sessionMd} />
                                </td>
                                <td>
                                    <MarketEvent
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Bankruptcy
                                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                                <td>
                                    <SetDividends
                                        sessionMd={this.props.sessionMd}
                                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <BlockUser
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                                <td>
                                    <UnBlockUser
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <UnBlockAllUsers
                                    sessionMd={this.props.sessionMd}
                                    />
                                </td>
                                <td>
                                <UpdateEndOfDayValues 
                                    sessionMd={this.props.sessionMd} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <AddStocksToExchange
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                                <td>
                                    <UpdateStockPrice
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InspectUser
                                        sessionMd={this.props.sessionMd}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }
}