import * as React from "react";
import * as $ from 'jquery';
import { Link } from "react-router-dom";

export interface NavProps {}

export class Navbar extends React.Component<NavProps, {}> {
	
	handleClick(event: any) {
		$("#navbar a").removeClass("active");
		event.target.className += " active";
	}
	
	render(){

        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		<Link to="/trade" className="item active" onClick={e => this.handleClick(e)}>
			<i className="rupee icon"></i>
			Trade
		</Link>
		<Link to="/portfolio" className="item" onClick={e => this.handleClick(e)}>
			<i className="book icon"></i>
			Portfolio
		</Link>
		<Link to="/market" className="item" onClick={e => this.handleClick(e)}>
			<i className="line chart icon"></i>
			Market
		</Link>
		<Link to="/news" className="item" onClick={e => this.handleClick(e)}>
			<i className="newspaper icon"></i>
			News
		</Link>
		<Link to="/leaderboard" className="item" onClick={e => this.handleClick(e)}>
			<i className="trophy icon"></i>
			Leaderboard
		</Link>
		<Link to="/companies" className="item" onClick={e => this.handleClick(e)}>
			<i className="suitcase icon"></i>
			Companies
		</Link>
		
		<Link to="/help" className="item" onClick={e => this.handleClick(e)}>
			<i className="help circle icon"></i>
			Help
		</Link>
		
		<Link to="/logout" className="item" onClick={e => this.handleClick(e)}>
			<i className="window close icon"></i>
			Logout
		</Link>
	</div>)  
    };
}