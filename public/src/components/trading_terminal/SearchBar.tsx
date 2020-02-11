import * as React from "react";

type StockBriefInfo = {
	id: number
	shortName: string
	fullName: string
	previousDayClose: number
	isBankrupt: boolean
	givesDividends: boolean
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

			const priceIncrease = prices[stockId] - stockInfo.previousDayClose;
			const percentageIncrease = (priceIncrease * 100 / (stockInfo.previousDayClose+1)).toFixed(2);
			diff = percentageIncrease + "%";
			if(stockInfo.isBankrupt){
				options.push(
					<div key={stockId} className="disabled item row" data-value={stockId}>
						<div className="companyName nine wide column">{stockInfo.fullName} <span className="bankrupt-text">Bankrupt</span> </div>
	
						<div className={priceClass + " three wide column " + diffClass}>
						 ₹ {prices[stockId]}
						</div>
						<div className={"three wide column search-bar-price-diff " + diffClass}>{diff}</div>
					</div>
				);
			}
			else if(stockInfo.givesDividends){
				options.push(
					<div key={stockId} className="item row" data-value={stockId}>
						<div className="companyName nine wide column" data-tooltip="Company is giving dividends now!" data-position="right center">{stockInfo.fullName} <span className="dividends-text">$</span> </div>
						<div className={priceClass + " three wide column " + diffClass}>
							₹ {prices[stockId]}
						</div>
						<div className={"three wide column search-bar-price-diff " + diffClass}>{diff}</div>

					</div>
				);
			}
			else{
				options.push(
					<div key={stockId} className="item row" data-value={stockId}>
						<div className="companyName nine wide column">{stockInfo.fullName}</div>
	
						<div className={priceClass + " three wide column " + diffClass}>
						₹ {prices[stockId]}
						</div>
						<div className={"three wide column search-bar-price-diff " + diffClass}>{diff}</div>
					</div>
				);
			}
		}
		return (
			<div id="search-container" className="ui fluid search selection dropdown">
				<input name="stock" type="hidden" value={this.props.defaultStock}/>
				<i className="dropdown icon"></i>
				<div className="default text">Select Stock</div>
				<div className="menu ui grid">
					{options}
				</div>
			</div>
		);
	}
}