import * as React from "react";
import { Fragment } from "react";

import { ohlcPointType,ohlcvPointType, intervalType } from "./types";
import { getUnit } from "./utils";

export interface VolumeChartProps {
    stockId: number
    tabName: string
	data: ohlcPointType[]
	interval: intervalType
}

export interface VolumeChartState {
    stockId: number
    data: ohlcPointType[]
}

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export class VolumeChart extends React.Component<VolumeChartProps, VolumeChartState> {
    chartElem: any;
	constructor(props: VolumeChartProps) {
		super(props);
		this.state  = {
            stockId: props.stockId,
            data: props.data
		};
	}

    // convert ohlcPointType to { x: time, y: closePrice }
    ohlcToOnlyV(p: ohlcvPointType) {
        return p.v;
	}
	
	ohlcvToDate(p: ohlcvPointType){
        const d = new Date();
        d.setTime(p.t);
		return d.toLocaleTimeString('en-US', {hour12: false}).slice(0,5);
	}

	componentWillReceiveProps(nextProps: VolumeChartProps) {
		// update the data and the chart, don't render the thing again pls
		if (nextProps.data) {
			this.chartElem.data = {
				labels: nextProps.data.slice(-20).map(this.ohlcvToDate),
				datasets: [{
				backgroundColor: "#c45850",
				data: nextProps.data.map(this.ohlcToOnlyV).slice(-20),
				fractionalDigitsCount: 2,
			}]
		};
			this.chartElem.update();
		}
    }

	componentDidMount() {
		const cvs = document.getElementById("volume-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;

        const data = this.state.data;

		this.chartElem = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: data.slice(-20).map(this.ohlcvToDate),
				datasets: [{
					backgroundColor: "#c45850",
					data: data.slice(-20).map(this.ohlcToOnlyV),
					fractionalDigitsCount: 2,
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
				<canvas id="volume-chart"></canvas>
			</div>
		);
	}
}