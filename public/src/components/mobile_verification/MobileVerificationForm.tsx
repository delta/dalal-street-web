import * as React from "react";
import { Metadata } from "grpc-web-client";
import { AddPhoneRequest, AddPhoneResponse } from "../../../proto_build/actions/AddPhone_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { VerifyOTPRequest } from "../../../proto_build/actions/VerifyOTP_pb";
import { CountryTelCode } from "../countrycode/CountryTelCode";
import {Timer} from "./Timer";
import { showSuccessNotif } from "../../utils";

export interface MobileVerificationFormState {

    mobileNumber: string
    otp: string
    countryCode: string|null
    mobileStatus: boolean
    mobileInputDisable: boolean
    successful: boolean
    disabled: boolean
    error: string | null
    resendOtp: boolean
    resetTimer: boolean
}

export interface MobileVerificationFormProps {
    sessionMd: Metadata
    updatePhoneVerifiedState: () => void
    updateCash: (arg0: number) => void
}

export class MobileVerificationForm extends React.Component<MobileVerificationFormProps, MobileVerificationFormState> {
    constructor(props: MobileVerificationFormProps) {
        super(props);
        this.state= {
            mobileNumber: "",
            otp: "",
            countryCode: "",
            mobileStatus: false,
            mobileInputDisable: false,
            successful: false,
            disabled: false,
            error: null,
            resendOtp: false,
            resetTimer: true
        }
    }

    validateInput = (): string =>{
        let errorMsg : string = "";
       if(this.state.countryCode== "" )
       {
         errorMsg = "Please Select the country code";
       }
       if(this.state.mobileNumber== "" )
       {
           errorMsg = "Please input the phone number";
       }

       return errorMsg;
    }

    handleOTPSubmit = async () => {
        this.setState({
            disabled: true
        })
        const verifyOtpRequest = new VerifyOTPRequest();
        let fullPhoneNumber = this.state.countryCode+this.state.mobileNumber;
        verifyOtpRequest.setOtp(Number(this.state.otp));
        verifyOtpRequest.setPhone(fullPhoneNumber);
        this.VerifyOTP(verifyOtpRequest);
    }
    VerifyOTP = async(verifyOtpRequest: VerifyOTPRequest) =>{
        try {
            const resp = await DalalActionService.verifyPhone(verifyOtpRequest,this.props.sessionMd);
            this.setState({
                error: "Phone number registered successfully,all features will be unlocked now ",
                successful: true
            })
            this.props.updateCash(resp.getUserCash())
            this.props.updatePhoneVerifiedState();
            console.log(resp.getUserCash())
            showSuccessNotif("Phone Number verified successfully");

        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
                successful: false
            })
        }

        this.setState({
            disabled: false
        })
    }

    handleNumberSubmit = async () => {
        this.setState({
            disabled: true,
        })

       let error = this.validateInput();
         if(error.length>0)
         {
              this.setState({
                  error: error,
                  successful: false,
                  disabled: false,
              })
             return ;
         }


        const addPhoneRequest = new AddPhoneRequest();
        let fullPhoneNumber = this.state.countryCode+this.state.mobileNumber;
        addPhoneRequest.setPhonenumber(fullPhoneNumber);
        this.SendOTP(addPhoneRequest,"Fill the OTP sent your mobile number ");

    }
    SendOTP = async(addPhoneRequest: AddPhoneRequest,errMsg: string) => {
        try {
            const resp = await DalalActionService.addPhone(addPhoneRequest,this.props.sessionMd);
            this.setState({
                mobileStatus: true,
                successful: true,
                error: errMsg,
                mobileInputDisable: true,
            })

        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to reach server. Please check your internet connection." : e.statusMessage,
                successful: false,
                resetTimer: false
            })
        }

        this.setState({
            disabled: false,
            resetTimer: false,
        })
    }
    handleResendOTPSubmit = async () =>{
        this.setState({
            disabled: true,
            resetTimer: true,
            resendOtp: false,
        })

        const addPhoneRequest = new AddPhoneRequest();
        let fullPhoneNumber = this.state.countryCode+this.state.mobileNumber;
        addPhoneRequest.setPhonenumber(fullPhoneNumber);
        
        this.SendOTP(addPhoneRequest,"New OTP sent your mobile Number Successfully");
    }
    handleMobileNumberChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            mobileNumber: event.currentTarget.value
        });
    }
    handleOTPChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            otp: event.currentTarget.value
        });
    }
    handleChangeNumber = () => {
        this.setState({
            mobileInputDisable: false
        })
    }
   handleCountryCodeChange = (country: string|null) =>{
        this.setState({
            countryCode: country
        })
    }
    handleResendOtpCallback = () => {
         this.setState({
             resendOtp: true,
             resetTimer: false
        })
    }

    render() {
        return (
            <div>
                <div className="ui large form">
                    <div className="ui attatched stacked secondary segment " id="mobile-large">
                        <div className="field">
                            {this.state.mobileInputDisable ?
                                <div className="ui left icon input">
                                   <CountryTelCode disabled={true} countryCode={this.handleCountryCodeChange}/>
                                    <input type="text" className="mobile" name="mobile_number" placeholder="Mobile Number" disabled={true} value={this.state.mobileNumber} />
                                </div> :
                                <div className="ui left icon input">
                                   <CountryTelCode disabled={false} countryCode={this.handleCountryCodeChange} />
                                    <input type="text" className="mobile" name="mobile_number" placeholder  ="Mobile Number" onChange={this.handleMobileNumberChange} value={this.state.mobileNumber} />
                                </div>
                            }
                        </div>
                        { this.state.mobileStatus  &&
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon"></i>
                                    <input type="number" name="otp" placeholder="OTP" onChange={this.handleOTPChange} value={this.state.otp} />
                                </div>
                            </div>
                        }
                        {!this.state.mobileStatus && <div>
                            {this.state.disabled ?
                                <div className="ui fluid large teal submit disabled button">Get OTP</div> :
                                <div className="ui fluid large teal submit button" onClick={this.handleNumberSubmit}>Get OTP</div>
                            }
                        </div>
                         }
                        {this.state.mobileStatus && <div>
                            {this.state.disabled ?
                                <div className="ui fluid large teal submit disabled button">Change Phone Number</div> :
                                <div className="ui fluid large teal submit button" onClick={this.handleChangeNumber} >Change Phone Number</div>
                            }
                             {this.state.disabled || !this.state.resendOtp ?
                                <div className="ui fluid large teal submit disabled button"><Timer
                                    handleResendOtpCallback={this.handleResendOtpCallback}
                                    resetTimer={this.state.resetTimer}>
                                  </Timer></div> :
                                <div className="ui fluid large teal submit button" onClick={this.handleResendOTPSubmit}><Timer
                                    handleResendOtpCallback={this.handleResendOtpCallback}
                                    resetTimer={this.state.resetTimer}>
                                </Timer></div>
                            }
                            {this.state.disabled ?
                                <div className="ui fluid large teal submit disabled button">Verify OTP</div> :
                                <div className="ui fluid large teal submit button" onClick={this.handleOTPSubmit}>Verify OTP</div>
                            }
                        </div>
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
