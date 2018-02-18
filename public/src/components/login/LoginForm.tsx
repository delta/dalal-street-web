import * as React from "react";
import { LoginRequest, LoginResponse, } from "../../../proto_build/actions/Login_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface LoginFormProps {
    loginSuccessHandler: (resp: LoginResponse) => void
}

export interface LoginFormState {
    email: string,
    password: string,
    disabled: boolean,
    error: string | null,
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState>{
    constructor(props: LoginFormProps) {
        super(props)
        this.state = {
            password: "",
            email: "",
            disabled: false,
            error: null,
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
                error: e.IsGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
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

    render() {
        return (
            <div>
                <form className="ui large form">
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
                            <div className="ui fluid large teal submit disabled button">Login</div> :
                            <div className="ui fluid large teal submit button" onClick={this.handleLogin}>Login</div>
                        }
                    </div>
                </form>
                {this.state.error != null && <div className="ui negative bottom attached message">
                    <i className="icon error"></i>
                    {this.state.error}
                </div>}
            </div>
        );
    }
}