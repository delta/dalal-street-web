import * as React from "react";

export interface NavProps {}

export class Navbar extends React.Component<NavProps, {}> {
    render(){

        return(
        <div id="navbar" className="ui sidebar inverted labeled icon left vertical menu uncover visible">
		<a className="item" href="/trade">
			<i className="rupee icon"></i>
			Trade
		</a>
		<a className="item active">
			<i className="book icon"></i>
			Portfolio
		</a>
		<a className="item">
			<i className="line chart icon"></i>
			Market
		</a>
		<a className="item">
			<i className="newspaper icon"></i>
			News
		</a>
		<a className="item">
			<i className="trophy icon"></i>
			Leaderboard
		</a>
		<a className="item">
			<i className="suitcase icon"></i>
			Companies
		</a>
		
		<a className="item">
			<i className="help circle icon"></i>
			Help
		</a>
		
		<a className="item">
			<i className="window close icon"></i>
			Logout
		</a>
	</div>)  
    };
}