import * as React from "react";
import { MouseEvent } from "react";
import { Referral } from "../referralcode/ReferralCode"
import { Metadata } from "grpc-web-client";
import { GetDailyChallengeConfigRequest } from "../../../proto_build/actions/GetDailyChallengeConfig_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";


export interface NavProps {
  handleUrlChange: () => void;
  isPhoneVerified: boolean;
  email: string;
  sessionMd: Metadata;
  isDailyChallengeOpen:boolean;
}
export interface NavState{
	market_day: number,
	notif: string
}

declare var $: any;

export class Navbar extends React.Component<NavProps, NavState> {
	
	constructor(props: NavProps) {
		super(props);
	
		this.state={
		  market_day: 0,
		  notif:""
		}
	
	  }

	handleClick(event: any, newPath: string) {
		$("#navbar a").removeClass("active");
		event.currentTarget.className += " active";
		//Setting new url
		window.history.pushState({}, "Dalal Street", newPath);
		//Rerender App and thereby changing appropriate component in Main
		this.props.handleUrlChange();
		if(event.currentTarget.dataset.value=="dailyChallenge"){
			localStorage.setItem("market-day",this.state.market_day.toString());
			localStorage.setItem("opened","true");
			this.setState({
				notif: ""
			})
		}
		
	}
	componentDidMount = async()=>{
	const sessionMd = this.props.sessionMd;
	const GetDailyChallengeConfigReq = new GetDailyChallengeConfigRequest();
	try{
		// Daily challenge notification
		const resp = await DalalActionService.getDailyChallengeConfig(GetDailyChallengeConfigReq,sessionMd);
		const market_day = resp.getMarketDay();
		this.setState({
			market_day: market_day
		})
		if (localStorage.getItem("hasCodeRunBefore") === null) {
			localStorage.setItem("market-day",market_day.toString())
			if(this.props.isDailyChallengeOpen){
				localStorage.setItem("opened","false");
				this.setState({
					notif: "new-daily"
				})
			}
			localStorage.setItem("hasCodeRunBefore", "true");
		}
		if(this.props.isDailyChallengeOpen){
			if((localStorage.getItem("market-day")!=market_day.toString())||(localStorage.getItem("opened")=="false")){
				localStorage.setItem("market-day",market_day.toString());
				localStorage.setItem("opened","false");
				this.setState({
					notif: "new-daily"
				})
			}
		}

	} catch(e){
		console.log(e);
	}
    
	}
	componentDidUpdate= async(prevProps:NavProps) =>{
		
			if(prevProps.isDailyChallengeOpen!=this.props.isDailyChallengeOpen){
				const sessionMd = this.props.sessionMd;
				const GetDailyChallengeConfigReq = new GetDailyChallengeConfigRequest();
					try{
						const resp = await DalalActionService.getDailyChallengeConfig(GetDailyChallengeConfigReq,sessionMd);
						const market_day = resp.getMarketDay();
						this.setState({
							market_day: market_day
						})
						if(localStorage.getItem("market-day")!=market_day.toString()){
							localStorage.setItem("market-day",market_day.toString());
							localStorage.setItem("opened","false");
							this.setState({
								notif: "new-daily"
							})
						}
			
					} catch(e){
						console.log(e);
			
					}
				}
		
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
		<a data-value="dailyChallenge" className={"item " + (currentLink == "/dailyChallenges" ? "active " : " ") + this.state.notif } id="dailyChallenge" onClick={e => this.handleClick(e, "/dailyChallenges")}>
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

		<a className={"item " + (currentLink == "/logout" ? "active" : "")}  onClick={e => this.handleClick(e, "/logout")}>
			<i className="window close icon"></i>
			Logout
		</a>
		</div>
	}
	</div>)  
    };
}
