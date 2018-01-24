import * as React from "react";

export interface DashboardProps {
    userCash: number,
    userTotal: number,
}

interface DashboardState {

}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
    }

    render() {
        return <h1>Dashboard</h1>
    }
}