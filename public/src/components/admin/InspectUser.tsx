import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { InspectUserRequest } from "../../../proto_build/actions/InspectUser_pb";

type InspectUserRow = {
    id: any
    email: any
    transactionCount: any
    position: any
    stockSum: any
}
interface InspectUserProps {
    sessionMd: Metadata,
}

interface InspectUserState {
    userId: number
    transType: boolean
    inspectUserMap: { [index: number]: InspectUserRow }
    days: number
}

export class InspectUser extends React.Component<InspectUserProps, InspectUserState> {
    constructor(props: InspectUserProps) {
        super(props);
        this.state = {
            userId: 0,
            transType: false,
            inspectUserMap: {},
            days: 7
        }
    }

    handleUserIdChange = (userID: React.FormEvent<HTMLInputElement>) => {

        const newUserID = Number(userID.currentTarget.value);
        this.setState(prevState => {
            return {
                userId: newUserID
            }
        });
    };

    GetDetails = async () => {
        const inspectUserReq = new InspectUserRequest();
        const userId = this.state.userId;
        const sessionMd = this.props.sessionMd;
        const transtype = this.state.transType;
        const days = this.state.days;
        try {
            inspectUserReq.setUserId(userId);
            inspectUserReq.setTransactionType(transtype)
            inspectUserReq.setDay(days)
            const resp = await DalalActionService.inspectUser(inspectUserReq, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            const res = resp.getListList()
            let inspectUserMap: { [index: number]: any } = {};
            resp.getListList().forEach((obj, objId) => {
                let object = {
                    id: obj.getId(),
                    email: obj.getEmail(),
                    transactionCount: obj.getTransactionCount(),
                    position: obj.getPosition(),
                    stockSum: obj.getStockSum(),
                }
                inspectUserMap[objId] = object

            });
            this.setState({
                inspectUserMap: inspectUserMap
            })

        } catch (e) {
            console.log("Error happened while inspecting User ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }

    handleOptionChange = (e: any) => {
        const id = e.currentTarget.id
        this.setState((prevState) => {
            if (id == "Bid") {
                return {
                    transType: true
                }
            }
            else {
                return {
                    transType: false
                }
            }

        });
    }

    handleMarketDaysChange = (e: any) => {
        const newDaysCount = Number(e.currentTarget.value);
        this.setState(prevState => {
            return {
                days: newDaysCount
            }
        });
    }

    render() {
        let content = [];
        let inspectUserMap: { [index: number]: InspectUserRow } = this.state.inspectUserMap;

        for (const id in inspectUserMap) {
            content.push(
                <tr>
                    <td>{inspectUserMap[id].id}</td>
                    <td>{inspectUserMap[id].email}</td>
                    <td>{inspectUserMap[id].transactionCount}</td>
                    <td>{inspectUserMap[id].position}</td>
                    <td>{inspectUserMap[id].stockSum}</td>
                </tr>
            )
        }

        return (
            <React.Fragment>
                <table id="dividend-table">
                    <tbody className="ui bottom attached tab segment active inverted">
                        <tr>
                            <td>
                                <label className="radiolabel">
                                    <input type="radio" id="Ask" name="AskUser" onChange={this.handleOptionChange.bind(this)} checked={!this.state.transType} />Ask User
                         <span className="radiocheckmark"></span>
                                </label>
                                <label className="radiolabel">
                                    <input type="radio" id="Bid" name="BidUser" onChange={this.handleOptionChange.bind(this)} checked={this.state.transType} />Bid User
                         <span className="radiocheckmark"></span>
                                </label>
                            </td>
                            <td>
                                <input type="integer" className="market-input" id="user-id" name="user-id" onChange={this.handleUserIdChange.bind(this)} placeholder="User ID" />
                            </td>
                            <td>
                                <input type="integer" className="market-input" id="market-days" name="market-days" onChange={this.handleMarketDaysChange.bind(this)} placeholder="Days" />
                            </td>
                            <td>
                                <input type="button" className="ui inverted green button" onClick={this.GetDetails.bind(this)} value="Inspect User" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="ui celled table">
                    <thead>
                        <tr><th>Id</th>
                            <th>Email</th>
                            <th>Transaction Count</th>
                            <th>Position</th>
                            <th>Stock Sum</th>
                        </tr></thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

