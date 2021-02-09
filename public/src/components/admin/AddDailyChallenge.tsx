import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { ChallengeType } from '../../../proto_build/actions/AddDailyChallenge_pb';
import { AddDailyChallengeRequest } from '../../../proto_build/actions/AddDailyChallenge_pb';
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { GetDailyChallengeConfigRequest } from "../../../proto_build/actions/GetDailyChallengeConfig_pb";
const CASH = ChallengeType.CASH;
const NETWORTH = ChallengeType.NETWORTH;
const STOCKWORTH = ChallengeType.STOCKWORTH;
const SPECIFICSTOCK = ChallengeType.SPECIFICSTOCK;

export interface AddDailyChallengeProps {
    sessionMd: Metadata,
}
export interface AddDailyChallengeState{
    totalMarketDaysDropDown: any[]
}

export class AddDailyChallenge extends React.Component<AddDailyChallengeProps, AddDailyChallengeState> {
    constructor(props: AddDailyChallengeProps) {
        super(props);
        this.state = {
            totalMarketDaysDropDown: []
        }
    }

    setDailyChallenge = async () => {
        const sessionMd = this.props.sessionMd;
        const marketDay = $('#day-select').val() as number;
        const challengeType = $('#type-select').val() as ChallengeType;
        const stock_id = $('#stockid').val() as number;
        const stockvalue = $('#stockvalue').val() as number;
        const reward = $('#reward').val() as number;

        const addDailyChallengeReq = new AddDailyChallengeRequest();

        try {
            addDailyChallengeReq.setMarketDay(marketDay);
            addDailyChallengeReq.setChallengeType(challengeType);
            addDailyChallengeReq.setStockid(stock_id);
            addDailyChallengeReq.setValue(stockvalue);
            addDailyChallengeReq.setReward(reward);

            const resp = await DalalActionService.addDailyChallenge(addDailyChallengeReq, sessionMd);

            showNotif("New Daily Challenge for the specified market day has been added");

        } catch (e) {
            console.log("Error happened while adding Challenge! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }
    componentDidMount() {
        ($("#day-select") as any).dropdown();
        ($("#type-select") as any).dropdown();
        this.setMarketDaysDropdown()
    }
    setMarketDaysDropdown = async()=>{
        try{
        const sessionMd = this.props.sessionMd;
        const GetDailyChallengeConfigReq = new GetDailyChallengeConfigRequest();
        const resp = await DalalActionService.getDailyChallengeConfig(GetDailyChallengeConfigReq, sessionMd);
        const totalMarketDays = resp.getTotalMarketDays();
        let dropDownelements = [];
        for(var i=1;i<=totalMarketDays;i++){
            let element = <option value={i}>Day {i}</option>;
            dropDownelements.push(element);
        }
        this.setState({
            totalMarketDaysDropDown: dropDownelements
        })
        } catch(e){

        }
    }

    render() {
        return (
            <React.Fragment>
                <table id="dividend-table">
                    <tbody className="ui bottom attached tab segment active inverted">
                        <tr>

                            <td>
                                <tr>
                                    <label>Enter Market Day: </label>
                                </tr>
                                <select name="Market-Day" id="day-select" className="ui selection dropdown">
                                    {this.state.totalMarketDaysDropDown}
                                </select>
                            </td>
                            <td>
                                <tr>
                                    <label>Enter Type of Challenge: </label>
                                </tr>
                                <select name="Challenge-Type" id="type-select" className="ui selection dropdown">
                                    <option value={CASH}>Cash</option>
                                    <option value={NETWORTH}>Networth</option>
                                    <option value={STOCKWORTH}>Stock Worth</option>
                                    <option value={SPECIFICSTOCK}>Specific Stock</option>
                                </select>
                            </td>
                            <td>
                                <tr>
                                    <label>Enter Stock Id: </label>
                                </tr>
                                <input type="integer" className="notify-text" id="stockid" placeholder="0" />
                            </td>
                            <td>
                                <tr>
                                    <label>Enter Value: </label>
                                </tr>
                                <input type="integer" className="notify-text" id="stockvalue" placeholder="0" />
                            </td>
                            <td>
                                <tr>
                                    <label>Enter Reward: </label>
                                </tr>
                                <input type="integer" className="notify-text" id="reward" placeholder="0" />
                            </td>
                            <td>
                                <input type="button" className="ui inverted green button" onClick={this.setDailyChallenge} value="Add Daily Challenge" />
                            </td>
                        </tr>
                    </tbody>
                </table>

            </React.Fragment>
        )
    }
}
