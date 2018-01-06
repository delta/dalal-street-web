import {grpc, Code, Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../proto_build/DalalMessage_pb_service";
import {LoginRequest, LoginResponse} from "../proto_build/actions/Login_pb";
import {BuyStocksFromExchangeRequest, BuyStocksFromExchangeResponse} from "../proto_build/actions/BuyStocksFromExchange_pb";
import {DataStreamType, SubscriptionId, SubscribeRequest, SubscribeResponse} from "../proto_build/datastreams/Subscribe_pb";

DalalActionService.serviceURL = "https://localhost:8000";

async function login() {
    const loginRequest = new LoginRequest();
    loginRequest.setEmail("106115021@nitt.edu")
    loginRequest.setPassword("superstrongpassword")

    try {
        const resp = await DalalActionService.login(loginRequest);
        console.log(resp.getStatusCode());
    }
    catch(e) {
        // error could be grpc error or Dalal error. Both handled in exception
        console.log("Error happened! ", e.statusCode, e.statusMessage);
    }
}

login();
