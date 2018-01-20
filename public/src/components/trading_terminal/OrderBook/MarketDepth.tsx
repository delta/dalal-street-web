import * as React from "react";

export interface MarketDepthProps {
    stockId: number
    askDepth: { [index:number]: number }
    bidDepth: { [index:number]: number }
}

interface OpenOrdersState {
    isLoading: boolean,
}

export interface Depth {
    price: string,
    volume: number,
}

type depthEntry = {
    volume: number,
    price: number,
};

export class MarketDepth extends React.Component<MarketDepthProps, {}> {
    constructor(props: MarketDepthProps) {
        super(props);
    }
    componentWillMount() {
        this.setState({
            isLoading: true
		});
    }
	render() {
        const buyRows: any[] = [];
        const askDepth = this.props.askDepth;
        const bidDepth = this.props.bidDepth;

        const askArray: Depth[] = [];
        const bidArray: Depth[] = [];

        for (let askKey in askDepth){
            let tempDepth = {
                price: askKey,
                volume: askDepth[askKey],
            }

            askArray.push(tempDepth);
        }
        
        for (let bidKey in bidDepth){
            let tempDepth = {
                price: bidKey,
                volume: bidDepth[bidKey],
            }

            bidArray.push(tempDepth);
        }

        let l = bidArray.length > askArray.length ? bidArray.length : askArray.length;

        for (let i=0; i<l; i++) {
                buyRows.push(
                    <tr>
                        <td className="volume"><strong>{typeof(bidArray[i].volume) == "undefined" ? bidArray[i].volume : ''}</strong></td>
                        <td className="price green"><strong>{typeof(bidArray[i].price) == "undefined" ? bidArray[i].price : ''}</strong></td>
                        <td className="volume"><strong>{typeof(askArray[i].volume) == "undefined" ? askArray[i].volume : ''}</strong></td>
                        <td className="price red"><strong>{typeof(askArray[i].price) == "undefined" ? askArray[i].price : ''}</strong></td>
                    </tr>
                );
        }

		return (
			<div className="ui tab inverted active" data-tab="market-depth" id="market-depth">
				<table className="ui inverted table unstackable">
                    <thead>
                        <tr>
                            <th colSpan={2}>Buy</th>
                            <th colSpan={2}>Sell</th>
                        </tr>
                    </thead>
					<thead>
						<tr>
							<th>Volume</th>
							<th>Price</th>
                            <th>Volume</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{buyRows}
					</tbody>
				</table>
			</div>
		);
	}
}