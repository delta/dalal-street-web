import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { BlockUserRequest } from "../../../proto_build/actions/BlockUser_pb"
import { showNotif, showErrorNotif, isPositiveInteger, closeNotifs } from "../../utils";

export interface BlockUserState {
    userId: number

}

export interface BlockUserProps{
    sessionMd: Metadata,   
}

export class BlockUser extends React.Component<BlockUserProps,BlockUserState> {
    constructor(props: BlockUserProps) {
        super(props);      
        this.state = {
            userId: 0,
        }

    }

    handleBlockUser = () =>{

        let blockUserRequest = new BlockUserRequest();
        if(this.state.userId > 0)
        {
            blockUserRequest.setUserId(Number(this.state.userId));    
            this.blockUser(blockUserRequest);            
        }
        else{

            return ;
        }
    }
    
    blockUser = async(blockUserRequest: BlockUserRequest) =>{
         try{
            const resp = await DalalActionService.blockUser(blockUserRequest,this.props.sessionMd);
            showNotif("User id "+this.state.userId+" is blocked successfully");
            this.setState({
                userId:0
            })

         }
         catch(e)
         {
            console.log("Error happened while unblocking User! ", e.statusCode, e.statusMessage, e);
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
                                <input type="button" className="ui inverted red button" onClick={this.handleBlockUser} value="Block User" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>	   
        );
    }
}

