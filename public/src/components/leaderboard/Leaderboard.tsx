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

declare var $: any;

export interface LeaderboardProps {
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

type leaderboardType = "overall" | "daily"; // overall || daily

interface LeaderboardState {
    totalPages: number,
    leaderboardEntries: LeaderboardRow_pb[],
    userRank: number,
    leaderboardType: leaderboardType, // overall || daily
}

export class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
    constructor(props: LeaderboardProps) {
        super(props);

        this.state = {
            totalPages: 1,
            leaderboardEntries: [],
            userRank: 0,
            leaderboardType: "overall"
        };
    }

    componentDidMount() {
        $("#leaderboard .box").popup();
        this.getLeaderboard(1);
    }

    getLeaderboard = async (offset: number) => {
        // No idea why this is required but react-paginate breaks if you change state while it's state change is happening
        // this.setState({
        //     isLoading: true,
        // });
        
        const leaderboardRequest = new GetLeaderboardRequest();
        leaderboardRequest.setStartingId(offset);
        leaderboardRequest.setCount(this.props.leaderboardCount);
        
        try {
            if(this.state.leaderboardType == 'overall'){
                const resp = await DalalActionService.getLeaderboard(leaderboardRequest, this.props.sessionMd);
                this.setState({
                    totalPages: Math.ceil(resp.getTotalUsers() / this.props.leaderboardCount),
                    leaderboardEntries: resp.getRankListList(),
                    userRank: resp.getMyRank(),
                });
            } else {
                const resp = await DalalActionService.getDailyLeaderboard(leaderboardRequest, this.props.sessionMd);
                this.setState({
                    totalPages: Math.ceil(resp.getTotalUsers() / this.props.leaderboardCount),
                    leaderboardEntries: resp.getRankListList(),
                    userRank: resp.getMyRank(),
                });
            }
            }
            catch (e) {
                // error could be grpc error or Dalal error. Both handled in exception
                console.log("Error happened! ", e.statusCode, e.statusMessage, e);
                showErrorNotif("Error fetching leaderboard. Try refreshing.");
            }
    };

    handlePageChange = async (data: any) => {
        const startPage = data.selected as number;
        const offset = startPage * this.props.leaderboardCount + 1;

        await this.getLeaderboard(offset);
    }

    handleChangeLeaderBoardType = (type: leaderboardType) => {
        this.setState({leaderboardType : type})
    }

    componentDidUpdate(_props : LeaderboardProps, prevState : LeaderboardState) {
        if(prevState.leaderboardType != this.state.leaderboardType)
        {
            // if the type of leaderboard has been changed, fetch from server again
            this.getLeaderboard(1);
        }
    }

    render() {
        const state = this.state;

        const leaderboardEntries = state.leaderboardEntries.map((entry, index) => (
            <tr key={index} className={entry.getIsBlocked()?"leaderboard-blocked": ""}>
                <td><strong>{entry.getRank()}</strong></td>
                {entry.getIsBlocked() && <td className="box" data-tooltip="Account Blocked for a day" data-position="left center" data-variation="mini" ><strong>{entry.getUserName()}  </strong> </td> }
                {!entry.getIsBlocked() && <td><strong>{entry.getUserName()}</strong></td>}
                <td><strong>{addCommas(entry.getCash())}</strong></td>
                <td className={!entry.getIsBlocked()?(entry.getStockWorth() >= 0 ? "green" : "red"): (entry.getStockWorth() >= 0 ? "leaderboard-blocked-cell-green": "leaderboard-blocked-cell-red")}><strong>{addCommas(entry.getStockWorth())}</strong></td>
                <td className={!entry.getIsBlocked()?(entry.getTotalWorth() >= 0 ? "green" : "red"): (entry.getTotalWorth() >= 0 ? "leaderboard-blocked-cell-green": "leaderboard-blocked-cell-red")}><strong>{addCommas(entry.getTotalWorth())}</strong></td>
            </tr>
        ));

        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth={this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} isBlocked={this.props.isBlocked}/>
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="leaderboard-container" className="ui stackable grid pusher main-container">
                    <div className="row">
                        <h2 className="ui center aligned icon header inverted">
                            <i className="trophy icon"></i>
                            <div className="content">
                                Leaderboard
                            <div className="grey sub header">
                                    This is what it all comes down to
                            </div>
                            <br/>
                            <div className="ui buttons">
                                <button 
                                    className={"ui big inverted button " + (this.state.leaderboardType == "overall" && "active")} 
                                    onClick={() => this.handleChangeLeaderBoardType("overall")}
                                    data-position="left center" data-tooltip="leaderboard over the whole game"
                                    >Overall Leaderboard</button>
                                <button 
                                    className={"ui big inverted button " + (this.state.leaderboardType == "daily" && "active")} 
                                    onClick={() => this.handleChangeLeaderBoardType("daily")}
                                    data-position="right center" data-tooltip="top players this market day"
                                >Daily LeaderBoard</button>
                            </div>
                            </div>
                        </h2>
                    </div>

                    <div id="my-rank" className="row">
                        <div className="one wide column"></div>
                        <div className="eight wide column">
                            <div className="ui header inverted">
                                <i className="star icon"></i>
                                Your rank : {state.userRank}
                            </div>
                        </div>
                        <div className="six wide column">
                            <div className="ui small right aligned header inverted">
                                Leaderboard will be updated every 2 minutes
                            </div>
                        </div>
                        <div className="one wide column"></div>
                    </div>

                    <div className="row fourteen wide column centered">
                        <table className="ui inverted table unstackable">
                            <thead>
                                <tr id="leaderboard">
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th 
                                        className="box" 
                                        data-position="top center" 
                                        data-content={this.state.leaderboardType == "overall" ? "Cash in hand + Reserved cash" : "Change in the total cash in hand today"}>
                                    <div>
                                       Total Cash (₹) <i className="fa fa-question-circle" aria-hidden="true"></i>
                                    </div>
                                    </th>
                                    <th 
                                        className="box" 
                                        data-position="top center"
                                        data-content={this.state.leaderboardType == "overall" ? "Stock owned + Reserved stock" : "Change in worth of the stocks today"}>
                                       Total Stock Worth (₹) <i className="fa fa-question-circle" aria-hidden="true"></i>
                                    </th>
                                    <th>Net Worth (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardEntries}
                            </tbody>
                        </table>
                    </div>

                    <div className="row">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={<a href="">...</a>}
                            breakClassName={"break-me"}
                            pageCount={state.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageChange}
                            containerClassName={"leaderboard-pagination"}
                            activeClassName={"active-leaderboard-page"}
                        />
                        
                    </div>
                    {this.props.disclaimerElement}
                </div>
            </Fragment>
        );
    }
}
