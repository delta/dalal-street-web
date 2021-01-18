import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { UnblockUserRequest } from "../../../proto_build/actions/UnblockUser_pb"
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";

export interface UnBlockUserState {
    userId: number

}

export interface UnBlockUserProps{
    sessionMd: Metadata,   
}

export class UnBlockUser extends React.Component<UnBlockUserProps,UnBlockUserState> {
    constructor(props: UnBlockUserProps) {
        super(props);      
        this.state = {
            userId: 0,
        }

    }

    handleUnBlockUser = () =>{

        let unBlockUserRequest = new UnblockUserRequest();
        if(this.state.userId > 0)
        {
            unBlockUserRequest.setUserId(Number(this.state.userId));    
            this.unBlockUser(unBlockUserRequest);            
        }
        else{

            return ;
        }
    }
    
    unBlockUser = async(unBlockUserRequest: UnblockUserRequest) =>{
         try{
            const resp = await DalalActionService.unBlockUser(unBlockUserRequest,this.props.sessionMd);
            showNotif("User id "+this.state.userId+" is unblocked successfully");
            this.setState({
                userId: 0,
            })
         }
         catch(e)
         {
            console.log("Error happened while blocking User! ", e.statusCode, e.statusMessage, e);
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
                        <td >
                        <div className="ui inverted input">
                            <input type="number"  placeholder="User Id" onChange={this.handleUserIdChange} value={String(this.state.userId)} />
                        </div>
                        </td>
                        <td>
                        
                            <input type="button" className="ui inverted green button" onClick={this.handleUnBlockUser} value="UnBlock User" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>	   
   
        );
    }
}

