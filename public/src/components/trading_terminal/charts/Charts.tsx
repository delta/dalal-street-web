import * as React from "react";
import { Fragment } from "react";
import { intervalType, ohlcPointType } from "./types";
import { Candlestick } from "./candlestick";
import { LineChart } from "./lineChart";
import { GetStockHistoryRequest, GetStockHistoryResponse, StockHistoryResolution} from "../../../../proto_build/actions/GetStockHistory_pb";
import { Metadata } from "grpc-web-client";
import { DalalActionService, DalalStreamService} from "../../../../proto_build/DalalMessage_pb_service";
import { StockHistoryUpdate } from "../../../../proto_build/datastreams/StockHistory_pb"
import { subscribe, unsubscribe } from "../../../streamsutil";
import { DataStreamType, SubscriptionId, SubscribeRequest } from "../../../../proto_build/datastreams/Subscribe_pb";
import * as models_StockHistory_pb from "../../../../proto_build/models/StockHistory_pb";

declare var Chart: any; // Chart will be exposed globally by the ChartJS script included in index.html
declare var moment: any; // moment will be exposed globally by the moment.js script included in index.html
declare var $: any; // $ will be exposed globally by jQuery

export interface ChartsProps {
	stockId: number,
	sessionMd: Metadata,
}

export interface intervalData {
	"1min" : ohlcPointType[],
	"5min" : ohlcPointType[],
	"15min" : ohlcPointType[],
	"30min": ohlcPointType[],
	"60min" : ohlcPointType[],
	"1d": ohlcPointType[],
}

type chartType = "candlestick" | "line";

interface ChartsState {
	isLoading: boolean
	stockId: number
	chartType: chartType
	interval: intervalType
	data: ohlcPointType[]
	subscriptionId: SubscriptionId
	textDesc: string
}

const intervalTypeToResolutionProto: { [index:string]: number} = {
	"1min": 0,
	"5min": 1,
	"15min": 2,
	"30min": 3,
	"60min": 4,
	"1d": 5,
};

const intervalToIntervalType: { [index:number]: intervalType} = {
	1: "1min",
	5: "5min",
	15: "15min",
	30: "30min",
	60: "60min",
	1440: "1d",
}

export class Charts extends React.Component<ChartsProps, ChartsState> {
	constructor(props: ChartsProps) {
		super(props);
		this.state = {
			isLoading: false, // loading happens in componentDidMount()
			stockId: props.stockId,
			chartType: "candlestick",
			interval: "1min",
			data: [],
			subscriptionId: new SubscriptionId,
			textDesc: 'Fetching chart data',
		};
	}

	getOldStockHistory = async (stockId: number) => {
		let globalIntervalData: ohlcPointType[] = [];

		let historyReq = new GetStockHistoryRequest();
		historyReq.setStockId(stockId);
		historyReq.setResolution(intervalTypeToResolutionProto[this.state.interval]);
		
		this.setState({
			isLoading: true,
		});

		try {
			let historyResp = await DalalActionService.getStockHistory(historyReq, this.props.sessionMd);

			historyResp.getStockHistoryMapMap().forEach((history: models_StockHistory_pb.StockHistory, key: string) => {
				globalIntervalData.push({
					o: history.getOpen(),
					h: history.getHigh(),
					l: history.getLow(),
					c: history.getClose(),
					t: Date.parse(history.getCreatedAt()),
				});
			});

			// this is a beautification thing. Our charts work nicely with 61 entries.
			// this will get removed after the first minute
			
			let dummy_data = $.extend(true, {}, globalIntervalData[0])
			dummy_data.t = dummy_data.t - 60000;
			globalIntervalData.unshift(dummy_data);

			this.setState({
				data: globalIntervalData,
				isLoading: false,
			})
		}

		catch(e) {
			this.setState({
				isLoading: false,
				textDesc:e.statusMessage,
			});	
		}
	}

	getStockHistoryStream = async (stockId: number) => {
		const historyReq = new GetStockHistoryRequest();
		historyReq.setStockId(stockId);
		historyReq.setResolution(intervalTypeToResolutionProto[this.state.interval]);

		const subscriptionId = await subscribe(this.props.sessionMd, DataStreamType.STOCK_HISTORY, this.props.stockId + "");

		this.setState({
			subscriptionId: subscriptionId,
		})

		const historyStream = DalalStreamService.getStockHistoryUpdates(subscriptionId, this.props.sessionMd);
		const streamIntervalData = this.state.data.slice();
		for await (const update of historyStream) {
			const newUpdate = update.getStockHistory()!;
			const myIntervalType = intervalToIntervalType[newUpdate.getInterval()];
			if (myIntervalType != this.state.interval) {
				continue;
			}
			streamIntervalData.push({
				o: newUpdate.getOpen(),
				h: newUpdate.getHigh(),
				l: newUpdate.getLow(),
				c: newUpdate.getClose(),
				t: Date.parse(newUpdate.getCreatedAt()),
			});

			// for some reason, the charts component requires a length of 61
			// to load perfectly
			if (streamIntervalData.length > 61) {
				streamIntervalData.shift();
			}

			this.setState({
				data: streamIntervalData,
			});
		}
	};

	async componentWillReceiveProps(nextProps: ChartsProps) {
		if (nextProps.stockId == this.props.stockId)
			return;
		unsubscribe(this.props.sessionMd, this.state.subscriptionId);

		this.getOldStockHistory(nextProps.stockId);
		this.getStockHistoryStream(nextProps.stockId);
	}

	componentWillUnmount() {
		unsubscribe(this.props.sessionMd, this.state.subscriptionId);
	}

	async componentDidMount() {
		this.setState({
			isLoading: true,
		});

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

		this.getOldStockHistory(this.props.stockId);
		this.getStockHistoryStream(this.props.stockId);
	}

	onIntervalChange = async (value: intervalType) => {
		this.setState({interval: value});
		this.getOldStockHistory(this.props.stockId);
	}

	onChartTabChange = (tabPath: string) => {
		const chartType = tabPath.indexOf("candlestick") != -1 ? "candlestick" : "line";
		this.setState({chartType: chartType});
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
							{/* <div className="item">1day</div> */}
						</div>
					</div>
				</span>
				<h3 className="panel-header right item">Price Chart</h3>
			</div>
			<div className={"ui segment " + (this.state.isLoading ? "" : "hidden")} id="chart-loader">
				<div className="ui active dimmer">
					<div className="ui medium text loader">{this.state.textDesc}</div>
				</div>
				<p></p>
			</div>
			<div className={!this.state.isLoading ? "" : "hidden"}>
			<Candlestick stockId={this.props.stockId} data={this.state.data} tabName={"candles-chart-container"} interval={this.state.interval} />
			<LineChart stockId={this.props.stockId} data={this.state.data} tabName={"line-chart-container"} interval={this.state.interval} />
			</div>
			</Fragment>
		);
	}
}