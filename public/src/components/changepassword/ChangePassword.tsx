import * as React from "react";
import { grpc } from "@improbable-eng/grpc-web";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { ChangePasswordForm } from "./ChangePasswordForm";

export interface changePasswordProps {
    loginRedirect: () => void
}

export class ChangePassword extends React.Component<changePasswordProps, any> {
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
                            <div className="ui message">
                                <a className="register-hover" onClick={this.props.loginRedirect}>Go to Login</a><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
