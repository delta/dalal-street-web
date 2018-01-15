import * as React from "react";

export interface OpenOrdersProps{
	userId: number
}

export class OpenOrders extends React.Component<OpenOrdersProps, {}>{
	render(){
		
		const currentOrders = [
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Buy", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"},
			{"company":"GOOGL", "type":"Sell", "volume":200, "filled":100, "price":"10"}
		];

		let orderClass;

		let history:any[] = currentOrders.map((order) =>{
			orderClass = (order.type == "Sell" ? "order_sell" : "order_buy") ;
			orderClass = orderClass + " volume";
			return(
				<tr>
				<td className={orderClass}><strong>{order.company}</strong></td>
				<td className={orderClass}><strong>{order.type}</strong></td>
				<td className={orderClass}><strong>{order.volume}</strong></td>
				<td className={orderClass}><strong>{order.filled}</strong></td>
				<td className={orderClass}><strong>{order.price}</strong></td>
				</tr>
			)
		});
		
		return (
			<div>
			<table className="ui inverted table unstackable">
			<thead>
			<tr>
			<th>Company</th>
			<th>Type</th>
			<th>Volume</th>
			<th>Filled</th>
			<th>Price</th>
			</tr>
			</thead>
			<tbody>
			{history}
			</tbody>
			</table>
			</div>
		);
		
		
	}
}
