import * as React from 'react';
import { ForgotPasswordRequest } from "../../../proto_build/actions/ForgotPassword_pb";
import { ChangePasswordRequest } from "../../../proto_build/actions/ChangePassword_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface FormState {

    error: string | null,
    disabled: boolean,
    temp_password: string,
    new_password: string,
    confirm_new_password: string
    successful: boolean

}

export class ChangePasswordForm extends React.Component<any, FormState>{

    constructor(props: any) {
        super(props);
        this.state = {
            temp_password: "",
            new_password: "",
            confirm_new_password: "",
            disabled: false,
            error: null,
            successful: false

        }

    }

    handleValidation = (): string => {
        let errorMsg = "";
        if (this.state.confirm_new_password != this.state.new_password) {
            
            errorMsg="Password doesnt match!"
        }
        else if (this.state.temp_password.length == 0)
        {
            errorMsg="Please fill the temporary password";
        }
        else if (this.state.new_password.length < 6) {
            // Non-empty password check
            errorMsg = "Password should be at least 6 characters excluding leading or trailing whitespaces";
        }
        return errorMsg;
    }

    handleSubmit = async () => {
        this.setState({
            disabled: true
        })

         let error=this.handleValidation();

         if(error.length>0)
         {
             this.setState({
                 error:error,
                 successful:false,
                 disabled:false
             })
             return
         }

            const changepasswordrequest = new ChangePasswordRequest();
            changepasswordrequest.setTemppassword(this.state.temp_password);
             changepasswordrequest.setNewpassword(this.state.new_password);
            this.handleChangePassword(changepasswordrequest);


            this.setState({
                disabled: false,
            });
        
        
    }
    handleChangePassword = async (changepasswordrequest: ChangePasswordRequest) => {



        try {
            let resp = await DalalActionService.changePassword(changepasswordrequest);
            console.log(resp);
            this.setState({
                error: "Password changed successfully!",
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
            temp_password: event.currentTarget.value
        })
    }
    handleNewPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            new_password: event.currentTarget.value
        });
    }
    handleConfirmNewPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            confirm_new_password: event.currentTarget.value
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
                                <input type="text" name="temp_password" placeholder="Temporary Password" onChange={this.handleTempPasswordChange} value={this.state.temp_password} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="password" name="new_password" placeholder="New Password" onChange={this.handleNewPasswordChange} value={this.state.new_password} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={this.handleConfirmNewPasswordChange} value={this.state.confirm_new_password} />
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