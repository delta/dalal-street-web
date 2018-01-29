import * as React from "react";
import * as $ from 'jquery';
import { MouseEvent } from "react";

export interface NavProps {
	handleUrlChange: () => void
}

export class Navbar extends React.Component<NavProps, {}> {
	initialLink: string = window.location.pathname;
	
	handleClick(event: any, newPath: string) {
		$("#navbar a").removeClass("active");
		event.target.className += " active";
		//Setting new url
		window.history.pushState({}, "Dalal Street", newPath);
		//Rerender App and thereby changing appropriate component in Main
		this.props.handleUrlChange();
	}
	
	render(){
		//If it was initially rendered with some path that should be set to active
        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		<a className={"item " + (this.initialLink == "/trade" ? "active" : "")} onClick={e => this.handleClick(e, "/trade")}>
			<i className="rupee icon"></i>
			Trade
		</a>
		<a className={"item " + (this.initialLink == "/portfolio" ? "active" : "")} onClick={e => this.handleClick(e, "/portfolio")}>
			<i className="book icon"></i>
			Portfolio
		</a>
		<a className={"item " + (this.initialLink == "/market" ? "active" : "")} onClick={e => this.handleClick(e, "/market")}>
			<i className="line chart icon"></i>
			Market
		</a>
		<a className={"item " + (this.initialLink == "/news" ? "active" : "")} onClick={e => this.handleClick(e, "/news")}>
			<i className="newspaper icon"></i>
			News
		</a>
		<a className={"item " + (this.initialLink == "/leaderboard" ? "active" : "")} onClick={e => this.handleClick(e, "/leaderboard")}>
			<i className="trophy icon"></i>
			Leaderboard
		</a>
		<a className={"item " + (this.initialLink == "/companies" ? "active" : "")} onClick={e => this.handleClick(e, "/companies")}>
			<i className="suitcase icon"></i>
			Companies
		</a>
		
		<a className={"item " + (this.initialLink == "/help" ? "active" : "")} onClick={e => this.handleClick(e, "/help")}>
			<i className="help circle icon"></i>
			Help
		</a>
		
		<a className={"item " + (this.initialLink == "/logout" ? "active" : "")} onClick={e => this.handleClick(e, "/logout")}>
			<i className="window close icon"></i>
			Logout
		</a>
	</div>)  
    };
}