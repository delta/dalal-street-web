import * as React from "react";

export interface TradingHistoryProps {
	stockId: number
}

export class TradingHistory extends React.Component<TradingHistoryProps, {}> {
	render() {
		const prices: number[] = [56,34,23,12,34,34,67,7,7,5,65,23,98];
		let history: any[] = [];
		history.push(
			<tr>
				<td className="volume"><strong>100</strong></td>
				<td className="profit"><strong>{prices[0]} ⬈</strong></td>
				<td>{new Date().toLocaleTimeString()}</td>
			</tr>
		);

		let lastDiff: string = "profit";
		for(let i=1; i < prices.length; i++) {
			let diff: string;
			if (prices[i] > prices[i-1]) {
				diff = "profit";
			}
			else if (prices[i] < prices[i-1]) {
				diff = "loss";
			}
			else {
				diff = lastDiff;
			}
			lastDiff = diff;

			history.push(
				<tr>
					<td className="volume"><strong>100</strong></td>
					<td className={diff}><strong>{prices[i]} {diff == "profit" ? "⬈" : "⬊"}</strong></td>
					<td>{new Date().toLocaleTimeString()}</td>
				</tr>
			);
		}

		return (
			<div>
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