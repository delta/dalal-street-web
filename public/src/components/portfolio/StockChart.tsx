import * as React from "react";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;

export interface StockChartProps {
    stockBriefInfoMap: { [index:number]: StockBriefInfo },
    chartData: { [index:number]: number },
    label: string,
}

interface StockChartState {

}

export class StockChart extends React.Component<StockChartProps, StockChartState> {
    chartElem: any;
    labels: string[] = [];
    constructor(props: StockChartProps) {
        super(props);
    }

    getStocksOwned = (chartData: { [index:number]: number }): number[] => {
        let data: number[] = [];
        for (const stockId in this.props.stockBriefInfoMap) {
            if (stockId in chartData) {
                data.push(chartData[stockId]);
            }
            else {
                data.push(0);
            }
        }
        return data;
    }

    componentDidMount() {
        const cvs = document.getElementById("bar-chart") as HTMLCanvasElement;
        const ctx = cvs!.getContext('2d')!;

        let data = this.getStocksOwned(this.props.chartData);

        for (const stockId in this.props.stockBriefInfoMap) {
            this.labels.push(this.props.stockBriefInfoMap[stockId].fullName);
        }

        this.chartElem = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: "#617073",
                }],
                labels: this.labels
            },
            options: {
                legend: {
                    display: false,
                },
            scales: {
             yAxes: [{
               display: true,
               ticks: {
                  suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
               }
            }]
          }
        }
        });
    }

    componentWillReceiveProps(nextProps: StockChartProps) {
        if (nextProps && nextProps.chartData) {
            let data = this.getStocksOwned(nextProps.chartData);

            this.chartElem.data.datasets = [{
                data: data,
                backgroundColor: "#617073",
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
