import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { InspectUserRequest } from "../../../proto_build/actions/InspectUser_pb";


export interface InspectUserProps{
    sessionMd: Metadata,
    stockBriefInfoMap: { [index: number]: StockBriefInfo } // get stock detail for a given stockid  
}

interface InspectUserState{
    UserId: number
    transType: boolean
}
 
export class InspectUser extends React.Component<InspectUserProps,InspectUserState> {
    constructor(props: InspectUserProps) {
        super(props);  
        this.state = {
            UserId: 0,
            transType: false
        }    
    }

    handleUserIdChange = (userID: React.FormEvent<HTMLInputElement>) => {
     
		 const newUserID = Number(userID.currentTarget.value);
         this.setState(prevState => {
			return {
				UserId: newUserID
			}
        });   
     };

     GetDetails = async () => {
        const inspectUserReq = new InspectUserRequest();
        const userId = this.state.UserId;
        const sessionMd = this.props.sessionMd;   
        const transtype =  this.state.transType;  
        try{
          inspectUserReq.setUserId(userId);
          inspectUserReq.setTransactionType(transtype)
          const resp = await DalalActionService.inspectUser(inspectUserReq, sessionMd);
          // If any error occurs, it will be raised in DalalMessage_pb_Service
          const res = resp.getListList()
          for(var i = 0 ;i < res.length;i++){
              console.log("id: ", res[i].getId()," email: ", res[i].getEmail()," Transaction Count: ", res[i].getTransactionCount()," Position: ", res[i].getPosition()," Stock sum ", res[i].getStockSum()," Reserved Stock sum ", res[i].getReservedstockSum());
          }
        }catch(e){
          console.log("Error happened while inspecting User ", e.statusCode, e.statusMessage, e);
          if (e.isGrpcError) {
              showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
          } else {
              showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
          }
        }
     }

     handleOptionChange = (e:any) => {
        const id = e.currentTarget.id
        // let type = $('#Bid').is(":checked");
        // console.log(type)
        this.setState( (prevState) => {
            console.log(id)

            if(id == "Bid"){
                return {
                    transType: true
                }
            }
            else{
                return {
                    transType: false
                }
            }
              
        });
      }
    
    render() {
       

        return (
            <React.Fragment>
            <table id="dividend-table">
                <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                     <td>
                        <label className="radiolabel">
                         <input type="radio" id="Ask" name="AskUser" onChange={this.handleOptionChange.bind(this)} checked={!this.state.transType}/>Ask User
                         <span className="radiocheckmark"></span>
                        </label>
                        <label className="radiolabel">
                         <input type="radio" id="Bid" name="BidUser" onChange={this.handleOptionChange.bind(this)} checked={this.state.transType}/>Bid User
                         <span className="radiocheckmark"></span>
                        </label>
                      </td>
                        <td>
                          <input type="integer" className="market-input" id="user-id" name="user-id" onChange={this.handleUserIdChange.bind(this)} placeholder = "User ID"/>
                        </td>
                        <td>
                          <input type="button" className="ui inverted green button" onClick={this.GetDetails.bind(this)}  value="Inspect User"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>	   
        );
    }
}

