import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { OpenMarketRequest } from "../../../proto_build/actions/OpenMarket_pb";
import { CloseMarketRequest } from "../../../proto_build/actions/CloseMarket_pb";

export interface MarketStateProps{
    sessionMd: Metadata,
    isMarketOpen: boolean
}
export interface MarketStateState{
    option: string
}
export class MarketState extends React.Component<MarketStateProps, MarketStateState> {
    constructor(props: MarketStateProps) {
        super(props);      
        this.state = {
            option: "No"
        }
    }

    handleOptionChange = (e:any) => {
        this.setState(prevState => {
			return {
				option: e
			}
        });
    }
    
    handleMarketState = async (e:any) =>{
        const option = this.state.option=="Yes" ? true : false;
        const sessionMd = this.props.sessionMd;
        if(this.props.isMarketOpen){
          // close Market
          const MarketRequest = new CloseMarketRequest();
          try{
            MarketRequest.setUpdatePrevDayClose(option);
            const resp = await DalalActionService.closeMarket(MarketRequest, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showNotif("Market has been successfully closed!");
            this.setState(prevState => {
                return {
                    option: "No"
                }
            });
          }catch(err){
            console.log("Error happened while Closing Market! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
          }
        }
        else{
          // open Market
          const MarketRequest = new OpenMarketRequest();
          try{
            MarketRequest.setUpdateDayHighAndLow(option);
            const resp = await DalalActionService.openMarket(MarketRequest, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showNotif("Market has been successfully opened");
            this.setState(prevState => {
                return {
                    option: "No"
                }
            });
          }catch(err){
            console.log("Error happened while Opening Market! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
          }
        }
    }

    render() {
        let marketStatus = this.props.isMarketOpen ? "red" : "green";
        return (
            <React.Fragment>
                <table id="MarketState">
                    <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                      <td>
                        <label>{this.props.isMarketOpen ? "Do you want to update Previous Day Close ?" : "Do you want to update Day`s high and low ?"}</label>
                      </td>
                      <td>
                        <label className="radiolabel">
                         <input type="radio" value="Yes" onChange={(e) => {this.handleOptionChange(e.target.value)}} checked={this.state.option === "Yes"}/>Yes
                         <span className="radiocheckmark"></span>
                        </label>
                        <label className="radiolabel">
                         <input type="radio" value="No" onChange={(e) => {this.handleOptionChange(e.target.value)}} checked={this.state.option == "No"}/>No
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                    </tr>
                    <tr>
                       <input type="button" className={"ui inverted " + marketStatus + " button"} onClick={(e) => {this.handleMarketState(e)}} value={this.props.isMarketOpen ? "Close Market" : "Open Market"}/>
                    </tr>
                    </tbody>
                </table>
            </React.Fragment>	   
        );
    }
}

