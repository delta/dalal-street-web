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
import {DailyChallenge} from "../../../proto_build/models/DailyChallenge_pb"
import { GetCompanyProfileRequest } from "../../../proto_build/actions/GetCompanyProfile_pb";
import {GetMyUserStateRequest} from "../../../proto_build/actions/GetMyUserState_pb";
import {GetMyRewardRequest} from "../../../proto_build/actions/GetMyReward_pb"

declare var $: any;

export interface DailyChallengeRowProps {
    key: number,
    challenge:DailyChallenge,
    sessionMd:Metadata,
    isDailyChallengeOpen: boolean,
    curMarketDay:number
}
export interface DailyChallengeRowState{
    row:any,
    progress:any
    userState:any
}

export class DailyChallengeRow extends React.Component<DailyChallengeRowProps, DailyChallengeRowState> {
    constructor(props: DailyChallengeRowProps) {
        super(props);
        this.state={
            row:"",
            progress: "",
            userState:""
        }
    }
    componentDidMount = async()=>{
        const challenge_id = this.props.challenge.getChallengeId(),
              market_day = this.props.challenge.getMarketDay(),
              challenge_type = this.props.challenge.getChallengeType(),
              value = this.props.challenge.getValue(),
              stock_id = this.props.challenge.getStockId();

            try{

                const GetUserStateReq = new GetMyUserStateRequest();
                GetUserStateReq.setMarketDay(market_day);
                GetUserStateReq.setChallengeId(challenge_id);
                const respUserState = await DalalActionService.getMyUserState(GetUserStateReq,this.props.sessionMd);

                const userState = respUserState.getUserState();
                this.setState({
                    userState:userState!.getId()
                })
                //Add is Daily challenge Open in this block of code
                if(userState!=null){
                    const isRewardClaimed = userState.getIsRewardClamied();
                    const progress = userState.getIsCompleted();

                    console.log("Reward Accepted:"+isRewardClaimed);
                    console.log("Progress:"+progress)
                    if(progress&&(isRewardClaimed)){
                        var progressbox = <div className="two wide column progress">
                        <i className="check completed huge icon"></i>
                    </div> 
                    this.setState({
                        progress: progressbox
                    })
                    } 
                    
                    else if(progress&&(!isRewardClaimed)) {
                        var progressbox = <div className="two wide column progress">
                                <button className="orange" onClick={this.reward}>Claim</button>
                                </div> 
                    console.log("Inga vanchuda unda")
                    }
                    
                    else{  //Add here
                        if(this.props.isDailyChallengeOpen&&(market_day==this.props.curMarketDay)){
                            var progressbox = <div className="two wide column progress">
                            <i className="spinner loading huge icon" id="spin"></i> 
                        </div> 
                        this.setState({
                            progress: progressbox
                        })
                        } else {
                            var progressbox = <div className="two wide column progress">
                            <span id="wrong">&#10060;</span>
                        </div> 
                        this.setState({
                        progress: progressbox
                        })
                        }
                    }
                }
                
                
            }
            catch(e){
                console.log("Error happened while getting user state! ", e.statusCode, e.statusMessage, e);
           if (e.isGrpcError) {
              showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
           } else {
              showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
           } 
            }

        if((challenge_type=="Cash")||(challenge_type=="NetWorth")||(challenge_type=="StockWorth")){
            var daily_challenge = challenge_type=="Cash" ?  <div className="row" id="challenge-row">
                                        <div className="fourteen wide column challenge">
                                            <p>
                                                Increase your {challenge_type} Worth to {value}
                                            </p>
                                        </div>  
                                        {this.state.progress}  
                                        </div> : <div className="row" id="challenge-row">
                                        <div className="fourteen wide column challenge">
                                            <p>
                                                Increase your {challenge_type} to {value}
                                            </p>
                                        </div>  
                                        {this.state.progress}  
                                        </div> 
                                    
                                    
                 
            this.setState({
                row:daily_challenge
            })
        } else {
            try{
                const GetCompanyProfileReq = new GetCompanyProfileRequest();
                GetCompanyProfileReq.setStockId(stock_id);
                const resp = await DalalActionService.getCompanyProfile(GetCompanyProfileReq,this.props.sessionMd);
                const details = resp.getStockDetails();
                if(details!=null){
                    const stock_name = details.getFullName();
                   var daily_challenge =  <div className="row" id="challenge-row">
                                        <div className="fourteen wide column challenge">
                                            <p>
                                                Increase the number of stocks of {stock_name} to {value}
                                            </p>
                                        </div>  
                                        {this.state.progress}  
                                        </div> 
                this.setState({
                    row:daily_challenge
                })    
            }
                
                
            } catch(e){

            }
        }
    }

    reward = async()=>{
        console.log("Rewarddee")
        try{
            const GetMyRewardReq = new GetMyRewardRequest();
            GetMyRewardReq.setUserStateId(this.state.userState)
            const resp = await DalalActionService.getMyReward(GetMyRewardReq,this.props.sessionMd)
            
        } catch(e){
            console.log("Error happened while accepting reward! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
               showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
               showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            } 
        }
        var progressbox = <div className="two wide column progress">
                        <i className="check completed huge icon"></i>
                    </div> 
                    this.setState({
                        progress: progressbox
                    })
    }

    render(){
           
        return(
            <Fragment>
                {this.state.row}
                
                {/* <div className="row" id="challenge-row">
                    <div className="fourteen wide column challenge">
                    <p>
                    Increase your networth to 50,000 Increase your 
                    </p>
                    </div>
                    <div className="two wide column progress">
                    <i className="spinner loading huge icon" id="spin"></i> 

                    </div> 
                </div> */}
                {/* <div className="row" id="challenge-row">
                    <div className="fourteen wide column challenge">
                    <p>
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000 Increase your networth to 50,000
                    </p>
                    </div>
                    <div className="two wide column progress">
                    <i className="spinner loading huge icon" id="spin"></i> 
                    </div> 
                </div> */}
                
            </Fragment>
        )
            
        
    }

}