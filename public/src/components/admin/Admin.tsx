import * as React from "react";
import { Metadata } from "grpc-web-client";
import { SendDividendsRequest } from "../../../proto_build/actions/SendDividends_pb";
import { CloseMarketRequest } from "../../../proto_build/actions/CloseMarket_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Dividend } from "./Dividend";
import { Notifications } from "./Notification";
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";
import { AddDailyChallenge } from "./AddDailyChallenge";
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
import {DailyChallengeState} from "../admin/DailyChallengeState";

type NumNumMap = { [index: number]: number };

declare var $: any;
export interface AdminProps {
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo }, // get stock detail for a given stockid
    stockPricesMap: NumNumMap,
    isMarketOpen: boolean,
    isDailyChallengeOpen: boolean
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
		
		componentDidMount() {
			$('#context1 .menu .item')
			.tab({
				context: $('#context1')
			});
		}

    render() {
        return (
					<React.Fragment>
					<div
						id="admin-panel"
						className="main-container ui stackable grid pusher"
					>
						<div id="context1" style={{ width: "85%", margin: "1rem" }}>
							<div className="ui pointing secondary menu">
								<a className="item active" data-tab="first">
									Stonks
								</a>
								<a className="item" data-tab="second">
									Daily Market
								</a>
								<a className="item" data-tab="third">
									User Specific
								</a>
							</div>
							<div className="ui tab inverted segment active" data-tab="first">
								<div className="ui top attached tabular menu">
									<a className="active item" data-tab="first/a">
										Bankruptcy
									</a>
									<a className="item" data-tab="first/b">
										Stock Price
									</a>
									<a className="item" data-tab="first/c">
										Stock Exchange
									</a>
									<a className="item" data-tab="first/d">
										Dividends
									</a>
									<a className="item" data-tab="first/e">
										News
									</a>
								</div>
								{/* start of BANKRUPTCY */}
								<div
									className="ui bottom attached active tab inverted segment"
									data-tab="first/a"
								>
									Set and unset Bankruptcy of Companies.
									<div className="admin-panel content1">
										<Bankruptcy
											stockBriefInfoMap={this.props.stockBriefInfoMap}
											sessionMd={this.props.sessionMd}
										/>
									</div>
								</div>
								{/* end of BANKRUPTCY */}
	
								{/* start of STOCK PRICE */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="first/b"
								>
									Update the stock price of a company
									<div className="admin-panel content1">
										<UpdateStockPrice sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of STOCK PRICE */}
	
								{/* start of STOCK EXCHANGE */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="first/c"
								>
									Add stocks to exchange
									<div className="admin-panel content1">
										<AddStocksToExchange sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of STOCK EXCHANGE */}
								{/* start of DIVIDENDS */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="first/d"
								>
									Add Dividends
									<div className="admin-panel content1">
										<Dividend
											sessionMd={this.props.sessionMd}
											stockBriefInfoMap={this.props.stockBriefInfoMap}
											currentStockId={this.state.currentStockId}
											dividendAmount={this.state.dividendAmount}
											handleStockIdChangeCallback={this.handleStockIdChange}
											handleDividendAmountChangeCallback={
												this.handleDividendAmountChange
											}
											applyDividendCallback={this.applyDividend}
										/>
									</div>
									Set Dividends
									<div className="admin-panel content1">
										<SetDividends
											sessionMd={this.props.sessionMd}
											stockBriefInfoMap={this.props.stockBriefInfoMap}
										/>
									</div>
								</div>
								{/* end of DIVIDENDS */}
								{/* start of NEWS */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="first/e"
								>
									News
									<div className="admin-panel content2">
										<MarketEvent sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of NEWS */}
							</div>
							<div className="ui tab inverted segment" data-tab="second">
								<div className="ui top attached tabular menu">
									<a className="item active" data-tab="second/a">
										Open/ Close Market
									</a>
									<a className="item" data-tab="second/b">
										Daily Leader board
									</a>
									<a className="item" data-tab="second/c">
										Daily Challenges
									</a>
								</div>
	
								{/* start of DAILY MARKET */}
	
								{/* start of OPEN /ClOSE MARKET */}
								<div
									className="ui bottom attached tab inverted segment active"
									data-tab="second/a"
								>
									Open / Close Market
									<div className="admin-panel content2">
										<MarketState
											sessionMd={this.props.sessionMd}
											isMarketOpen={this.props.isMarketOpen}
										/>
									</div>
								</div>
								{/* end of OPEN /ClOSE MARKET */}
	
								{/* start of DAILY LEADER BOARD */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="second/b"
								>
									Update End of day Values
									<div className="admin-panel content1">
										<UpdateEndOfDayValues sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of DAILY LEADER BOARD */}
	
								{/* start of DAILY CHALLENGES */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="second/c"
								>
									Add Daily Challenge
									<div className="admin-panel content3">
										<AddDailyChallenge sessionMd={this.props.sessionMd} />
									</div>
									Update Daily Challenge State
									<div className="admin-panel content2">
										<DailyChallengeState
											sessionMd={this.props.sessionMd}
											isDailyChallengeOpen={this.props.isDailyChallengeOpen}
										/>
									</div>
								</div>
								{/* end of DAILY CHALLENGES */}
	
								{/* end of DAILY MARKET */}
							</div>
							<div className="ui tab inverted segment" data-tab="third">
								<div className="ui top attached tabular menu">
									<a className="item active" data-tab="third/a">
										Block User
									</a>
									<a className="item" data-tab="third/b">
										Unblock User
									</a>
									<a className="item" data-tab="third/c">
										Inspect User
									</a>
									<a className="item" data-tab="third/d">
										Send Notification
									</a>
								</div>
	
								{/* start of USER SPECIFIC */}
	
								{/* start of BLOCK USER */}
								<div
									className="ui bottom attached tab inverted segment active"
									data-tab="third/a"
								>
									Block User
									<div className="admin-panel content1">
										<BlockUser sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of BLOCK USER */}
	
								{/* start of UNBLOCK USER */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="third/b"
								>
									Unblock User
									<div className="admin-panel content1">
										<UnBlockUser sessionMd={this.props.sessionMd} />
									</div>
									Unblock All Users
									<div className="admin-panel content1">
										<UnBlockAllUsers sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of UNBLOCK USER */}
	
								{/* start of INSPECT USER */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="third/c"
								>
									Inspect User
									<div className="admin-panel content3">
										<InspectUser sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of INSPECT USER */}
	
								{/* start of SEND NOTIFICATION */}
								<div
									className="ui bottom attached tab inverted segment"
									data-tab="third/d"
								>
									Send Notification
									<div className="admin-panel content2">
										<Notifications sessionMd={this.props.sessionMd} />
									</div>
								</div>
								{/* end of SEND NOTIFICATION */}
	
								{/* end of USER SPECIFIC */}
							</div>
						</div>
						<div className="ui divider"></div>
					</div>
				</React.Fragment>
        )
    }
}