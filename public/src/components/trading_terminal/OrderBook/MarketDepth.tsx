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

        askArray.sort((a:Depth, b:Depth) => {
            return parseInt(a.price) - parseInt(b.price);
        });

        bidArray.sort((a:Depth, b:Depth) => {
            return parseInt(b.price) - parseInt(a.price);
        });

        let l = bidArray.length > askArray.length ? bidArray.length : askArray.length;

        for (let i=0; i<13; i++) {
                buyRows.push(
                    <tr key={i}>
                        <td className="volume"><strong>{typeof(bidArray[i]) != "undefined" ? bidArray[i].volume : ''}</strong></td>
                        <td className="price green"><strong>{typeof(bidArray[i]) != "undefined" ? bidArray[i].price : ''}</strong></td>
                        <td className="volume"><strong>{typeof(askArray[i]) != "undefined" ? askArray[i].volume : ''}</strong></td>
                        <td className="price red"><strong>{typeof(askArray[i]) != "undefined" ? askArray[i].price : ''}</strong></td>
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