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

function formatTime(time: string) {
	const d = new Date(time);
	return d.toLocaleTimeString();
}

export class TradingHistory extends React.Component<TradingHistoryProps, {}> {
	render() {
		let latestTrades = this.props.latestTrades;
		let history: any[] = [];

		let lastDiff: string = "profit";
		for(let i=0; i < latestTrades.length - 1; i++) {
			let diff: string;
			if (latestTrades[i].tradePrice > latestTrades[i+1].tradePrice) {
				diff = "profit";
			}
			else if (latestTrades[i].tradePrice < latestTrades[i+1].tradePrice) {
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
					<td>{formatTime(latestTrades[i].tradeTime)}</td>
				</tr>
			);
		}

		if (latestTrades.length - 1 >= 0) {
			history.push(
				<tr>
					<td className="volume"><strong>{latestTrades[latestTrades.length-1].tradeQuantity}</strong></td>
					<td className="profit"><strong>{latestTrades[latestTrades.length-1].tradePrice} ⬈</strong></td>
					<td>{formatTime(latestTrades[latestTrades.length-1].tradeTime)}</td>
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
							<th>Time</th>
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