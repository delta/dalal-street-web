import * as React from "react";
import { Fragment } from "react";

import { ohlcPointType, intervalType, ohlcvPointType } from "./types";
import { getUnit } from "./utils";

export interface LineChartProps {
    stockId: number
    tabName: string
	data: ohlcvPointType[]
	interval: intervalType
}

export interface LineChartState {
    stockId: number
    data: ohlcvPointType[]
}

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export class LineChart extends React.Component<LineChartProps, LineChartState> {
    chartElem: any;
	constructor(props: LineChartProps) {
		super(props);
		this.state  = {
            stockId: props.stockId,
            data: props.data
		};
	}
  
    // convert ohlcPointType to { x: time, y: closePrice }
    ohlcvToOnlyC(p: ohlcvPointType) {
        const d = new Date();
        d.setTime(p.t);
		return p.c;
	}
	
	ohlcvToDate(p: ohlcvPointType){
        const d = new Date();
        d.setTime(p.t);
		return d.toLocaleTimeString('en-US', {hour12: false}).slice(0,5);
	}

	componentWillReceiveProps(nextProps: LineChartProps) {
		// update the data and the chart, don't render the thing again pls
		if (nextProps.data) {
			this.chartElem.data = {
				labels: nextProps.data.slice(-20).map(this.ohlcvToDate),
				datasets: [{
				data: nextProps.data.slice(-20).map(this.ohlcvToOnlyC),
				// fractionalDigitsCount: 2,
				borderColor: "#ffffff",
				pointBackgroundColor: "#ffffff",
			}]};
			// this.chartElem.options.scales.xAxes[0].time.unit = getUnit(this.props.interval);
			this.chartElem.update();
		}
    }

	componentDidMount() {
		const cvs = document.getElementById("line-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;

        const data = this.state.data;

		this.chartElem = new Chart(ctx, {
			type: 'line',
			data: {
				labels: data.slice(-10).map(this.ohlcvToDate) ,
				datasets: [{
					data: data.slice(-20).map(this.ohlcvToOnlyC),
					// fractionalDigitsCount: 2,
					borderColor: "#ffffff",
					pointBackgroundColor: "#ffffff",
				}]
			},
			options: {
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
				<canvas id="line-chart"></canvas>
			</div>
		);
	}
}