import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import {ChangePasswordForm} from "./changepasswordform";





export class ChangePassword extends React.Component<any,any> {
    constructor(props: any) {
        super(props);
     

    }

    render() {
        return (
            <div>
                <div id="login-container">
                    <div className="ui middle aligned center aligned grid custom-checker ">
                        <div className="fakecolumn column">
                            <h2 className="ui inverted header">
                                <div className="content">
                                    Enter your temporary password from your email and type your new password below !
                                </div>
                            </h2>
                            <ChangePasswordForm />
                         
                          
                        </div>
                    </div>
                </div>
            </div>
           
        )
    }
}

