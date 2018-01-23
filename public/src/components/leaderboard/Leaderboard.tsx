import * as React from "react";
import { Metadata } from "grpc-web-client";
import * as ReactPaginate from "react-paginate";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { Notification } from "../common/Notification";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { GetLeaderboardRequest, GetLeaderboardResponse } from "../../../proto_build/actions/GetLeaderboard_pb";
import { LeaderboardRow as LeaderboardRow_pb } from "../../../proto_build/models/LeaderboardRow_pb";

export interface LeaderboardProps {
    sessionMd: Metadata,
    leaderboardCount: number,
    notifications: Notification_pb[]
}

interface LeaderboardState {
    totalPages: number,
    leaderboardEntries: LeaderboardRow_pb[],
    userRank: number,
}

export class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
    constructor(props: LeaderboardProps) {
        super(props);

        this.state = {
            totalPages: 1,
            leaderboardEntries: [],
            userRank: 0,
        };
    }

    componentDidMount() {
        this.getLeaderboard(1);
    }

    getLeaderboard = async (offset: number) => {
        const leaderboardRequest = new GetLeaderboardRequest();
        leaderboardRequest.setStartingId(offset);
        leaderboardRequest.setCount(this.props.leaderboardCount);

        try {
            const resp = await DalalActionService.getLeaderboard(leaderboardRequest, this.props.sessionMd);
            console.log(resp.getStatusCode(), resp.toObject());
            this.setState({
                totalPages: Math.ceil(resp.getTotalUsers() / this.props.leaderboardCount),
                leaderboardEntries: resp.getRankListList(),
                userRank: resp.getMyRank(),
            });
        }
        catch(e) {
            // error could be grpc error or Dalal error. Both handled in exception
            console.log("Error happened! ", e.statusCode, e.statusMessage, e);
        }
    };

    handlePageChange = (data: any) => {
        const startPage = data.selected as number;
        const offset = (startPage - 1) * this.props.leaderboardCount + 1;

        this.getLeaderboard(offset);
    }

    render() {
        const state = this.state;
        
        const leaderboardEntries = state.leaderboardEntries.map((entry, index) => (
            <tr key={index}>
                <td><strong>{entry.getRank()}</strong></td>
                <td><strong>{entry.getUserName()}</strong></td>
                <td className="green"><strong>{entry.getCash()}</strong></td>
                <td className="green"><strong>{entry.getStockWorth()}</strong></td>
                <td className="red"><strong>{entry.getDebt()}</strong></td>
                <td><strong>{entry.getTotalWorth()}</strong></td>                    
            </tr>
        ));

        return (
            <div id="leaderboard-container" className="ui stackable grid pusher main-container">
               <div className="row" id="top_bar">
					<div id="notif-component">
						<Notification notifications={this.props.notifications} icon={"open envelope icon"} />
					</div>
				</div>
                <div className="row">
                    <h2 className="ui center aligned icon header inverted">
                        <i className="trophy icon"></i>                        
                        <div className="content">
                            Leaderboard
                            <div className="grey sub header">
                                This is what it all comes down to
                            </div>
                        </div>
                    </h2>
                </div>
                <div className="row">
                    <table className="ui inverted table unstackable">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Cash (₹)</th>
                                <th>StockWorth (₹)</th>
                                <th>Debt (₹)</th>
                                <th>Net Worth (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardEntries}
                        </tbody>
                    </table>
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
            </div>
        );
    }
}