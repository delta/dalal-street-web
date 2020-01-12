import * as React from 'react';
import { ForgotPasswordRequest, ForgotPasswordResponse } from "../../../proto_build/actions/ForgotPassword_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface FormState {
    email: string,
    disabled: boolean,
    error: string | null,
    successful: boolean
}

export class ForgotPasswordForm extends React.Component<any, FormState>{

    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            disabled: false,
            error: null,
            successful: false
        }

    }
    handleSubmit = async () => {
        this.setState({
            disabled: true
        })

        const forgotPasswordRequest = new ForgotPasswordRequest();
        forgotPasswordRequest.setEmail(this.state.email);

        try {
            const resp = await DalalActionService.forgotPassword(forgotPasswordRequest);
            this.setState({
                error: "Temporary password has been sent to your registered Email Id.",
                successful: true
            })


        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
                successful: false
            });
        }

        this.setState({
            disabled: false,
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
                            {this.state.disabled ?
                                <div className="ui fluid large teal submit disabled button">Submit</div> :
                                <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Submit</div>
                            }
                            {this.state.error != null && !this.state.successful && <div className="ui negative bottom attached message">
                                <i className="icon error"></i>
                                {this.state.error}
                            </div>}
                            {this.state.error != null && this.state.successful && <div className="ui positive bottom attached message">
                                <i className="icon error"></i>
                                {this.state.error}
                            </div>}
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
