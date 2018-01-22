import * as React from "react";
import { Fragment } from "react";

import { Metadata } from "grpc-web-client";
import { DalalActionService, DalalStreamService } from "../../proto_build/DalalMessage_pb_service";
import { LoginRequest, LoginResponse } from "../../proto_build/actions/Login_pb";
import { User as User_pb } from "../../proto_build/models/User_pb";
import { Stock as Stock_pb } from "../../proto_build/models/Stock_pb";

import { Navbar } from "./common/Navbar";
import { Main } from "./Main";

interface AppState {
	isLoading: boolean

	sessionMd:  Metadata | null
	user: 		User_pb  | null

	stocksOwnedMap:  { [index:number]: number }   | null // stocks owned by user for a given stockid
	stockDetailsMap: { [index:number]: Stock_pb } | null // get stock detail for a given stockid
	constantsMap:    { [index:string]: number }   | null // various constants. Documentation found in server/actionservice/Login method

	marketIsOpenHackyNotif: 	string  | null
	marketIsClosedHackyNotif: 	string  | null
	isMarketOpen: 				boolean | null
}

export class App extends React.Component<{}, AppState> {
	constructor(props: AppState) {
		super(props);
		DalalActionService.serviceURL = "https://139.59.47.250";
		DalalStreamService.serviceURL = "https://139.59.47.250";

		this.state = {
			isLoading: false,
			sessionMd: null,
			user: null,
			stocksOwnedMap: null,
			stockDetailsMap: null,
			constantsMap: null,
			marketIsOpenHackyNotif: null,
			marketIsClosedHackyNotif: null,
			isMarketOpen: null,
		};
	}

	async componentDidMount() {
		this.setState({
			isLoading: true,
			sessionMd: null,
		});

		try {
			const resp = await this.login();

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
				isLoading: false,
				sessionMd: new Metadata({"sessionid": resp.getSessionId()}),
				user: resp.getUser()!,
				stocksOwnedMap: stocksOwnedMap,
				stockDetailsMap: stockDetailsMap,
				constantsMap: constantsMap,
				marketIsOpenHackyNotif: resp.getMarketIsOpenHackyNotif(),
				marketIsClosedHackyNotif: resp.getMarketIsClosedHackyNotif(),
				isMarketOpen: resp.getIsMarketOpen()
			});
		} catch(e) {
			this.setState({
				isLoading: false,
				sessionMd: null,
			});
		}
	}

	async login(): Promise<LoginResponse> {
		const loginRequest = new LoginRequest();
		loginRequest.setEmail("106115021@nitt.edu")
		loginRequest.setPassword("dalalkeliye")
	
		try {
			const resp = await DalalActionService.login(loginRequest);
			console.log(resp.getStatusCode(), resp.toObject());

			return resp
		}
		catch(e) {
			// error could be grpc error or Dalal error. Both handled in exception
			console.log("Error happened! ", e.statusCode, e.statusMessage);
			throw e;
		}
	}

	render() {
		if (this.state.isLoading) {
			// login request sent
			return <div>Loading m8</div>
		} else if (this.state.sessionMd != null) {
			// logged in
			return (
				<Fragment>
					<Navbar />
					<Main
						sessionMd={this.state.sessionMd!}
						user={this.state.user!}
						stocksOwnedMap={this.state.stocksOwnedMap!}
						stockDetailsMap={this.state.stockDetailsMap!}
						constantsMap={this.state.constantsMap!}
						marketIsOpenHackyNotif={this.state.marketIsOpenHackyNotif!}
						marketIsClosedHackyNotif={this.state.marketIsClosedHackyNotif!}
						isMarketOpen={this.state.isMarketOpen!} />
				</Fragment>
			)
		} else {
			// not logged in 
			return <div>Not logged in :)</div>
		}
	}
}