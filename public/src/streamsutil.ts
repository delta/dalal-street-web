import {Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../proto_build/DalalMessage_pb_service";
import {DataStreamType, SubscriptionId, SubscribeRequest, SubscribeResponse} from "../proto_build/datastreams/Subscribe_pb";

export async function subscribe(sessionMd: Metadata, dst: DataStreamType, dsId?: string) {
    const subreq = new SubscribeRequest();
    subreq.setDataStreamType(dst);
    if (dsId !== undefined) {
        subreq.setDataStreamId(dsId);
    }

    const subres = await DalalStreamService.subscribe(subreq, sessionMd);
    if (!subres.hasSubscriptionId()) {
        throw new Error("Unable to get subscription id!");
    }

    return subres.getSubscriptionId() as SubscriptionId;
}

