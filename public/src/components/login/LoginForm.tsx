import * as React from "react";
import { LoginRequest, LoginResponse, } from "../../../proto_build/actions/Login_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface LoginFormProps {
    loginHandler: Function
    error: String | null
}

export interface LoginFormState {
    email: string,
    password: string,
    disabled: boolean,
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState>{
    constructor(props: LoginFormProps) {
        super(props)
        this.state = {
            password: "dalalkeliye",
            email: "106115021@nitt.edu",
            disabled: false
        }
    }
    log = () => {
        this.handleLogin()
    }

    handleLogin = async () => {
        try {
            this.setState({
                disabled: true,
            });
            const loginRequest = new LoginRequest();
            loginRequest.setEmail(this.state.email);
            loginRequest.setPassword(this.state.password);
            const resp = await this.login(loginRequest);
            this.setState({
                disabled: false,
            });
            if (resp == null) {
                this.props.loginHandler(null, "No response from server")
                return
            }
            if (resp.getStatusCode() == LoginResponse.StatusCode.OK)
                this.props.loginHandler(resp, null)
            else {
                this.props.loginHandler(null, resp.getStatusMessage())
            }
        } catch (e) {
            this.props.loginHandler(null, e.statusMessage)
            this.setState({
                disabled: false,
            });
        }
    }

    login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        try {
            const resp = await DalalActionService.login(loginRequest);
            console.log(resp.getStatusCode(), resp.toObject());
            return resp
        }
        catch (e) {
            // error could be grpc error or Dalal error. Both handled in exception
            console.log("Error happened! ", e.statusCode, e.statusMessage);
            throw e;
        }
    }

    handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            email: this.state.email,
            password: event.currentTarget.value,
        })
    }

    handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            email: event.currentTarget.value,
            password: this.state.password,
        })
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
                            <div className="ui fluid large teal submit disabled button" onClick={this.log}>Login</div> :
                            <div className="ui fluid large teal submit button" onClick={this.log}>Login</div>
                        }
                    </div>
                </form>
                {this.props.error != null && <div className="ui negative bottom attached message">
                    <i className="icon help"></i>
                    {this.props.error}
                </div>}
            </div>
        );
    }
}