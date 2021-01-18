import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import {MobileVerificationForm} from "./MobileVerificationForm";

export interface MobileVerificationProps {
    sessionMd: Metadata
    updatePhoneVerified: () => void
    updateCash: (arg0: number) => void
}

export class MobileVerification extends React.Component<MobileVerificationProps,any> {
    constructor(props: MobileVerificationProps) {
        super(props);
     }
     handleIsPhoneVerified = () =>{
          this.props.updatePhoneVerified();
     }
     render() {
        return (
            <div>
            <div id="mobile-container-large">
                <div className="ui middle aligned center aligned grid custom-checker ">
                    <div className="fakecolumn column">
                        <h2 className="ui inverted header">
                            <div className="content" >
                                Enter your registered Mobile Number
                            </div>
                        </h2>
                        <MobileVerificationForm sessionMd={this.props.sessionMd} updatePhoneVerifiedState={this.handleIsPhoneVerified} updateCash={this.props.updateCash}/>
                       
                    </div>
                </div>
            </div>
        </div>
           )
    }
}
