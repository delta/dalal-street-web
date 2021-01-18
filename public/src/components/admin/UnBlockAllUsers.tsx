import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { UnblockAllUsersRequest } from "../../../proto_build/actions/UnblockAllUsers_pb"
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";

export interface UnBlockAllUsersProps{
    sessionMd: Metadata
}

export class UnBlockAllUsers extends React.Component<UnBlockAllUsersProps,{}> {
    constructor(props:UnBlockAllUsersProps) {
        super(props);      
    }

    handleUnBlockAll = () =>{

        let unBlockAllUsersRequest = new UnblockAllUsersRequest();
        this.unBlockAllUsers(unBlockAllUsersRequest)        
    }
    
    unBlockAllUsers = async(unBlockAllUsersRequest: UnblockAllUsersRequest) =>{
         try{
            const resp = await DalalActionService.unBlockAllUsers(unBlockAllUsersRequest,this.props.sessionMd);
            showNotif("All users are unblocked successfully");
         }
         catch(e)
         {
            console.log("Error happened while unblocking all Users! ", e.statusCode, e.statusMessage, e);
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
         }
    }

    handleUserIdChange = (event: React.FormEvent<HTMLInputElement>) =>{
       this.setState({
           userId: Number(event.currentTarget.value),
       })
    }
      render() {
        return (
            <React.Fragment>
            <table id="blockuser-table">
                <tbody className="ui bottom attached tab segment active inverted">
                    <tr>
                        <td>
                            <input type="button" className="ui inverted blue button" onClick={this.handleUnBlockAll} value="UnBlock All Users" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>	   
   
        );
    }
}

