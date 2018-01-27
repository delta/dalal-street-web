import * as React from "react";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;

export interface StockChartProps {
    stockBriefInfoMap: { [index:number]: StockBriefInfo },
    chartData: { [index:number]: number }
}

interface StockChartState {

}

export class StockChart extends React.Component<StockChartProps, StockChartState> {
    chartElem: any;
    labels: string[] = [];
    numOfStocks: number;
    colors: string[] = [
        "#CD9FCC", "#F6CACA", "#84C318",
        "#F0803C", "#EDF060", "#26A96C",
        "#476C9B", "#17BEBB", "#92140C",
        "#32DE8A"
    ];
    constructor(props: StockChartProps) {
        super(props);
    }

    componentDidMount() {
		const cvs = document.getElementById("bar-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;

        this.numOfStocks = Object.keys(this.props.stockBriefInfoMap).length;
        let data = new Array(this.numOfStocks+1);

        for (const stockId in this.props.chartData) {
            data[stockId] = this.props.chartData[stockId];
        }

        data.shift();

        for (const stockId in this.props.stockBriefInfoMap) {
            this.labels.push(this.props.stockBriefInfoMap[stockId].fullName);
        }


		this.chartElem = new Chart(ctx, {
			type: 'bar',
			data: {
				datasets: [{
                    data: data,
                    backgroundColor: this.colors,
                }],
                labels: this.labels
            },
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Your stocks",
                    fontSize: 14,
                    fontColor: "#FFF"
                }
            }
        });
    }

    componentWillReceiveProps(nextProps: StockChartProps) {
        if (nextProps.chartData) {
            let data = new Array(this.numOfStocks+1);

            for (const stockId in nextProps.chartData) {
                data[stockId] = nextProps.chartData[stockId];
            }

            data.shift();
            this.chartElem.data.datasets = [{
                data: data,
                backgroundColor: this.colors,
            }];
			this.chartElem.update();
        }
    }

    render() {
        return (
            <canvas id="bar-chart" height="60%"></canvas>
        );
    }
}