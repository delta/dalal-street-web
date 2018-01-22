import {Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../proto_build/DalalMessage_pb_service";
import {DataStreamType, SubscriptionId, SubscribeRequest, SubscribeResponse, UnsubscribeRequest, UnsubscribeResponse} from "../proto_build/datastreams/Subscribe_pb";

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

export async function unsubscribe(sessionMd: Metadata, subscriptionId: SubscriptionId) {
    const unsubreq = new UnsubscribeRequest();
    unsubreq.setSubscriptionId(subscriptionId);

    const unsubres = await DalalStreamService.unsubscribe(unsubreq, sessionMd);
    if (unsubres.getStatusCode() != UnsubscribeResponse.StatusCode.OK) {
        throw new Error("Unable to unsubscribe");
    }
}

