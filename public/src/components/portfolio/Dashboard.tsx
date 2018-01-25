import * as React from "react";
import { Fragment } from "react";

import { StockBriefInfo } from "../trading_terminal/TradingTerminal";

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export interface DashboardProps {
    userCash: number,
    userTotal: number,
    stockBriefInfoMap: { [index:number]: StockBriefInfo },
    chartData: { [index:number]: number }
}

interface DashboardState {

}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {
    chartElem: any;
    constructor(props: DashboardProps) {
        super(props);
    }

    componentDidMount() {
		const cvs = document.getElementById("doughnut-chart") as HTMLCanvasElement;
		const ctx = cvs!.getContext('2d')!;

        const data = Object.values(this.props.chartData).filter(qty => qty > 0);
        let labels: string[] = [];

        for (const stockId in this.props.stockBriefInfoMap) {
            labels.push(this.props.stockBriefInfoMap[stockId].fullName);
        }


		this.chartElem = new Chart(ctx, {
			type: 'doughnut',
			data: {
				datasets: [{
                    data: data,
                    backgroundColor: ["#03A4E2"],
                    borderWidth: 0
                }],
                labels: labels
            },
            options: {
                legend: {
					display: true,
				},
            }
        });
    }

    componentWillReceiveProps(nextProps: DashboardProps) {
        if (nextProps.chartData) {
            let labels: string[] = [];

            for (const stockId in this.props.stockBriefInfoMap) {
                labels.push(this.props.stockBriefInfoMap[stockId].fullName);
            }
            this.chartElem.data.datasets = [{
                data: Object.values(nextProps.chartData).filter(qty => qty > 0),
                backgroundColor: ["#03A4E2"],
                borderWidth: 0  
            }];
            this.chartElem.data.labels = labels;
			this.chartElem.update();
        }
    }

    render() {
        return (
            <Fragment>
                <div className="ui seven wide column" >
                    <canvas id="doughnut-chart"></canvas>
                </div>
                <div className="ui three wide column">
                    <h1 className="ui center aligned green header inverted">
                        ₹ {this.props.userCash}
                        <div className="sub header">Cash in Hand</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className="ui center aligned green header inverted">
                        ₹ {this.props.userTotal - this.props.userCash}
                        <div className="sub header">Stock Worth</div>
                    </h1>
                </div>
                <div className="ui three wide column">
                    <h1 className="ui center aligned green header inverted">
                        ₹ {this.props.userTotal}
                        <div className="sub header">Net Worth</div>
                    </h1>
                </div>
            </Fragment>
        );
    }
}