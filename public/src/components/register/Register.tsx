import * as React from "react";
import { RegisterForm } from "./RegisterForm";

import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { RegisterResponse } from "../../../proto_build/actions/Register_pb";

export interface RegisterProps {
    // Passes response back to app for setting state
    registerSuccessHander: (resp: RegisterResponse) => void
    loginRedirect: () => void
}
//All Error handling setting localstorage happens here
//the only thing passed back is the resp
export class Register extends React.Component<RegisterProps, {}>{

    loginSuccessHandler = (resp: RegisterResponse) => {
        this.props.registerSuccessHander(resp!);
    }

    render() {
        return (
            <div>
                <div id="login-container">
                    <div className="ui middle aligned center aligned grid custom-checker ">
                        <div className="fakecolumn column">
                            <h2 className="ui header inverted">
                                <div className="content">
                                   Register
                            </div>
                            </h2>
                            <RegisterForm registerSuccessHander={this.loginSuccessHandler} />
                            <div className="ui message">
                                Already a member? <a className="register-hover" onClick={this.props.loginRedirect}>Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}