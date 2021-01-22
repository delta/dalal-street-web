import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { AddMarketEventRequest } from "../../../proto_build/actions/AddMarketEvent_pb";
import { UpdateEndOfDayValuesRequest } from "../../../proto_build/actions/UpdateEndOfDayValues_pb";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";

declare var $: any;

export interface MarketEventProps{
    sessionMd: Metadata
}

export class MarketEvent extends React.Component<MarketEventProps,{}> {
    constructor(props: MarketEventProps) {
        super(props);  
    }

    setMarketEvent = async () => {
       const sessionMd = this.props.sessionMd;
       const currentStockId = $('#event-stockid').val() as number;
       const headLine = $('#event-headline').val() as string;
       const eventText = $('#event-text').val() as string;
       const imageURL = $('#event-imgurl').val() as string;
       const isGlobal = currentStockId===0 ? true : false;
       const addEventReq= new AddMarketEventRequest();
       if(headLine.length!=0 && eventText.length!=0){
         try{
           addEventReq.setStockId(currentStockId);
           addEventReq.setHeadline(headLine);
           addEventReq.setText(eventText);
           addEventReq.setImageUrl(imageURL);
           addEventReq.setIsGlobal(isGlobal);
           const resp = await DalalActionService.addMarketEvent(addEventReq, sessionMd);
           // If any error occurs, it will be raised in DalalMessage_pb_Service
           showNotif("Notification has been sent successfully!");
           $('#event-stockid').val('');
           $('#event-headline').val('');
           $('#event-text').val('');
           $('#event-imgurl').val('');
         }catch(e){
           console.log("Error happened while setting Market Event! ", e.statusCode, e.statusMessage, e);
           if (e.isGrpcError) {
              showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
           } else {
              showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
           } 
         }
       }
       else{
          showErrorNotif("Fields cant be empty!");
       }
    }
    
    updateEndOfDayValue = async () => {
      const updateEndOfDayValue = new UpdateEndOfDayValuesRequest();
      try {
        await DalalActionService.updateEndOfDayValues(updateEndOfDayValue);
      } catch (error) {
        console.log("Something went wrong, ", error);
      }
    }

    render() {
        return (
            <React.Fragment>
            <table id="event-table">
                <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                        <td>
                          <input type="integer" className="market-input" id="event-stockid" placeholder="0" />
                        </td>
                        <td>
                          <input type="text" className="notify-text" id="event-headline" placeholder="Headline" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                          <input type="text" className="notify-text" id="event-text" placeholder="Text" />
                        </td>
                        <td>
                          <input type="text" className="notify-text" id="event-imgurl" placeholder="Image URL" /> 
                        </td>
                    </tr>
                    <tr>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.setMarketEvent} value="Set Market Event"/>
                        </td>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.setMarketEvent} value="Update End of Day Value"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>	   
        );
    }
}