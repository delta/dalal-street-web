import * as React from 'react';
import { grpc } from "@improbable-eng/grpc-web";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { OpenMarketRequest } from "../../../proto_build/actions/OpenMarket_pb";
import { CloseMarketRequest } from "../../../proto_build/actions/CloseMarket_pb";

export interface MarketStateProps{
    sessionMd: grpc.Metadata,
    isMarketOpen: boolean
}
export interface MarketStateState{
    marketState: boolean
}
export class MarketState extends React.Component<MarketStateProps, MarketStateState> {
    constructor(props: MarketStateProps) {
        super(props);      
        this.state = {
          marketState: false
        }
    }

    handleOptionChange = () => {
      let marketState = $('#marketState1').is(":checked");
      this.setState(prevState => {
			  return {
          marketState: marketState
			  }
      });
    }

    handleOpenMarket = async (e:any) =>{
        const marketState = this.state.marketState;
        const sessionMd = this.props.sessionMd;
        // open Market
        const MarketRequest = new OpenMarketRequest();
        try{
          MarketRequest.setUpdateDayHighAndLow(marketState);
          const resp = await DalalActionService.openMarket(MarketRequest, sessionMd);
          // If any error occurs, it will be raised in DalalMessage_pb_Service
          showNotif("Market has been successfully opened");
          this.setState(prevState => {
            return {
              marketState: false
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
        const marketState = this.state.marketState;
        const sessionMd = this.props.sessionMd;
        // close Market
        const MarketRequest = new CloseMarketRequest();
        try{
          MarketRequest.setUpdatePrevDayClose(marketState);
          const resp = await DalalActionService.closeMarket(MarketRequest, sessionMd);
          // If any error occurs, it will be raised in DalalMessage_pb_Service
          showNotif("Market has been successfully closed!");
          this.setState(prevState => {
            return {
              marketState: false
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
                         <input type="radio" id="marketState1" name="marketState" onChange={(e) => {this.handleOptionChange()}} checked={this.state.marketState}/>Yes
                         <span className="radiocheckmark"></span>
                        </label>
                        <label className="radiolabel">
                         <input type="radio" id="marketState2" name="marketState" onChange={(e) => {this.handleOptionChange()}} checked={!this.state.marketState}/>No
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                       <input type="button" disabled={this.props.isMarketOpen} className={"ui inverted green button"} onClick={(e) => {this.handleOpenMarket(e)}} value="Open Market"/>
                      </td>
                      <td>
                      <input type="button" disabled={!this.props.isMarketOpen} className={"ui inverted red button"} onClick={(e) => {this.handleCloseMarket(e)}} value="Close Market"/>
                      </td>
                    </tr>
                    </tbody>
                </table>
            </React.Fragment>	   
        );
    }
}

