import * as React from "react";
import { Fragment } from "react";

import { ohlcPointType,ohlcvPointType, intervalType } from "./types";
import { getUnit } from "./utils";

export interface CandlestickProps {
	stockId: number
	tabName: string
	data: ohlcvPointType[]
	interval: intervalType
}

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export class Candlestick extends React.Component<CandlestickProps, {}> {
	chartElem: any;
	constructor(props: CandlestickProps) {
		super(props);
	}

	ohlcvToOnlyOhlc(p: ohlcvPointType) {
		var ohlc : ohlcPointType = { o: p.o, h: p.h, l: p.l, c: p.c, t: p.t};
		
		return ohlc;
        
    }

	componentWillReceiveProps(nextProps: CandlestickProps) {
		// update the data and the chart, don't render the thing again pls
		this.chartElem.data.datasets = [{
			data: nextProps.data.map(this.ohlcvToOnlyOhlc),
			fractionalDigitsCount: 2,
		}];
		this.chartElem.options.scales.xAxes[0].time.unit = getUnit(this.props.interval);
		this.chartElem.update()
	}

	componentDidMount() {
		const cvs = document.getElementById("candles-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;
		const data = this.props.data.map(this.ohlcvToOnlyOhlc);

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
						time: {
							unit: getUnit(this.props.interval),
							tooltipFormat: "ddd MMM Do h:mm a",
						},
						ticks: {
							autoSkip: true,
							maxTicksLimit: 10,
							stepSize: 1,
							maxRotation: 0,
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