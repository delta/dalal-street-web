import * as React from "react";

import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb"

import { OrderBook } from "./OrderBook/OrderBook";
import { OpenOrders } from "./OpenOrders";
import { SearchBar } from "./SearchBar";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { PlaceOrderBox } from "./PlaceOrderBox";
import { Charts } from "./charts/Charts";
import { Fragment } from "react";
import ReactJoyride, { STATUS, StoreState, Step } from 'react-joyride';

export type StockBriefInfo = {
	id: number
	shortName: string
	fullName: string
	previousDayClose: number
}

type NumNumMap = { [index: number]: number };

export interface TradingTerminalProps {
	sessionMd: Metadata,
	notifications: Notification_pb[]

	userName: string
	userCash: number
	userReservedCash: number
	userTotal: number
	connectionStatus: boolean

	stocksOwnedMap: NumNumMap // stocks owned by user for a given stockid
	stockBriefInfoMap: { [index: number]: StockBriefInfo } // get stock detail for a given stockid
	stockPricesMap: NumNumMap
	constantsMap: { [index: string]: number } // various constants. Documentation found in server/actionservice/Login method

	isMarketOpen: boolean

	disclaimerElement: JSX.Element
}

interface TradingTerminalState {
	currentStockId: number
	currentPrice: number
	stockPricesMap: NumNumMap
	steps: Step[]
}

export class TradingTerminal extends React.Component<TradingTerminalProps, TradingTerminalState> {
	constructor(props: TradingTerminalProps) {
		super(props);

		const currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
		this.state = {
			currentStockId: currentStockId,
			currentPrice: this.props.stockPricesMap[currentStockId],
			stockPricesMap: this.props.stockPricesMap,
			steps: [
				{
					content: (
					  <React.Fragment>
						<h3>Welcome to Dalal Street! </h3>
						<p>Let's get you started with a quick walk through of the game.</p>
					  </React.Fragment>
					),
					placement: 'center',
					locale: { skip: <strong>Skip</strong> },
					target: 'body',
				},
				{
					content: 'This is where all the trading happens',
					placement: 'right',
					styles: {
						options: {
						}
					},
					target: '.rupee',
					title: 'Trading Terminal'
				},
				{
					content: "Want to view the stocks you've purchsed? Or the cash you have in hand? All this can be found in your portfolio",
					placement: 'right',
					styles: {
					  options: {
					  }
					},
					target: '.book',
					title: 'Portfolio'
				},
				{
					content: "This is where a company initially releases its stocks. You buy stocks from here at the start of the game.",
					placement: 'right',
					styles: {
					  options: {
					  }
					},
					target: '.chart',
					title: 'Exchange'
				},
				{
					content: "Ever find the need for some quick cash? You can lend your stocks to the bank for some cash and buy them back later.",
					placement: 'right',
					styles: {
					  options: {
					  }
					},
					target: '.university',
					title: 'Mortgage'
				},
				{
					content: "Want to find out more about the companies that you're going to invest in? This view provides all the details you need.",
					placement: 'right',
					styles: {
					  options: {
					  }
					},
					target: '.suitcase',
					title: 'Companies'
				},
				{
					content: "Keep yourself upto date with all the latest events. Use the News to predict direction of the market.",
					placement: 'right',
					styles: {
					  options: {

					  }
					},
					target: '.newspaper',
					title: 'News'
				},
				{
					content: "Want to find out where you stand amongst your fellow traders? Use the Leaderboard to see your rank",
					placement: 'right',
					styles: {
					  options: {

					  }
					},
					target: '.trophy',
					title: 'Leaderboard'
				},
				{
					content: "Still confused about something? This page contains all the help you might need to play the game.",
					placement: 'right',
					styles: {
					  options: {

					  }
					},
					target: '.help',
					title: 'Help'
				},
				{
					content: (
					  <React.Fragment>
						<h3>Doing great so far!</h3>
						<p>So far, you've see most of the core components of the game. Let's go through the Trading Terminal just so you know what's happening.</p>
					  </React.Fragment>
					),
					placement: 'center',
					locale: { skip: <strong>Skip</strong> },
					target: 'body',
				},
				{
					content: "Use this search menu to change the company in focus in the Trading Terminal",
					placement: 'bottom',
					styles: {
					  options: {

					  }
					},
					target: '.search',
					title: 'Company Search'
				},
				{
					content: "This is your inbox. This is where you'll receive all your in-game notifications.",
					placement: 'bottom',
					styles: {
					  options: {

					  }
					},
					target: '#notifbutton',
					title: 'Inbox'
				},
				{
					content: "This table shows the different buy and sell orders current active for the company in focus.",
					placement: 'right',
					styles: {
					  options: {

					  }
					},
					target: '#market-depth',
					title: 'Market Depth'
				},
				{
					target: '#orderbook-menu a:nth-child(2)',
					content: "Go ahead and click here.",
					placement: 'right',
					disableOverlayClose: true,
					spotlightClicks: true,
					styles: {
					  options: {
						zIndex: 10000,
					  },
					  spotlight: {
						backgroundColor: '#ffffff00',
					  },
					},
					title: 'Trading History'
				},
				{
					content: "This table shows you transactions that have occurred in the past for the company in focus.",
					placement: 'right',
					styles: {
					  options: {

					  }
					},
					target: '#trading-history',
					title: 'Trading History'
				},
				{
					content: "This graph shows the fluctuations in price for the company in focus.",
					placement: 'left',
					styles: {
					  options: {

					  },
					  spotlight: {
						backgroundColor: '#ffffff00',
					  },
					},
					target: '#candles-chart',
					title: 'Price Chart'
				},
				{
					content: "This is where you'll be placing buy and sell orders. Do checkout the Help section to find out what these different types of order mean.",
					placement: 'right',
					styles: {
					  options: {

					  },
					  spotlight: {
						backgroundColor: '#ffffff00',
					  },
					},
					target: '#place-order-box-container',
					title: 'Order Box'
				},
				{
					content: "Have placed some orders? This is where you'll find them.",
					placement: 'left',
					styles: {
					  options: {

					  },
					  spotlight: {
						backgroundColor: '#ffffff00',
					  },
					},
					target: '.no-open-orders',
					title: 'Open Orders'
				},
				{
					content: (
					  <React.Fragment>
						<h3>All set!</h3>
						<p>The joyride ends here but that's not all the help there is! If you aren't familiar with the basics of the stock market such as what the different
						types of order mean, the Help section is a MUST-READ!
						</p>
					  </React.Fragment>
					),
					placement: 'center',
					locale: { skip: <strong>Skip</strong> },
					target: 'body',
				},
			]
		};
	}

