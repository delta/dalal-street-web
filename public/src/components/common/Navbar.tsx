import * as React from "react";
import { MouseEvent } from "react";
import { Referral } from "../referralcode/ReferralCode"
import { Metadata } from "grpc-web-client";

export interface NavProps {
  handleUrlChange: () => void;
  isPhoneVerified: boolean;
  email: string;
  sessionMd: Metadata;
}

declare var $: any;

export class Navbar extends React.Component<NavProps, {}> {
	
	handleClick(event: any, newPath: string) {
		$("#navbar a").removeClass("active");
		event.currentTarget.className += " active";
		//Setting new url
		window.history.pushState({}, "Dalal Street", newPath);
		//Rerender App and thereby changing appropriate component in Main
		this.props.handleUrlChange();
		
	}

	render(){
		let currentLink: string = window.location.pathname;
		//If it was initially rendered with some path that should be set to active
        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		{	this.props.isPhoneVerified ==false && <div>
		<a className={"item " + (currentLink == "/registerphone" ? "active" : "")}  onClick={e => this.handleClick(e, "/registerphone")}>
			<i className="mobile icon"></i>
			PhoneVerify
	    </a>
		<a className={"item " + (currentLink == "/logout" ? "active" : "")} onClick={e => this.handleClick(e, "/logout")}>
		<i className="window close icon"></i>
		Logout
	</a>
	</div>
		}
		{this.props.isPhoneVerified  && <div>
		<a className={"item " + (currentLink == "/trade" ? "active" : "")}  onClick={e => this.handleClick(e, "/trade")}>
			<i className="rupee icon"></i>
			Trade
		</a>

		<a className={"item " + (currentLink == "/portfolio" ? "active" : "")} onClick={e => this.handleClick(e, "/portfolio")}>
			<i className="book icon"></i>
			Portfolio
		</a>

		<a className={"item " + (currentLink == "/market" ? "active" : "")} onClick={e => this.handleClick(e, "/market")}>
			<i className="line chart icon"></i>
			Exchange
		</a>

		<a className={"item " + (currentLink == "/mortgage" ? "active" : "")} onClick={e => this.handleClick(e, "/mortgage")}>
			<i className="university icon"></i>
			Mortgage
		</a>

		<a className={"item " + (currentLink == "/companies" ? "active" : "")} onClick={e => this.handleClick(e, "/companies")}>
			<i className="suitcase icon"></i>
			Companies
		</a>

		<a className={"item " + (currentLink == "/news" ? "active" : "")} onClick={e => this.handleClick(e, "/news")}>
			<i className="newspaper icon"></i>
			News
		</a>
		<a className={"item " + (currentLink == "/leaderboard" ? "active" : "")} onClick={e => this.handleClick(e, "/leaderboard")}>
			<i className="trophy icon"></i>
			Leaderboard
		</a>
		<a className={"item " + (currentLink == "/dailyChallenges" ? "active" : "")} onClick={e => this.handleClick(e, "/dailyChallenges")}>
			<i className="calendar check icon"></i>
			Daily Challenges
		</a>
		
		
		<a className={"item " + (currentLink == "/help" ? "active" : "")} onClick={e => this.handleClick(e, "/help")}>
			<i className="help circle icon"></i>
			Help
		</a>
		
		{/* <a className="item" href="https://forum.pragyan.org/c/dalal-street" target="_blank">
			<i className="users icon"></i>
			Forum
		</a> */}

		<Referral email={this.props.email} sessionMd={this.props.sessionMd!}/>

		<a className={"item " + (currentLink == "/logout" ? "active" : "")} onClick={e => this.handleClick(e, "/logout")}>
			<i className="window close icon"></i>
			Logout
		</a>
		</div>
	}
	</div>)  
    };
}
