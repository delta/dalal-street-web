import * as React from "react";
import { StockChart } from "./StockChart";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { Fragment } from "react";
declare var $: any; // $ will be exposed globally by jQuery

export interface StockChartsProps {
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stocksOwnedMap: { [index: number]: number },
    stocksReservedMap: { [index: number]: number },
}

interface StockChartsState {
    chartType: chartTypes
}

type chartTypes = "owned"|"reserved";

export class StockCharts extends React.Component<StockChartsProps, StockChartsState> {
    constructor(props: StockChartsProps) {
        super(props);
        this.state={
            chartType: "owned"
        }
    }

    onChartTabChange = (tabPath: string) => {
		const chartType = tabPath.indexOf("owned") != -1 ? "owned" : "reserved";
        this.setState({chartType: chartType});
        
        if(tabPath=="owned"){
            $("#reservedstockchart-container").removeClass("active");
            $("#stockchart-container").addClass("active");
        }
        else{
            $("#stockchart-container").removeClass("active");
            $("#reservedstockchart-container").addClass("active");
        }
        $("html, body").animate({scrollTop: 0}, 1000);
	}

    render() {
        return (
            <Fragment>
                    <div id="stockchart-menu-container" className="ui pointing secondary menu">
                        <a className="item active" data-tab="stockchart-container" id="stockchart-container" onClick={()=>this.onChartTabChange("owned")}>Stocks Owned</a>
				        <a className="item" data-tab="reservedstockchart-container" id="reservedstockchart-container" onClick={()=>this.onChartTabChange("reserved")}>Reserved Stocks</a>
                    </div>

                    {this.state.chartType=="owned"?
                        <StockChart
                        stockBriefInfoMap={this.props.stockBriefInfoMap}
                        chartData={this.props.stocksOwnedMap}
                        label="Your Stocks"
                        />:
                        <StockChart
                            stockBriefInfoMap={this.props.stockBriefInfoMap}
                            chartData={this.props.stocksReservedMap}
                            label="Reserved Stocks"
                        />
                    }
            </Fragment>
        );
    }
}