	// parent will update the stock prices or cash
	componentWillReceiveProps(nextProps: TradingTerminalProps) {
		this.setState(prevState => {
			return {
				currentPrice: nextProps.stockPricesMap[prevState.currentStockId],
				stockPricesMap: nextProps.stockPricesMap,
			};
		});
	}

	computeNetWorth(cash: number, stockPricesMap: NumNumMap, stocksOwnedMap: NumNumMap) {
		let worth = 0;
		for (let stockId in stockPricesMap) {
			worth += stockPricesMap[stockId] * stocksOwnedMap[stockId];
		}
		return cash + worth;
	}

	// child will affect the current stock id
	handleStockIdChange = (newStockId: number) => {
		this.setState(prevState => {
			return {
				currentStockId: newStockId,
				currentPrice: prevState.stockPricesMap[newStockId],
			}
		});
	};

	handleJoyrideCallback = (data: any) => {
		const { status, type } = data;
		if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
		  localStorage.setItem("first_time_dalal",  "yeah");
		}
	}

	render() {
		const { steps } = this.state;
		let run = false;
		if (!localStorage.getItem('first_time_dalal')) {
			run = true;
		}

		return (
			<Fragment>
				<ReactJoyride
					callback={this.handleJoyrideCallback}
					continuous
					run={run}
					scrollToFirstStep
					showProgress
					showSkipButton
					steps={steps}
					styles={{
						options: {
						zIndex: 10000,
						}
					}}
				/>
				<div className="row" id="top_bar">
					<div id="search-bar">
						<SearchBar
							stockBriefInfoMap={this.props.stockBriefInfoMap}
							stockPricesMap={this.state.stockPricesMap}
							handleStockIdCallback={this.handleStockIdChange}
							defaultStock={this.state.currentStockId} />
					</div>

					<TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userTotal={this.props.userTotal} connectionStatus={this.props.connectionStatus}/>
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
				<div id="trading-terminal" className="main-container ui stackable grid pusher">
					<div className="row">
						<div id="order-book-container" className="six wide column box">
							<OrderBook stockId={this.state.currentStockId} sessionMd={this.props.sessionMd} />
						</div>

						<div id="charts-container" className="ten wide column box">
							<Charts stockId={this.state.currentStockId} sessionMd={this.props.sessionMd} />
						</div>
					</div>
					<div className="row">
						<div id="place-order-box-container" className="six wide column box">
							<PlaceOrderBox
								stockId={this.state.currentStockId}
								currentPrice={this.state.currentPrice}
								sessionMd={this.props.sessionMd}
								isMarketOpen={this.props.isMarketOpen}
							  orderFeePercent={this.props.constantsMap['ORDER_FEE_PERCENT']} />
						</div>

						<div id="open-orders-container" className="ten wide column box">
							<OpenOrders sessionMd={this.props.sessionMd} stockBriefInfoMap={this.props.stockBriefInfoMap} />
						</div>
					</div>
					{this.props.disclaimerElement}
				</div>
			</Fragment>
		);
	}
}
