import * as React from 'react';
import { ForgotPasswordRequest } from "../../../proto_build/actions/ForgotPassword_pb";
import { ChangePasswordRequest } from "../../../proto_build/actions/ChangePassword_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface FormState {

    error: string | null,
    disabled: boolean,
    tempPassword: string,
    newPassword: string,
    confirmNewPassword: string
    successful: boolean

}

export class ChangePasswordForm extends React.Component<any, FormState>{

    constructor(props: any) {
        super(props);
        this.state = {
            tempPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            disabled: false,
            error: null,
            successful: false

        }
    }
    handleValidation = (): string => {
        let errorMsg = "";
        if (this.state.confirmNewPassword != this.state.newPassword) {

            errorMsg = "Password doesn't match!"
        }
        else if (this.state.tempPassword.length == 0) {
            errorMsg = "Please fill the temporary password";
        }
        else if (this.state.newPassword.length < 6) {
            // Non-empty password check
            errorMsg = "Password should be at least 6 characters excluding leading or trailing whitespaces";
        }
        return errorMsg;
    }

    handleSubmit = async () => {
        this.setState({
            disabled: true
        })

        let error = this.handleValidation();

        if (error.length > 0) {
            this.setState({
                error: error,
                successful: false,
                disabled: false
            })
            return
        }
        const changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setTempPassword(this.state.tempPassword);
        changePasswordRequest.setNewPassword(this.state.newPassword);
        changePasswordRequest.setConfirmPassword(this.state.confirmNewPassword);
        this.handleChangePassword(changePasswordRequest);

        this.setState({
            disabled: false,
        });
    }
    handleChangePassword = async (changePasswordRequest: ChangePasswordRequest) => {

        try {
            let resp = await DalalActionService.changePassword(changePasswordRequest);
            console.log(resp);
            this.setState({
                error: "Password changed successfully ! Please click the link below to login",
                successful: true
            })
        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
                successful: false
            });
        }
    }

    handleTempPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            tempPassword: event.currentTarget.value
        })
    }
    handleNewPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            newPassword: event.currentTarget.value
        });
    }
    handleConfirmNewPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            confirmNewPassword: event.currentTarget.value
        });
    }
    render() {
        return (

            <div>
                <div className="ui large form">
                    <div className="ui attatched stacked secondary segment">
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="text" name="temp_password" placeholder="Temporary Password" onChange={this.handleTempPasswordChange} value={this.state.tempPassword} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="password" name="new_password" placeholder="New Password" onChange={this.handleNewPasswordChange} value={this.state.newPassword} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={this.handleConfirmNewPasswordChange} value={this.state.confirmNewPassword} />
                            </div>
                        </div>
                        {this.state.disabled ?
                            <div className="ui fluid large teal submit disabled button">Change Password</div> :
                            <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Change Password</div>
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
            </div>
        )
    }
}
