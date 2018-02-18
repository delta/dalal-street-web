import * as React from "react";

type StockBriefInfo = {
	id: number
	shortName: string
	fullName: string
	previousDayClose: number
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

	// just semantic things.
	componentDidUpdate() {
		$("#search-container").dropdown("refresh");
		$("#search-container div.text").html($("#search-container .item.selected").html())
	}

	handleStockChange = (stockId: string) => {
		const newStockId = Number(stockId);
		this.props.handleStockIdCallback(newStockId);
	};

	render() {
		const stockBriefInfoMap = this.props.stockBriefInfoMap;
		const prices = this.props.stockPricesMap;
		const options = [];
		for (const stockId in stockBriefInfoMap) {
			const stockInfo = stockBriefInfoMap[stockId];
			let priceClass = "search-bar-current-price ";
			let diffClass = "";
			let diff;
			if (prices[stockId] >= stockInfo.previousDayClose) {
				diffClass = "profit ";
			}
			else {
				diffClass = "loss ";
			}

			diff = Math.round(10000 * (prices[stockId] / stockInfo.previousDayClose - 1)) / 100 + "%";

			options.push(
				<div key={stockId} className="item" data-value={stockId}>
					{/* <i className={stockInfo.fullName.toLowerCase() + " icon"}></i> */}
					{stockInfo.shortName}

					<span className={priceClass + " " + diffClass}>
						{prices[stockId]}
						<span className={"search-bar-price-diff " + diffClass}>{diff}</span>
					</span>
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