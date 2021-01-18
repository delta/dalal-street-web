import * as React from "react";
import { grpc } from "@improbable-eng/grpc-web";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ForgotPasswordResponse } from "../../../proto_build/actions/ForgotPassword_pb";

export interface forgotpasswordProps {
    signUpRedirect: () => void
    loginRedirect: () => void
}

export class Forgotpassword extends React.Component<forgotpasswordProps, any> {
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
                                    Enter your registered email address
                                </div>
                            </h2>
                            <ForgotPasswordForm />
                            <div className="ui message">
                                <a className="register-hover" onClick={this.props.loginRedirect}>Go to Login</a><br />
                            </div>
                            <div className="ui message">
                                New to us? <a className="register-hover" onClick={this.props.signUpRedirect} >Register</a>
                            </div>
                            <div className="ui message warning">
                                <div className="content">
                                    Already registered on Pragyan or NITT Webmail? You can use the same credentials to login.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
