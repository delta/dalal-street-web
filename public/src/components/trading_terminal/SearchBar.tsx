import * as React from "react";

type stockEntry = {
	stockId: number,
	stockName: string,
	stockFullName: string,
	currentPrice: number
}

export interface SearchBarProps {
	stockDetails: stockEntry[]
}

export class SearchBar extends React.Component<SearchBarProps, {}> {
	constructor(props: SearchBarProps) {
		super(props);
	}

	render() {
		const stockDetails = this.props.stockDetails;
		const options = stockDetails.map((stockDetail, index) => 
			<div key={stockDetail.stockId} className={index == 0 ? "item active" : "item"} data-value={stockDetail.stockName.toLowerCase()}><i className={stockDetail.stockName.toLowerCase() + " icon"}></i>{stockDetail.stockName}</div>
		);
		return (
			<div id="search-container" className="ui fluid search selection dropdown">
				<input name="stock" type="hidden" />
				<i className="dropdown icon"></i>
				<div className="default text">Select Stock</div>
				<div className="menu">
					{options}
				</div>
			</div>
		);
	}
}