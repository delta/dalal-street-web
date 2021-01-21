import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { ChallengeType } from '../../../proto_build/actions/AddDailyChallenge_pb';
import { AddDailyChallengeRequest } from '../../../proto_build/actions/AddDailyChallenge_pb';
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { showNotif, showErrorNotif, closeNotifs } from "../../utils";


const CASH = ChallengeType.CASH;
const NETWORTH = ChallengeType.NETWORTH;
const STOCKWORTH = ChallengeType.STOCKWORTH;
const SPECIFICSTOCK = ChallengeType.SPECIFICSTOCK;
const rows=4;

export interface AddDailyChallengeProps{
    sessionMd: Metadata,   
}

export class AddDailyChallenge extends React.Component<AddDailyChallengeProps,{}> {
    constructor(props: AddDailyChallengeProps) {
        super(props);  
    }

    setDailyChallenge = async () =>{
        const sessionMd = this.props.sessionMd;
        const marketDay = $('#day-select').val() as number;
        const challengeType = $('#type-select').val() as ChallengeType;
        const stock_id = $('#stockid').val() as number;
        const stockvalue = $('#stockvalue').val() as number;

        const addDailyChallengeReq= new AddDailyChallengeRequest();

        try{
            addDailyChallengeReq.setMarketDay(marketDay);
            addDailyChallengeReq.setChallengeType(challengeType);
            addDailyChallengeReq.setStockid(stock_id);
            addDailyChallengeReq.setValue(stockvalue);
            
            const resp = await DalalActionService.addDailyChallenge(addDailyChallengeReq, sessionMd);

            showNotif("Notification has been sent successfully!");

        } catch(e){
            console.log("Error happened while adding Challenge! ", e.statusCode, e.statusMessage, e);
           if (e.isGrpcError) {
              showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
           } else {
              showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
           } 
        }
        
    }
    componentDidMount () {
        ($("#day-select") as any).dropdown();
        ($("#type-select") as any).dropdown();

    }

    render() {
     return(
        <React.Fragment>
        <table id="dividend-table">
            <tbody className="ui bottom attached tab segment active inverted">
                <tr>
                    
                    <td>
                    <tr>
                        <label>Enter Market Day: </label>
                    </tr>
                        <select name="Market-Day" id="day-select" className="ui selection dropdown">
                            <option value="1">Day 1</option>
                            <option value="2">Day 2</option>
                            <option value="3">Day 3</option>
                            <option value="4">Day 4</option>
                            <option value="5">Day 5</option>
                            <option value="6">Day 6</option>
                            <option value="7">Day 7</option>
                            
                        </select>
                    </td>
                    <td>
                    <tr>
                        <label>Enter Type of Challenge: </label>
                    </tr>
                        <select name="Challenge-Type" id="type-select" className="ui selection dropdown">
                            <option value={CASH}>Cash</option>
                            <option value={NETWORTH}>Networth</option>
                            <option value={STOCKWORTH}>Stock Worth</option>
                            <option value={SPECIFICSTOCK}>Specific Stock</option>
                        </select>
                    </td>
                    <td>
                        <tr>
                        <label>Enter Stock Id: </label>
                        </tr>
                        
                
                    <input type="integer" className="notify-text" id="stockid" placeholder="0" />
                    </td>
                    <td>
                    <tr>
                        <label>Enter Stock Value: </label>
                    </tr>
                        
                
                    <input type="integer" className="notify-text" id="stockvalue" placeholder="0" />
                    </td>
                    
                    
                
                    <td>
                    <input type="button" className="ui inverted green button" onClick={this.setDailyChallenge} value="Add Daily Challenge"/>
                    </td>
                    </tr>
                    

                    
            </tbody>
        </table>    

        </React.Fragment>
     )   
    }
}
