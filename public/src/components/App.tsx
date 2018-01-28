import * as React from "react";
import { Fragment } from "react";

import { Metadata } from "grpc-web-client";
import { DalalActionService, DalalStreamService } from "../../proto_build/DalalMessage_pb_service";
import { LoginResponse } from "../../proto_build/actions/Login_pb";
import { GetPortfolioRequest, GetPortfolioResponse } from "../../proto_build/actions/GetPortfolio_pb"
import { User as User_pb } from "../../proto_build/models/User_pb";
import { Stock as Stock_pb } from "../../proto_build/models/Stock_pb";
import { Login } from "./login/Login"

import { Navbar } from "./common/Navbar";
import { Main } from "./Main";

interface AppState {
	isLoading: boolean
	isLoggedIn: boolean
	sessionMd: Metadata
	user: User_pb

	stocksOwnedMap: { [index: number]: number } // stocks owned by user for a given stockid
	stockDetailsMap: { [index: number]: Stock_pb } // get stock detail for a given stockid
	constantsMap: { [index: string]: number } // various constants. Documentation found in server/actionservice/Login method

	marketIsOpenHackyNotif: string
	marketIsClosedHackyNotif: string
	isMarketOpen: boolean
}

export class App extends React.Component<{}, AppState> {
	constructor(props: AppState) {
		super(props);

		DalalActionService.serviceURL = "https://139.59.47.250";
		DalalStreamService.serviceURL = "https://139.59.47.250";

		this.state = {
			isLoading: true,
			isLoggedIn: false,
			sessionMd: new Metadata(),
			user: new User_pb(),
			stocksOwnedMap: {},
			stockDetailsMap: {},
			constantsMap: {},
			marketIsClosedHackyNotif: "",
			marketIsOpenHackyNotif: "",
			isMarketOpen: false,
		};
	}

	async componentDidMount() {
		this.setState({
			isLoading: true,
			isLoggedIn: false,
		});

		try {
			const resp = await Login.getLoginResponseFromSession();
			this.parseLoginResponse(resp);
			this.setState({
				isLoading: false,
				isLoggedIn: true,
			});
		} catch (e) {
			this.setState({
				isLoading: false,
				isLoggedIn: false,
			});
		}
	}

	parseLoginResponse = (resp: LoginResponse) => {
		// map is weirdly constructed by grpc-web. Gotta convert it to regular map.
		const stocksOwnedMap: { [index: number]: number } = {};
		resp.getStocksOwnedMap().forEach((stocksOwned, stockId) => {
			stocksOwnedMap[stockId] = stocksOwned;
		});

		const stockDetailsMap: { [index: number]: Stock_pb } = {};
		resp.getStockListMap().forEach((stock, stockId) => {
			stockDetailsMap[stockId] = stock;
		});

		const constantsMap: { [index: string]: number } = {};
		resp.getConstantsMap().forEach((value, name) => {
			constantsMap[name] = value;
		});

		this.setState({
			isLoggedIn: true,
			sessionMd: new Metadata({ "sessionid": resp.getSessionId() }),
			user: resp.getUser()!,
			stocksOwnedMap: stocksOwnedMap,
			stockDetailsMap: stockDetailsMap,
			constantsMap: constantsMap,
			marketIsOpenHackyNotif: resp.getMarketIsOpenHackyNotif(),
			marketIsClosedHackyNotif: resp.getMarketIsClosedHackyNotif(),
			isMarketOpen: resp.getIsMarketOpen()
		});
	}

	render() {
		/*
			page loads:
				=> make bg req get loginresponse
				=> if loginresponse ok:
					render main
				=> else redirect to login, render login

				TODO: (@Ar-Sibi):
					document this stuff. Especially the forceUpdate.
					Also we're not using react router

					basically forceUpdate()ing whenever we change url. Have to do this because
					react-router doesn't give a good way to redirect programmatically. It's horrible.
					It's simply horrible.


					It's really horrible.
					- Parth.
		*/

		if (this.state.isLoggedIn) {
			const path = window.location.pathname;
			const shouldRedirect = ["", "/", "/login"].indexOf(path) != -1;
			if (shouldRedirect) {
				window.history.replaceState({}, "Dalal Street", "/trade");
				this.forceUpdate();
			}
			return (
				<Fragment>
					<Navbar handleUrlChange={this.forceUpdate.bind(this)} />
					<Main
						sessionMd={this.state.sessionMd!}
						user={this.state.user!}
						stocksOwnedMap={this.state.stocksOwnedMap!}
						stockDetailsMap={this.state.stockDetailsMap!}
						constantsMap={this.state.constantsMap!}
						marketIsOpenHackyNotif={this.state.marketIsOpenHackyNotif!}
						marketIsClosedHackyNotif={this.state.marketIsClosedHackyNotif!}
						isMarketOpen={this.state.isMarketOpen!}
					/>
				</Fragment>
			);
		}

		if (this.state.isLoading) {
			return <div>Loading screen</div>;
		}

		window.history.replaceState({}, "Dalal Street | Login", "/login");

		return <Login loginSuccessHandler={this.parseLoginResponse} />;
	}
}
