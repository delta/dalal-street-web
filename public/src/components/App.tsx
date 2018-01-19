import * as React from "react";
import { Navbar } from "./common/Navbar";
import { Main } from "./Main";

import {Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../../proto_build/DalalMessage_pb_service";
import {LoginRequest, LoginResponse} from "../../proto_build/actions/Login_pb";

interface AppState {
	isLoading: boolean
	sessionMd: Metadata | null
}

export class App extends React.Component<{}, AppState> {
	constructor(props: AppState) {
		super(props);
		DalalActionService.serviceURL = "https://139.59.85.232";
		DalalStreamService.serviceURL = "https://139.59.85.232";

		this.state = {
			isLoading: false,
			sessionMd: null,
		};
	}

	async componentDidMount() {
		this.setState({
			isLoading: true,
			sessionMd: null, // TODO: try to read sessionMd from localstorage first.
		});

		try {
			const sessionMd = await this.login();
			this.setState({
				isLoading: false,
				sessionMd: sessionMd
			});
		} catch(e) {
			this.setState({
				isLoading: false,
				sessionMd: null
			});
		}
	}

	async login(): Promise<Metadata> {
		const loginRequest = new LoginRequest();
		loginRequest.setEmail("106115021@nitt.edu")
		loginRequest.setPassword("dalalkeliye")
	
		try {
			const resp = await DalalActionService.login(loginRequest);
			console.log(resp.getStatusCode(), resp.toObject());
	
			return new Metadata({"sessionid": resp.getSessionId()})
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
				<div>
					<Navbar />
					<Main sessionMd={this.state.sessionMd!}/>
				</div>
			)
		} else {
			// not logged in 
			return <div>Not logged in :)</div>
		}
	}
}