import * as React from "react";

type StockBriefInfo = {
	id: number
	shortName: string
	fullName: string
}

declare var $: any;

export interface SearchBarProps {
	defaultStock: number
	stockBriefInfoMap: { [index:number]: StockBriefInfo }
	stockPricesMap: { [index:number]: number }
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
		const stockBriefInfoMap = this.props.stockBriefInfoMap;
		const options = [];
		for (const stockId in stockBriefInfoMap) {
			const stockInfo = stockBriefInfoMap[stockId];
			options.push(
				<div key={stockId} className="item" data-value={stockId}>
					{/* <i className={stockInfo.fullName.toLowerCase() + " icon"}></i> */}
					{stockInfo.fullName}
				</div>
			);
		}
		return (
			<div id="search-container" className="ui fluid search selection dropdown">
				<input name="stock" type="hidden" value={this.props.defaultStock}/>
				<i className="dropdown icon"></i>
				<div className="default text">Select Stock</div>
				<div className="menu">
					{options}
				</div>
			</div>
		);
	}
}