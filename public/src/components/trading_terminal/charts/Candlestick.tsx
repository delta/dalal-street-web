import * as React from "react";
//import * as CanvasJS from "canvasjs";

export interface CandlestickProps {
	stockId: number
}

export interface CandlestickState {
	stockId: number
}

export class Candlestick extends React.Component<CandlestickProps, CandlestickState> {
	constructor(props: CandlestickProps) {
		super(props);
		this.state  = {
			stockId: props.stockId
		};
	}

	componentWillReceiveProps(nextProps: CandlestickProps) {
		this.setState({
			stockId: nextProps.stockId
		});
	}

	render() {		
		return(
			<div className="ui pointing secondary menu">
				<h3 className="panel-header right item">Chart</h3>
			</div>
		);
	}
}