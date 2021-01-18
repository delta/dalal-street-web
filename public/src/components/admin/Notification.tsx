import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { SendNotificationsRequest } from "../../../proto_build/actions/SendNotifications_pb";
import { isPositiveInteger } from "../../utils";

declare var $: any;

export interface NotificationsProps{
    sessionMd: Metadata
}

export interface NotificationsState{
    notificationState: boolean
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor(props: NotificationsProps) {
        super(props);
        this.state = {
          notificationState: true
        }      
    }

    handleOptionChange = () => {
      let notificationState = $('#notificationState1').is(":checked");
      this.setState(prevState => {
			  return {
			  	notificationState: notificationState
		  	}
      });
      if(notificationState){
        $('#user-id').val('');
      }
    }
    
    handleNotification = async (e:any) =>{
        const userId = $('#user-id').val() as number;
        const notifyText = $('#notify-text').val() as string;
        const notificationState = this.state.notificationState;
        const notificationUserId = notificationState ? 0 : userId;
        const sessionMd = this.props.sessionMd;
        if(isPositiveInteger(userId+1)){
          const NotificationsRequest = new SendNotificationsRequest();
          try{
            NotificationsRequest.setUserId(notificationUserId);
            NotificationsRequest.setIsglobal(notificationState);
            NotificationsRequest.setText(notifyText);
            const resp = await DalalActionService.sendNotifications(NotificationsRequest, sessionMd);
            // If any error occurs, it will be raised in DalalMessage_pb_Service
            showNotif("Notification has been sent successfully!");
            $('#notify-text').val('');
            $('#user-id').val('');
            this.setState(prevState => {
                return {
                  notificationState: true
                }
            });
          }catch(e){
            console.log("Error happened while sending Notifications! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
          } 
        }else{
            showErrorNotif("Enter a valid user Id!");
        }      
    }

    render() {
        return (
            <React.Fragment>
                <table id="Notification">
                    <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                      <td>
                        <label className="radiolabel">
                         <input type="radio" id="notificationState1" name="notificationState" onChange={(e) => {this.handleOptionChange()}} checked={this.state.notificationState}/>Send Notification to Everyone
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                      <td>
                        <label className="radiolabel">
                         <input type="radio" id="notificationState2" name="notificationState" onChange={(e) => {this.handleOptionChange()}} checked={!this.state.notificationState}/>Send Notification to an user
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input type="integer" disabled={this.state.notificationState} className="market-input" id="user-id" placeholder="0" />
                      </td>
                      <td>
                        <input type="text" id="notify-text" className="notify-text" placeholder="Enter a message here" />
                      </td>
                    </tr>
                    <tr>
                       <input type="button" className={"ui inverted green button"} onClick={(e) => {this.handleNotification(e)}} value={"Send Notification"}/>
                    </tr>
                    </tbody>
                </table>
            </React.Fragment>	   
        );
    }
}

