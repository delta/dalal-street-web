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
    option: boolean
}
export class MarketState extends React.Component<MarketStateProps, MarketStateState> {
    constructor(props: MarketStateProps) {
        super(props);      
        this.state = {
            option: false
        }
    }

    handleOptionChange = () => {
      let option = $('#option1').is(":checked");
      this.setState(prevState => {
			  return {
			   	option: option
			  }
      });
    }

    handleOpenMarket = async (e:any) =>{
        const option = this.state.option;
        const sessionMd = this.props.sessionMd;
        // open Market
        const MarketRequest = new OpenMarketRequest();
        try{
          MarketRequest.setUpdateDayHighAndLow(option);
          const resp = await DalalActionService.openMarket(MarketRequest, sessionMd);
          // If any error occurs, it will be raised in DalalMessage_pb_Service
          showNotif("Market has been successfully opened");
          // showNotif("Market has been successfully!");
          this.setState(prevState => {
            return {
                option: false
            }
          });
        }catch(e){
          console.log("Error happened while Opening Market! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
        }
    }
 
    handleCloseMarket = async (e:any) =>{
        const option = this.state.option;
        const sessionMd = this.props.sessionMd;
        // close Market
        const MarketRequest = new CloseMarketRequest();
        try{
          MarketRequest.setUpdatePrevDayClose(option);
          const resp = await DalalActionService.closeMarket(MarketRequest, sessionMd);
          // If any error occurs, it will be raised in DalalMessage_pb_Service
          showNotif("Market has been successfully closed!");
          this.setState(prevState => {
            return {
                option: false
            }
          });
        }catch(e){
          console.log("Error happened while Closing Market! ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
            showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
            showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
        }
    }

    render() {
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
                         <input type="radio" id="option1" onChange={(e) => {this.handleOptionChange()}} checked={this.state.option}/>Yes
                         <span className="radiocheckmark"></span>
                        </label>
                        <label className="radiolabel">
                         <input type="radio" id="option2" onChange={(e) => {this.handleOptionChange()}} checked={!this.state.option}/>No
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                       <input type="button" disabled={this.props.isMarketOpen ? true : false} className={"ui inverted green button"} onClick={(e) => {this.handleOpenMarket(e)}} value="Open Market"/>
                      </td>
                      <td>
                      <input type="button" disabled={this.props.isMarketOpen ? false : true} className={"ui inverted red button"} onClick={(e) => {this.handleCloseMarket(e)}} value="Close Market"/>
                      </td>
                    </tr>
                    </tbody>
                </table>
            </React.Fragment>	   
        );
    }
}

