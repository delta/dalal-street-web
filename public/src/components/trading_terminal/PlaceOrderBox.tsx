import * as React from "react";

export interface PlaceOrderBoxProps{
	stockId: number,
	currentPrice: number
}

export class PlaceOrderBox extends React.Component<PlaceOrderBoxProps, {}> {

    render() {
        return (<h1>hi</h1>);     
    }
}