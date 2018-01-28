import * as React from "react";
import { LoginForm } from "./LoginForm";

import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { LoginRequest, LoginResponse } from "../../../proto_build/actions/Login_pb";

export interface LoginProps {
    loginSuccessHandler: (resp: LoginResponse) => void
}

export class Login extends React.Component<LoginProps, {}>{

    static getLoginResponseFromSession = async (): Promise<LoginResponse> => {
        const sessionId = localStorage.getItem("sessionid");

        if (sessionId == null) {
            throw new Error("Not already logged in");
        }

        const sessionMd = new Metadata({ "sessionid": sessionId });
        try {
            return await DalalActionService.login(new LoginRequest(), sessionMd);
        }
        catch (e) {
            // error could be grpc error or Dalal error. Both handled in exception
            console.log("Error happened! ", e.statusCode, e.statusMessage);
            throw e;
        }
    }

    loginSuccessHandler = (resp: LoginResponse) => {
        window.localStorage.setItem("sessionid", resp.getSessionId());
        this.props.loginSuccessHandler(resp!);
    }

    render() {
        return (
            <div>
                <div id="login-container">
                    <div className="ui middle aligned center aligned grid custom-checker ">
                        <div className="fakecolumn column">
                            <h2 className="ui header inverted">
                                <div className="content">
                                    Login to your account
                            </div>
                            </h2>
                            <LoginForm loginSuccessHandler={this.loginSuccessHandler} />
                            <div className="ui message">
                                New to us?
                            <a href="https://www.pragyan.org/18/home/+login&subaction=register">Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}