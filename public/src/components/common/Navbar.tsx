import * as React from "react";
import { MouseEvent } from "react";

export interface NavProps {
	handleUrlChange: () => void
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
		let initialLink: string = window.location.pathname;
		//If it was initially rendered with some path that should be set to active
        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		<a className={"item " + (initialLink == "/trade" ? "active" : "")} onClick={e => this.handleClick(e, "/trade")}>
			<i className="rupee icon"></i>
			Trade
		</a>
		<a className={"item " + (initialLink == "/portfolio" ? "active" : "")} onClick={e => this.handleClick(e, "/portfolio")}>
			<i className="book icon"></i>
			Portfolio
		</a>
		<a className={"item " + (initialLink == "/market" ? "active" : "")} onClick={e => this.handleClick(e, "/market")}>
			<i className="line chart icon"></i>
			Market
		</a>
		<a className={"item " + (initialLink == "/news" ? "active" : "")} onClick={e => this.handleClick(e, "/news")}>
			<i className="newspaper icon"></i>
			News
		</a>
		<a className={"item " + (initialLink == "/leaderboard" ? "active" : "")} onClick={e => this.handleClick(e, "/leaderboard")}>
			<i className="trophy icon"></i>
			Leaderboard
		</a>
		<a className={"item " + (initialLink == "/companies" ? "active" : "")} onClick={e => this.handleClick(e, "/companies")}>
			<i className="suitcase icon"></i>
			Companies
		</a>
		
		<a className={"item " + (initialLink == "/help" ? "active" : "")} onClick={e => this.handleClick(e, "/help")}>
			<i className="help circle icon"></i>
			Help
		</a>
		
		<a className={"item " + (initialLink == "/logout" ? "active" : "")} onClick={e => this.handleClick(e, "/logout")}>
			<i className="window close icon"></i>
			Logout
		</a>
	</div>)  
    };
}