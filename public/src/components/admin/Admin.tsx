import * as React from "react";
import { Metadata } from "grpc-web-client";
import {SendNewsRequest} from "../../../proto_build/actions/SendNews_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";

export interface AdminProps {
    sessionMd: Metadata
}

export class Admin extends React.Component<AdminProps, {}> {
    constructor(props: AdminProps) {
        super(props);
    }
    purchaseFromExchange = async (event: any) => {
        try {
            const request = new SendNewsRequest();
            request.setNews("This is the first news");
            const resp = await DalalActionService.sendNews(request, this.props.sessionMd);
            console.log(resp)
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <div>
                <h1>ADMIN PANEL</h1>
                <span>dsaaaaaaaaaaaaaaaaaaaaaaaa</span><button onClick = {(e) => { this.purchaseFromExchange(e) }}>Send</button>
            </div>
        )
    }
}