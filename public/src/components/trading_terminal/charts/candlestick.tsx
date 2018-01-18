import * as React from "react";
import { Fragment } from "react";

import { ohlcPointType } from "./types";

export interface CandlestickProps {
	stockId: number
	tabName: string
	data: ohlcPointType[]
}

export interface CandlestickState {
	stockId: number
	data: ohlcPointType[]
}

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export class Candlestick extends React.Component<CandlestickProps, CandlestickState> {
	chartElem: any;
	constructor(props: CandlestickProps) {
		super(props);
		this.state = {
			stockId: props.stockId,
			data: props.data
		};
	}

	componentWillReceiveProps(nextProps: CandlestickProps) {
		// update the data and the chart, don't render the thing again pls
		this.chartElem.data.datasets = [{
			data: nextProps.data,
			fractionalDigitsCount: 2,
		}];
		this.chartElem.update()
	}

	componentDidMount() {
		const cvs = document.getElementById("candles-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;
		const data = this.state.data;

		this.chartElem = new Chart(ctx, {
			type: 'candlestick',
			data: {
				datasets: [{
					data: data,
					fractionalDigitsCount: 2,
				}]
			},
			options: {
				scales: {
					xAxes: [{
						type: 'time',
						ticks: {
							autoSkip: true,
							maxTicksLimit: 10
						}
					}]
				},
				legend: {
					display: false,
				},
				tooltips: {
					position: 'nearest',
					mode: 'index',
				},
			},
		});
	}

	render() {
		return (
			<div className="ui tab inverted" data-tab={this.props.tabName} id={this.props.tabName}>
				<canvas id="candles-chart"></canvas>
			</div>
		);
	}
}