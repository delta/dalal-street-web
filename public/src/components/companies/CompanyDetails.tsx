import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { GetCompanyProfileRequest, GetCompanyProfileResponse } from "../../../proto_build/actions/GetCompanyProfile_pb";
import { Stock as Stock_pb } from "../../../proto_build/models/Stock_pb";
import { Fragment } from "react";

declare var $: any;
export interface CompanyDetailsProps {
    sessionMd: Metadata,
    currentStockId: number,
    currentPrice: number,
}

interface CompanyDetailsState {
    companyDetails: Stock_pb
}

export class CompanyDetails extends React.Component<CompanyDetailsProps, CompanyDetailsState> {
    constructor(props: CompanyDetailsProps) {
        super(props);

        this.state = {
            companyDetails: new Stock_pb,
        };
    }

    componentDidMount() {
        this.getCompanyDetails(this.props.currentStockId)
        $('.dividend-msg')
           .transition('flash');
    }

    componentWillReceiveProps(newProps: CompanyDetailsProps) {
        if (newProps && newProps.currentStockId != this.props.currentStockId) {
            this.getCompanyDetails(newProps.currentStockId)
        }
    }

    getCompanyDetails = async (currentStockId: number) => {
        let companyProfileRequest = new GetCompanyProfileRequest();
        companyProfileRequest.setStockId(currentStockId);

        try {
            const resp = await DalalActionService.getCompanyProfile(companyProfileRequest, this.props.sessionMd);
            this.setState({
                companyDetails: resp.getStockDetails()!
            });
        }
        catch(e) {
            // error could be grpc error or Dalal error. Both handled in exception
            console.log("Error happened! ", e.statusCode, e.statusMessage, e);
        }
    }

    render() {
        const companyDetails = this.state.companyDetails;
        const priceIncrease = this.props.currentPrice - companyDetails.getPreviousDayClose();
        const percentageIncrease = (priceIncrease * 100 / (companyDetails.getPreviousDayClose()+1)).toFixed(2);
        const diffClass = (priceIncrease >= 0) ? "green" : "red";
        const sign = (priceIncrease >= 0) ? "↑" : "↓";

        return (
            <Fragment>
                <div className="row">
                    <h1 className="ui center aligned icon header inverted">
                        <i className="circular suitcase icon"></i>
                        {companyDetails.getFullName()}
                    </h1>
                </div>
                <div className="row dividend-msg ">
                    <h2 className="ui center aligned icon header green" >
                        {this.state.companyDetails.getGivesDividends() ? this.state.companyDetails.getFullName()+" has announced to pay Dividends" : ""}
                    </h2>
                </div>
                <div className="row">
                    <div className="five wide column box">
                        <h1 className="ui center aligned header inverted green">
                            <div className="content">
                                ₹{this.props.currentPrice}
                                <div className="sub header">Current Stock Price</div>
                            </div>
                        </h1>
                    </div>
                    <div className="six wide column box">
                        <h1 className={"ui center aligned header inverted " + diffClass}>
                            <div className="content">
                                ₹{Math.abs(priceIncrease)} {sign}
                                <div className="sub header">Change in Stock Price</div>
                            </div>
                        </h1>
                    </div>
                    <div className="five wide column box">
                        <h1 className={"ui center aligned header inverted " + diffClass}>
                            <div className="content">
                                {Math.abs(Number(percentageIncrease))}% {sign}
                                <div className="sub header">Percentage Change in Stock Price</div>
                            </div>
                        </h1>
                    </div>
                </div>
                <div className="row">
                    <div className="eight wide column box">
                        <table className="ui inverted table">
                            <tbody>
                                <tr>
                                <td>Day High</td>
                                <td className="green">₹ {companyDetails.getDayHigh()}</td>
                                </tr>

                                <tr>
                                <td>All Time High</td>
                                <td className="green">₹ {companyDetails.getAllTimeHigh()}</td>
                                </tr>

                                <tr>
                                <td>Stocks in Exchange</td>
                                <td>{companyDetails.getStocksInExchange()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="eight wide column box">
                        <table className="ui inverted table">
                            <tbody>
                                <tr>
                                <td>Day Low</td>
                                <td className="red">₹ {companyDetails.getDayLow()}</td>
                                </tr>

                                <tr>
                                <td>All Time Low</td>
                                <td className="red">₹ {companyDetails.getAllTimeLow()}</td>
                                </tr>

                                <tr>
                                <td>Stocks in Market</td>
                                <td>{companyDetails.getStocksInMarket()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="company-info" className="row centered">
                    <div className="ui black message">
                        <div className="ui grid">
                            <div className="twelve wide column">
                                <h2 id = "heading" className="ui left aligned header inverted">
                                    A Brief Description about {companyDetails.getFullName()}
                                </h2>
                                {companyDetails.getDescription()}
                            </div>
                            <div className="four wide column">
                                <img className="ui fluid image" src={`public/src/images/companies/${companyDetails.getShortName().toUpperCase()}.png`} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}