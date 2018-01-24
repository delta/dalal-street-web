import * as React from "react";
import { Metadata } from "grpc-web-client";
import { Dashboard } from "./Dashboard";
import { Transactions } from "./Transactions";
import { Notification } from "../common/Notification";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";

// Chart will be exposed globally by the ChartJS script included in index.html
declare var Chart: any;
declare var moment: any;

export interface PortfolioProps {
    sessionMd: Metadata,
    notifications: Notification_pb[],
    userCash: number,
    userTotal: number,
    transactionCount: number,
}

interface PortfolioState {

}

export class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
    constructor(props: PortfolioProps) {
        super(props);
    }

    render() {
        return (
            <div id="" className="main-container ui stackable grid pusher">
				<div className="row" id="top_bar">
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
                <div id="dashboard-container" className="row">
                    <Dashboard userCash={this.props.userCash} userTotal={this.props.userTotal} />
                </div>
                <div id="transactions-container" className="row">
                    <Transactions sessionMd={this.props.sessionMd} count={this.props.transactionCount}/>
                </div>
            </div>
        );
    }
}