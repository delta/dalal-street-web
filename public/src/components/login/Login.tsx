import * as React from "react";
import { LoginForm } from "./LoginForm"
export interface LoginProps {
    loginHandler: Function
    error: String | null
}
export class Login extends React.Component<LoginProps, {}>{
    constructor(props: LoginProps) {
        super(props)
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
                            <LoginForm loginHandler={this.props.loginHandler} error={this.props.error} />
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