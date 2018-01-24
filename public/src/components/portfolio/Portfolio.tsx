import * as React from "react";

export interface PortfolioProps {

}

interface PortfolioState {

}

export class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
    constructor(props: PortfolioProps) {
        super(props);
    }

    render() {
        return <h1>portfolio</h1>
    }
}