import * as React from "react";
import { LoginRequest, LoginResponse, } from "../../../proto_build/actions/Login_pb";
import { ResendVerificationEmailRequest, ResendVerificationEmailResponse } from "../../../proto_build/actions/ResendVerificationEmail_pb"
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface LoginFormProps {
    loginSuccessHandler: (resp: LoginResponse) => void
}

export interface LoginFormState {
    email: string,
    password: string,
    disabled: boolean,
    error: string | null,
    success: string | null,
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState>{
    constructor(props: LoginFormProps) {
        super(props)
        this.state = {
            password: "",
            email: "",
            disabled: false,
            error: null,
            success: null
        };
    }

    handleLogin = async () => {
        this.setState({
            disabled: true,
        });

        const loginRequest = new LoginRequest();
        loginRequest.setEmail(this.state.email);
        loginRequest.setPassword(this.state.password);

        try {
            const resp = await DalalActionService.login(loginRequest);
            this.props.loginSuccessHandler(resp);
        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
            });
        }

        this.setState({
            disabled: false,
        });
    }

    handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: event.currentTarget.value,
        });
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            email: event.currentTarget.value,
        });
    }

    handleResendVerificationEmail = async () => {

        const resendVerificationEmailRequest = new ResendVerificationEmailRequest();
        resendVerificationEmailRequest.setEmail(this.state.email);
        try {
            const resp = await DalalActionService.resendVerificationEmai(resendVerificationEmailRequest);
            this.setState({
                error: null,
                success: "Successfully resent verification Email"
            });
        } catch(err) {
            this.setState({
                error: err.isGrpcError ? "Unable to reach server. Please check your internet connection." : err.statusMessage,
            });
        }
    }

    render() {
        return (
            <div>
                <form className="ui large form" action="javascript:void(0)">
                    <div className="ui attatched stacked secondary segment">
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="text" name="email" placeholder="E-mail address" onChange={this.handleEmailChange} value={this.state.email} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="lock icon"></i>
                                <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange} value={this.state.password} />
                            </div>
                        </div>
                        {this.state.disabled ?
                            <button className="ui fluid large teal submit disabled button">Login</button> :
                            <button className="ui fluid large teal submit button" onClick={this.handleLogin}>Login</button>
                        }
                    </div>
                </form>
                { this.state.error != null &&<div className="ui negative bottom attached message">
                    <i className="icon error"></i>
                    { this.state.error === "User has not verified account" ? 
                    <span> Email hasn't been verified yet. <a className="register-hover" onClick={this.handleResendVerificationEmail} >Resend verification email.</a> </span> 
                    : this.state.error }
                </div> }
            </div>
        );
    }
}