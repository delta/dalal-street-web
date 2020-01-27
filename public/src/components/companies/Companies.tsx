import * as React from "react";
import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { SearchBar } from "../trading_terminal/SearchBar";
import { CompanyDetails } from "./CompanyDetails";
import { Fragment } from "react";

export interface CompanyProps {
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userStockWorth: number,
    connectionStatus: boolean,
    isMarketOpen: boolean,
    sessionMd: Metadata,
    notifications: Notification_pb[],
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stockPricesMap: { [index: number]: number },
    disclaimerElement: JSX.Element,
    reservedStocksWorth: number
}

interface CompanyState {
    currentStockId: number,
    currentPrice: number,
}

export class Company extends React.Component<CompanyProps, CompanyState> {
    constructor(props: CompanyProps) {
        super(props);

        const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0])
        this.state = {
            currentStockId: currentStockId,
            currentPrice: props.stockPricesMap[currentStockId],
        };
    }

    componentDidMount() {

    }

    // child will affect the current stock id
    handleStockIdChange = (newStockId: number) => {
        this.setState({
            currentStockId: newStockId,
            currentPrice: this.props.stockPricesMap[newStockId],
        });
    };

    render() {
        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <div id="search-bar">
                        <SearchBar
                            stockBriefInfoMap={this.props.stockBriefInfoMap}
                            stockPricesMap={this.props.stockPricesMap}
                            handleStockIdCallback={this.handleStockIdChange}
                            defaultStock={this.state.currentStockId} />
                    </div>

                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth = {this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} />
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="company-details" className="main-container ui stackable grid pusher">
                    <CompanyDetails
                        sessionMd={this.props.sessionMd}
                        currentStockId={this.state.currentStockId}
                        currentPrice={this.state.currentPrice}
                    />
                    {this.props.disclaimerElement}
                </div>
            </Fragment>
        );
    }
}
