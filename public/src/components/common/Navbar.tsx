import * as React from "react";
import { Link } from "react-router-dom";

export interface NavProps {}

export class Navbar extends React.Component<NavProps, {}> {
    render(){

        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		<Link to="/trade" className="item active">
			<i className="rupee icon"></i>
			Trade
		</Link>
		<Link to="/portfolio" className="item">
			<i className="book icon"></i>
			Portfolio
		</Link>
		<Link to="/market" className="item">
			<i className="line chart icon"></i>
			Market
		</Link>
		<Link to="/news" className="item">
			<i className="newspaper icon"></i>
			News
		</Link>
		<Link to="/leaderboard" className="item">
			<i className="trophy icon"></i>
			Leaderboard
		</Link>
		<Link to="/companies" className="item">
			<i className="suitcase icon"></i>
			Companies
		</Link>
		
		<Link to="/help" className="item">
			<i className="help circle icon"></i>
			Help
		</Link>
		
		<Link to="/logout" className="item">
			<i className="window close icon"></i>
			Logout
		</Link>
	</div>)  
    };
}