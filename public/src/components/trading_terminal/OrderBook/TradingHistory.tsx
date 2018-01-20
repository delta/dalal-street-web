import * as React from "react";


export interface Trade {
	tradePrice: number,
	tradeQuantity: number,
	tradeTime: string
}

export interface TradingHistoryProps {
	stockId: number,
	latestTrades: Trade[],
}

export class TradingHistory extends React.Component<TradingHistoryProps, {}> {
	render() {
		let latestTrades = this.props.latestTrades;
		let history: any[] = [];
		if (latestTrades.length) {
			history.push(
				<tr>
					<td className="volume"><strong>{latestTrades[0].tradeQuantity}</strong></td>
					<td className="profit"><strong>{latestTrades[0].tradePrice} ⬈</strong></td>
					<td>{latestTrades[0].tradeTime}</td>
				</tr>
			);
		}

		let lastDiff: string = "profit";
		for(let i=1; i < latestTrades.length; i++) {
			let diff: string;
			if (latestTrades[i].tradePrice > latestTrades[i-1].tradePrice) {
				diff = "profit";
			}
			else if (latestTrades[i].tradePrice < latestTrades[i-1].tradePrice) {
				diff = "loss";
			}
			else {
				diff = lastDiff;
			}
			lastDiff = diff;

			history.push(
				<tr>
					<td className="volume"><strong>{latestTrades[i].tradeQuantity}</strong></td>
					<td className={diff}><strong>{latestTrades[i].tradePrice} {diff == "profit" ? "⬈" : "⬊"}</strong></td>
					<td>{latestTrades[i]}</td>
				</tr>
			);
		}

		return (
			<div className="ui tab inverted" data-tab="trading-history" id="trading-history">
				<table className="ui inverted table unstackable">
					<thead>
						<tr>
							<th>Volume</th>
							<th>Price</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{history}
					</tbody>
				</table>
			</div>
		);
	}
}