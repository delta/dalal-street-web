import { Metadata } from "grpc-web-client";
import * as React from "react";
import { GetReferralCodeRequest } from "../../../proto_build/actions/GetReferralCode_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

interface ReferralProps {
  email: string;
  sessionMd: Metadata;
}

interface ReferralState {
  status: number;
  /*
   * 0 -> initial
   * 1 -> getting referral-code from server
   * 2 -> success
   * 3 -> error
   */
  referralCode: string;
  copyToClipBoard: boolean;
}

declare var $: any;

class Referral extends React.Component<ReferralProps, ReferralState> {
  constructor(props: ReferralProps) {
    super(props);
    this.state = {
      status: 0,
      referralCode: "",
      copyToClipBoard: true,
    };
  }

  showReferralCode = () => {
    $(".ui.modal.mini").modal("show");
  };

  hideReferralCode = () => {
    $(".ui.modal.mini").modal("hide");
  };

  handleGetCode = () => {
    const getReferralCodeRequest = new GetReferralCodeRequest();
    getReferralCodeRequest.setEmail(this.props.email);
    this.setState({ status: 1 });
    this.getReferralCode(getReferralCodeRequest);
  };

  getReferralCode = async (request: GetReferralCodeRequest) => {
    {
      try {
        const resp = await DalalActionService.getReferralCode(
          request,
          this.props.sessionMd
        );
        console.log(resp);
        this.setState({ referralCode: resp.getReferralCode(), status: 2 });
      } catch (err) {
        console.log("error while fetching referralCode. ", err);
        this.setState({ status: 3 });
      }
    }
  };

  copyReferralCode = () => {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(this.state.referralCode).select();
    document.execCommand("copy");
    $temp.remove();
    this.setState({ copyToClipBoard: false }); // set as copied
    setTimeout(() => this.setState({ copyToClipBoard: true }), 1500); // reset copy to clipboard after 1.5 sec
  };

  render() {
    return (
      <React.Fragment>
        <a className={"item"} onClick={() => this.showReferralCode()}>
          <i className="user plus icon"></i>
          Referral-Code
        </a>

        <div className="ui modal mini">
          <div className="header">Referral Code</div>
          <div className="content">
            <div className="description">
              <p>
                Share this referralCode with others for extra in-game credit.
              </p>
              {
                [
                  <p>Share it with your friends for 2000 rupees</p>,
                  <div className="ui icon input loading disabled">
                    <input
                      type="text"
                      placeholder="Generating Referral-Code"
                      disabled
                    />
                    <i className="search icon"></i>
                  </div>,
                  // referral Code display
                  <React.Fragment>
                    <div className="ui action input">
                      <input
                        type="text"
                        value={this.state.referralCode}
                        disabled
                      />
                      <div
                        className="ui teal right labeled icon button"
                        onClick={this.copyReferralCode}
                        data-tooltip={
                          this.state.copyToClipBoard
                            ? "Copy to Clipboard"
                            : "Copied !!"
                        }
                      >
                        <i className="copy icon"></i>
                        Copy
                      </div>
                    </div>
                  </React.Fragment>,
                  <p> Something went wrong, try again later</p>,
                ][this.state.status]
              }
              <p></p>

              <p>
                <div>
                  <div
                    className="ui negative right floated button "
                    onClick={this.hideReferralCode}
                  >
                    Cancel
                  </div>
                  <div
                    className={
                      "ui left floated positive button " +
                      (this.state.status == 1
                        ? "loading"
                        : this.state.status == 0
                        ? ""
                        : "disabled")
                    }
                    onClick={this.handleGetCode}
                  >
                    Get ReferralCode
                  </div>
                </div>
              </p>
              <p style={{ height: "2.5rem" }}></p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export { Referral };
