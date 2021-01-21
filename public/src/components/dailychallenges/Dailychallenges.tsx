import * as React from "react";
import { Metadata } from "grpc-web-client";
import ReactPaginate from "react-paginate";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { GetLeaderboardRequest, GetLeaderboardResponse } from "../../../proto_build/actions/GetLeaderboard_pb";
import { LeaderboardRow as LeaderboardRow_pb } from "../../../proto_build/models/LeaderboardRow_pb";
import { Fragment } from "react";
import { addCommas, showErrorNotif } from "../../utils";
import { render } from "react-dom";

declare var $: any;

export interface DailyChallengesProps {
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userStockWorth: number,
    connectionStatus: boolean,
    isMarketOpen: boolean,
    isBlocked: boolean
    sessionMd: Metadata,
    leaderboardCount: number,
    notifications: Notification_pb[],
    disclaimerElement: JSX.Element,
    reservedStocksWorth: number,
}

interface DailyChallengesState {
    DailyChallengesRow: string[]
}

export class DailyChallenges extends React.Component<DailyChallengesProps, DailyChallengesProps> {
    constructor(props: DailyChallengesProps) {
        super(props);

    }


    render() {

            return(
                <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth={this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} isBlocked={this.props.isBlocked}/>
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="dailyChallenges-container" className="ui stackable grid pusher main-container">
                    <div className="row">
                        <h2 className="ui center aligned icon header inverted">
                            <i className="calendar check icon"></i>
                            <div className="content">
                                Daily Challenges
                            <div className="grey sub header">
                                    Complete these tasks to win exciting rewards
                            </div>
                            </div>
                        </h2>
                    </div>
                    </div>

                    <div className="timeline">
      <div className="events">
        <ol>
          <ul>
            <li>
              <a>Monday</a>
            </li>
            <li>
              <a href="#1">Tuesday</a>
            </li>
            <li>
              <a href="#2" className="selected">Wednesday</a>
            </li>
            <li>
              <i className="lock icon large locked"></i>
            </li>
            <li>
            <i className="lock icon large locked"></i>
            </li>
            <li>
            <i className="lock icon large locked"></i>
            </li>
            <li>
            <i className="lock icon large locked"></i>
            </li>
          </ul>
        </ol>
      </div>
    </div>
    
                </Fragment>  
            )
                  


    }

}

    