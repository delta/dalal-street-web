import * as React from "react";

type stockEntry = {
	stockId: number,
	stockName: string,
	stockFullName: string,
	currentPrice: number
}

declare var $: any;

export interface SearchBarProps {
	defaultStock: number,
	stockDetails: stockEntry[],
	handleStockIdCallback: (newStockId: number) => void
}

export class SearchBar extends React.Component<SearchBarProps, {}> {
	constructor(props: SearchBarProps) {
		super(props);
	}

	componentDidMount() {
		$("#search-container").dropdown({
			onChange: this.handleStockChange,
		});
	}

	handleStockChange = (stockId: string) => {
		const newStockId = Number(stockId);
		this.props.handleStockIdCallback(newStockId);
	};

	render() {
		const stockDetails = this.props.stockDetails;
		const options = stockDetails.map((stockDetail) => 
			<div key={stockDetail.stockId} className="item" data-value={stockDetail.stockId}><i className={stockDetail.stockName.toLowerCase() + " icon"}></i>{stockDetail.stockName}</div>
		);
		return (
			<div id="search-bar" className="left floated">
				<div id="search-container" className="ui fluid search selection dropdown">
					<input name="stock" type="hidden" value={this.props.defaultStock}/>
					<i className="dropdown icon"></i>
					<div className="default text">Select Stock</div>
					<div className="menu">
						{options}
					</div>
				</div>
			</div>
		);
	}
}