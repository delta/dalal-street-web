import * as React from "react";

export interface MarketDepthProps {
	stockId: number
}

type depthEntry = {
    volume: number,
    price: number,
};

interface marketDepthState {
    buys: depthEntry[],
    sells: depthEntry[],
};

export class MarketDepth extends React.Component<MarketDepthProps, {}> {
    constructor(props: MarketDepthProps) {
        super(props);
    }
    componentWillMount() {
        const buys: depthEntry[] = [];
        const sells: depthEntry[] = [];

        for(let i = 0; i < 12; i++) {
            buys.push({
                volume: Math.floor(Math.random()*100),
                price: Math.floor(Math.random()*1000),
            });
            sells.push({
                volume: Math.floor(Math.random()*100),
                price: Math.floor(Math.random()*1000),
            });
        }

        this.setState({
            buys,
            sells,
        });
    }
	render() {
        const buyRows: any[] = [];
        //const sellRows: any[] = [];
        const state = this.state as marketDepthState;

        for (let i = 0; i < 12; i++) {
            buyRows.push(
                <tr>
                    <td className="volume"><strong>{state.buys[i].volume}</strong></td>
                    <td className="price"><strong>{state.buys[i].price}</strong></td>
                    <td className="volume"><strong>{state.sells[i].volume}</strong></td>
                    <td className="price"><strong>{state.sells[i].price}</strong></td>
                </tr>
            );
        }

		return (
			<div>
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