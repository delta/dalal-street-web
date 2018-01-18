import * as React from "react";
import { Fragment } from "react";

import { intervalType, ohlcPointType } from "./types";
import { Candlestick } from "./candlestick";
import { LineChart } from "./lineChart";

declare var Chart: any; // Chart will be exposed globally by the ChartJS script included in index.html
declare var moment: any; // moment will be exposed globally by the moment.js script included in index.html
declare var $: any; // $ will be exposed globally by jQuery

export interface ChartsProps {
	stockId: number
}

type chartType = "candlestick" | "line";

interface ChartsState {
	stockId: number
	chartType: chartType
	interval: intervalType
	data: ohlcPointType[]
}

function randomNumber(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function getRandomBarNoTime(lastClose: number) : ohlcPointType {
	var open = randomNumber(lastClose * .95, lastClose * 1.05);
	var close = randomNumber(open * .95, open * 1.05);
	var high = randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
	var low = randomNumber(Math.min(open, close) * .9, Math.min(open, close));

	return {
		o: open,
		h: high,
		l: low,
		c: close,
		t: NaN,
	};
}

function randomBar(date: Date, lastClose: number) {
	var bar = getRandomBarNoTime(lastClose);
	bar.t = date.valueOf();
	return bar;
}

function getRandomData(_date: string, count: number) {
	var dateFormat = 'MMMM DD YYYY';
	var date = moment(_date, dateFormat);
	var data = [randomBar(date, 30)];
	while (data.length < count) {
		date = date.clone().add(1, 'd');
		if (date.isoWeekday() <= 5) {
			data.push(randomBar(date, data[data.length - 1].c));
		}
	}
	return data;
}

export class Charts extends React.Component<ChartsProps, ChartsState> {
	constructor(props: ChartsProps) {
		super(props);
		this.state  = {
			stockId: props.stockId,
			chartType: "candlestick",
			interval: "1min",
			data: getRandomData("April 01 2017", 35),
		};

		this.onIntervalChange = this.onIntervalChange.bind(this);
		this.onChartTabChange = this.onChartTabChange.bind(this);
	}

	componentDidMount() {
		const that = this;
		$('#chart-interval-dropdown').dropdown({
			onChange: that.onIntervalChange,
		});
		$('#charts-menu-container .item').tab({
			onVisible: this.onChartTabChange,
		});

		if (this.state.chartType == "candlestick") {
			$("#candles-chart-container").addClass("active");
		} else {
			$("#line-chart-container").addClass("active");
		}
	}

	onIntervalChange(value: intervalType) {
		this.setState({...this.state, interval: value, data: getRandomData("April 01 2017", 35)});
	}

	onChartTabChange(tabPath: string) {
		const chartType = tabPath.indexOf("candlestick") != -1 ? "candlestick" : "line";
		this.setState({...this.state, chartType: chartType});
	}

	render() {
		return (
			<Fragment>
			<div id="charts-menu-container" className="ui pointing secondary menu">
				<a className="item active" data-tab="candles-chart-container">Candlesticks</a>
				<a className="item" data-tab="line-chart-container">Line</a>
				<span className="item">
					<div id="chart-interval-dropdown" className="ui inline dropdown">
						<div className="text">1min</div>
						<i className="dropdown icon"></i>
						<div className="menu">
							<div className="item">1min</div>
							<div className="item">5min</div>
							<div className="item">15min</div>
							<div className="item">30min</div>
							<div className="item">60min</div>
							<div className="item">1day</div>
						</div>
					</div>
				</span>
				<h3 className="panel-header right item">Price Chart</h3>
			</div>
			<Candlestick stockId={this.props.stockId} data={this.state.data} tabName={"candles-chart-container"} />
			<LineChart stockId={this.props.stockId} data={this.state.data} tabName={"line-chart-container"} />
			</Fragment>
		);
	}
}