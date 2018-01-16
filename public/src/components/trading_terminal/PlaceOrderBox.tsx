import * as React from "react";

function isPositiveInteger(x: number): boolean {
	return (!isNaN(x) && x % 1 === 0 && x > 0);
}

export interface PlaceOrderBoxProps{
	stockId: number,
	currentPrice: number
}

export class PlaceOrderBox extends React.Component<PlaceOrderBoxProps, {}> {
	handleOrder(event: any, orderType: string, orderAction: string) {
		let stockInputField: HTMLInputElement = document.getElementById(orderType+"-"+orderAction+"-count") as HTMLInputElement;
		let priceInputField: HTMLInputElement = document.getElementById(orderType+"-"+orderAction+"-price") as HTMLInputElement;
		let stockCount: number = Number(stockInputField.value);
		let triggerPrice: number = Number(orderType == "market" ? "-1" : priceInputField.value);
			
		if (!(isPositiveInteger(stockCount) && (orderType == "market" || isPositiveInteger(triggerPrice)))) {
			alert("Please enter a positive integer");
			return;
		}

		console.log("Received",orderType,orderAction,"order with stockCount =", stockCount,"triggerPrice =", triggerPrice);

		stockInputField.value = "";
		if (priceInputField) {
			priceInputField.value = "";
		}
	}

	predictCost(event: any, orderType: string, orderAction: string) {
		let stockInputField: HTMLInputElement = document.getElementById(orderType+"-"+orderAction+"-count") as HTMLInputElement;
		let stockCount: number = Number(stockInputField.value);
		let expectedCostField: HTMLElement = document.getElementById(orderType+"-"+orderAction+"-estimation") as HTMLElement;
		if (isNaN(stockCount) || stockCount <= 0) {
			expectedCostField.innerHTML = "0.00";
			return;
		}
		if (orderType == "market") {
			expectedCostField.innerHTML = String(this.props.currentPrice * stockCount) + ".00";	
		}
		else {
			let priceInputField: HTMLInputElement = document.getElementById(orderType+"-"+orderAction+"-price") as HTMLInputElement;
			let triggerPrice: number = Number(priceInputField.value);
			if (isNaN(triggerPrice) || triggerPrice <= 0) {
				expectedCostField.innerHTML = "0.00";
				return;
			}
			expectedCostField.innerHTML = String(triggerPrice * stockCount) + ".00";
		}
	}

    render() {
        return (
			<div>
				<div className="ui pointing secondary menu">
					<a className="item active" data-tab="market">Market</a>
					<a className="item" data-tab="limit">Limit</a>
					<a className="item" data-tab="stoploss">Stoploss</a>
					<h3 className="panel-header item right">Place Order</h3>
				</div>
				<div className="ui tab inverted active" data-tab="market">
					<div className="ui top attached tabular menu inverted">
						<a className="active item green" data-tab="market/buy">BUY</a>
						<a className="item red" data-tab="market/sell">SELL</a>
					</div>
					<div className="ui bottom attached active tab segment inverted" data-tab="market/buy">
						<div className="ui input">
							<input id="market-buy-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"market","buy")}/>
						</div>
						<button className="ui inverted green button" onClick={e => this.handleOrder(e,"market","buy")}>BUY</button>
						
						<div className="expected-cost">
							You will gain approximately ₹ <span id="market-buy-estimation">0.00</span>
						</div>
					</div>
					<div className="ui bottom attached tab segment inverted" data-tab="market/sell">
						<div className="ui input">
							<input id="market-sell-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"market","sell")}/>
						</div>
						<button className="ui inverted red button" onClick={e => this.handleOrder(e,"market","sell")}>SELL</button>
						
						<div className="expected-cost">
							You will lose approximately ₹ <span id="market-sell-estimation">0.00</span>
						</div>
					</div>
				</div>
				<div className="ui tab inverted" data-tab="limit">
					<div className="ui top attached tabular menu inverted">
						<a className="item active green" data-tab="limit/buy">BUY</a>
						<a className="item red" data-tab="limit/sell">SELL</a>
					</div>
					<div className="ui bottom attached tab segment active inverted" data-tab="limit/buy">
						<div className="ui input">
							<input id="limit-buy-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"limit","buy")}/>
						</div>
						<div className="ui input">
							<input id="limit-buy-price" placeholder="Limit Price" type="text" onChange={e => this.predictCost(e,"limit","buy")}/>
						</div>
						<button className="ui inverted green button" onClick={e => this.handleOrder(e,"limit","buy")}>BUY</button>
						
						<div className="expected-cost">
							You will gain approximately ₹ <span id="limit-buy-estimation">0.00</span>
						</div>
					</div>
					<div className="ui bottom attached tab segment inverted" data-tab="limit/sell">
						<div className="ui input">
							<input id="limit-sell-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"limit","sell")}/>
						</div>
						<div className="ui input">
							<input id="limit-sell-price" placeholder="Limit Price" type="text" onChange={e => this.predictCost(e,"limit","sell")}/>
						</div>
						<button className="ui inverted red button" onClick={e => this.handleOrder(e,"limit","sell")}>SELL</button>
						
						<div className="expected-cost">
							You will lose approximately ₹ <span id="limit-sell-estimation">0.00</span>
						</div>
					</div>
				</div>
				<div className="ui tab inverted" data-tab="stoploss">
					<div className="ui top attached tabular menu inverted">
						<a className="item active green" data-tab="stoploss/buy">BUY</a>
						<a className="item red" data-tab="stoploss/sell">SELL</a>
					</div>
					<div className="ui bottom attached tab segment active inverted" data-tab="stoploss/buy">
						<div className="ui input">
							<input id="stoploss-buy-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"stoploss","buy")}/>
						</div>
						<div className="ui input">
							<input id="stoploss-buy-price" placeholder="Stoploss Price" type="text" onChange={e => this.predictCost(e,"stoploss","buy")}/>
						</div>
						<button className="ui inverted green button" onClick={e => this.handleOrder(e,"stoploss","buy")}>BUY</button>
						
						<div className="expected-cost">
							You will gain approximately ₹ <span id="stoploss-buy-estimation">0.00</span>
						</div>
					</div>
					<div className="ui bottom attached tab segment inverted" data-tab="stoploss/sell">
						<div className="ui input">
							<input id="stoploss-sell-count" placeholder="Number of stocks" type="text" onChange={e => this.predictCost(e,"stoploss","sell")}/>
						</div>
						<div className="ui input">
							<input id="stoploss-sell-price" placeholder="Stoploss Price" type="text" onChange={e => this.predictCost(e,"stoploss","sell")}/>
						</div>
						<button className="ui inverted red button" onClick={e => this.handleOrder(e,"stoploss","sell")}>SELL</button>
						
						<div className="expected-cost">
							You will lose approximately ₹ <span id="stoploss-sell-estimation">0.00</span>
						</div>
					</div>
				</div>
			</div>
        );   
    }
}