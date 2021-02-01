import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Fragment } from "react";
import { showErrorNotif } from "../../utils";
import { DailyChallengeRow } from "../dailychallenges/DailyChallengeRow";
import {GetDailyChallengesRequest} from "../../../proto_build/actions/GetDailyChallenges_pb"
import { GetDailyChallengeConfigRequest } from "../../../proto_build/actions/GetDailyChallengeConfig_pb";

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
  notifications: Notification_pb[],
  disclaimerElement: JSX.Element,
  reservedStocksWorth: number,
  isDailyChallengeOpen:boolean

}

interface DailyChallengesState {
  DailyChallenges: any[],
  curMarketDay: number,
  dispMarketDay: number,
  timeline: any[],
  isDailyChallengeOpen:boolean,
  render: boolean
}

export class DailyChallenges extends React.Component<DailyChallengesProps, DailyChallengesState> {
  constructor(props: DailyChallengesProps) {
    super(props);

    this.state={
      DailyChallenges: [],
      curMarketDay: 0,
      dispMarketDay: 0,
      timeline: [],
      isDailyChallengeOpen:this.props.isDailyChallengeOpen,
      render: false
    }

  }
  
  // Displays the initial timeline
  intialTimeline = () =>{
    const state = this.state;
    var timeline=[];
    let i:number;

    for(i=1;i<=7;i++){
      if(i<state.curMarketDay){
        var bubble = <li>
                      <a data-value={i} onClick={(e)=>this.handleChangeDay(e)}>Day {i}</a>
                  </li>;
      } else if(i==state.curMarketDay){
        var bubble = <li >
                      <a className="selected" data-value={i} onClick={(e)=>this.handleChangeDay(e)}>Day {i}</a>
                  </li>;
      }
      else{
        var bubble = <li key={i}>
        <i className="lock icon large locked"></i>
      </li>
      }

      
      timeline.push(bubble);  
  }
  this.setState({
    timeline: timeline
  })

  }

  // Handles displaying daily challenges of any day
  displayDailyChallenge = async(day:number) =>{
    const sessionMd = this.props.sessionMd;
    const GetDailyChallengesReq = new GetDailyChallengesRequest();
    GetDailyChallengesReq.setMarketDay(day);
    try{
      if(day!=0){
        const resp = await DalalActionService.getDailyChallenges(GetDailyChallengesReq, sessionMd);
      const list = resp.getDailyChallengesList();
      var dailyRows=[] as any[];
      list.forEach((item,index)=>{
        var row = <DailyChallengeRow isDailyChallengeOpen={this.props.isDailyChallengeOpen} curMarketDay={this.state.curMarketDay} key={new Date().getTime()} challenge={item} sessionMd={this.props.sessionMd}></DailyChallengeRow>
        dailyRows.push(row);
      })
      this.setState({
        DailyChallenges:[]
      })
      this.setState({
        DailyChallenges:dailyRows,
        dispMarketDay: day
      })
      }
      
    }
    catch(e){
      console.log("Error happened while updating dailyChallenge Rows! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
    }
  }
  handleChangeDay = async(e:any) =>{
  
    const state = this.state;
    var timeline=[];
    //This block of code is for generating timeline
    for(var i=1;i<=7;i++){
      if(i<=state.curMarketDay && i==e.currentTarget.dataset.value){
        var bubble = <li>
                      <a className="selected" data-value={i} onClick={(e)=>this.handleChangeDay(e)}>Day {i}</a>
                  </li>;
      } else if(i<=state.curMarketDay){
        var bubble = <li>
                      <a data-value={i} onClick={(e)=>this.handleChangeDay(e)}>Day {i}</a>
                  </li>;
      }
      else{
        var bubble = <li>
        <i className="lock icon large locked"></i>
      </li>
      }
      this.setState({
        timeline: timeline
      })
      timeline.push(bubble);  
  }
  //This block of code is for adding the rows
  await this.displayDailyChallenge(e.currentTarget.dataset.value);

}
  setCurMarketDay = async() =>{

    try{
    const sessionMd = this.props.sessionMd;
    const GetDailyChallengeConfigReq = new GetDailyChallengeConfigRequest();
    const resp = await DalalActionService.getDailyChallengeConfig(GetDailyChallengeConfigReq,sessionMd);
    const market_day = resp.getMarketDay();
    if(market_day!=0){
    this.setState({
      curMarketDay: market_day,
      dispMarketDay:market_day
    })
    }
    
    } catch(e){
      console.log("Error happened while updating curMarket day! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! curMarket " + e.statusMessage);
          }

    }
  }
  
  componentDidMount = async() =>{
    await this.setCurMarketDay();
    this.intialTimeline();
    await this.displayDailyChallenge(this.state.curMarketDay);
  }
  
  componentDidUpdate= async(prevProps:DailyChallengesProps) =>{
   if(prevProps.isDailyChallengeOpen!=this.props.isDailyChallengeOpen){
    await this.displayDailyChallenge(this.state.dispMarketDay);
    await this.setCurMarketDay();
    this.intialTimeline();
    await this.displayDailyChallenge(this.state.curMarketDay);

   }
  }

  render(){
    
    return (
      <Fragment>
        <div className="row" id="top_bar">
          <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth={this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} isBlocked={this.props.isBlocked} />
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


        <div className="content-div">

        <div className="ui equal width center aligned padded grid">
          <div className="row">
            <div className="fourteen wide column timeline-row">
            <p id="challenge-list">LIST OF CHALLENGES</p>
            <div className="timeline">
            <div className="events">
              <ol>
                <ul>
                  {this.state.timeline}
                </ul>
              </ol>
            </div>
          </div>
          <p className="ital">Get an edge over the other!</p>
          </div>
          <div className="two wide column progress">

          </div> 
            </div>
          
            {this.state.DailyChallenges}
  
          
          </div>
        </div>

      </Fragment>
    )



    }

}

    