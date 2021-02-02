import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { OpenDailyChallengeRequest } from "../../../proto_build/actions/OpenDailyChallenge_pb";
import { CloseDailyChallengeRequest } from "../../../proto_build/actions/CloseDailyChallenge_pb";
import {SetMarketDayRequest} from "../../../proto_build/actions/SetMarketDay_pb"
export interface DailyChallengeStateProps{
    sessionMd: Metadata
    isDailyChallengeOpen: boolean
}

export interface DailyChallengeStateState{
    challengeState: boolean
}

export class DailyChallengeState extends React.Component<DailyChallengeStateProps, DailyChallengeStateState> {
    constructor(props: DailyChallengeStateProps) {
        super(props);      
        this.state = {
          challengeState: this.props.isDailyChallengeOpen
        }
    }
    handleOpenChallenge = async (e:any) =>{
        
        const sessionMd = this.props.sessionMd;
        const StateReq = new OpenDailyChallengeRequest();

        try{
            
            const resp = await DalalActionService.openDailyChallenge(StateReq,sessionMd);
            this.setState({
                challengeState: true
            })
            showNotif("DailyChallenge has been successfully opened");

        }
        catch(e){
            console.log("Error happened while Opening Daily Challenge! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
            
        }

    }
    handleCloseChallenge = async (e:any) =>{
        
        const sessionMd = this.props.sessionMd;
        const StateReq = new CloseDailyChallengeRequest();

        try{
            
            const resp = await DalalActionService.closeDailyChallenge(StateReq,sessionMd);
            this.setState({
                challengeState: false
            })
            showNotif("DailyChallenge has been successfully closed");

        }
        catch(e){
            console.log("Error happened while Closing Daily Challenge! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
        }
    }
    setMarketDay = async ()=>{
        const sessionMd = this.props.sessionMd;
        const market_day = $('#market-day').val() as number;
        try{
            const SetMarketDayReq = new SetMarketDayRequest();
            SetMarketDayReq.setMarketDay(market_day);
            const resp = await DalalActionService.setMarketDay(SetMarketDayReq,sessionMd);
            console.log("Market Day has been set successfully");
        } catch(e){
            console.log("Error happened while Setting Market Day! ", e.statusCode, e.statusMessage, e);
           if (e.isGrpcError) {
              showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
           } else {
              showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
           } 
        }
    }
    render(){
        return(
            <React.Fragment>
                <table>
                    <tbody className="ui bottom attached tab segment active inverted">
                    <tr><label>Handle opening and closing of daily challenges here </label></tr>
                    <tr>
                        <td><input type="button" disabled={this.props.isDailyChallengeOpen} className={"ui inverted green button"} onClick={(e) => {this.handleOpenChallenge(e)}} value="Open DailyChallenge"/></td>
                        <td><input type="button" disabled={!this.props.isDailyChallengeOpen} className={"ui inverted red button"} onClick={(e) => {this.handleCloseChallenge(e)}} value="Close DailyChallenge"/></td>
                    </tr>
                    <tr><label>Set Market Day here</label></tr>
                    <tr>
                    <td><input type="integer" className="market-input" id="market-day" placeholder="0" /> <input type="button" className={"ui inverted green button"} onClick={this.setMarketDay} value="Set Market Day"/></td>
                    </tr>
                    </tbody>
                    
                </table>
            </React.Fragment>
        )
    }
}