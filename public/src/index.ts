import {grpc, Code, Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../proto_build/DalalMessage_pb_service";
import {LoginRequest, LoginResponse} from "../proto_build/actions/Login_pb";
import {BuyStocksFromExchangeRequest, BuyStocksFromExchangeResponse} from "../proto_build/actions/BuyStocksFromExchange_pb";
import {DataStreamType, SubscriptionId, SubscribeRequest, SubscribeResponse} from "../proto_build/datastreams/Subscribe_pb";
import {Notification} from "../proto_build/models/Notification_pb";

DalalActionService.serviceURL = "https://localhost:8000";
DalalStreamService.serviceURL = "https://localhost:8000";

let sessionMd: Metadata;

async function subscribe(dst: DataStreamType, dsId?: string) {
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

async function handleNotificationsStream() {
    const subscriptionId = await subscribe(DataStreamType.NOTIFICATIONS);
    const stream = DalalStreamService.getNotificationUpdates(subscriptionId, sessionMd);

    for await (const notifUpdate of stream) {
        const notif = notifUpdate.getNotification() as Notification; // important to make TS think it's not undefined
    }
}

async function handleStockPricesStream() {
    const subscriptionId = await subscribe(DataStreamType.STOCK_PRICES);
    const stream = DalalStreamService.getStockPricesUpdates(subscriptionId, sessionMd);

    for await (const stockPricesUpdate of stream) {
        const update = stockPricesUpdate.getPricesMap();
    }
}

async function login() {
    const loginRequest = new LoginRequest();
    loginRequest.setEmail("106115021@nitt.edu")
    loginRequest.setPassword("superstrongpassword")

    try {
        const resp = await DalalActionService.login(loginRequest);
        sessionMd = new Metadata({"sessionid": resp.getSessionId()});
        handleNotificationsStream();
        handleStockPricesStream();
    }
    catch(e) {
        // error could be grpc error or Dalal error. Both handled in exception
        console.log("Error happened! ", e.statusCode, e.statusMessage);
    }
}

login();
