import {grpc, Code, Metadata} from "grpc-web-client";
import {DalalActionService, DalalStreamService} from "../proto_build/DalalMessage_pb_service";
import {LoginRequest, LoginResponse} from "../proto_build/actions/Login_pb";
import {BuyStocksFromExchangeRequest, BuyStocksFromExchangeResponse} from "../proto_build/actions/BuyStocksFromExchange_pb";
import {DataStreamType, SubscriptionId, SubscribeRequest, SubscribeResponse} from "../proto_build/datastreams/Subscribe_pb";

const host = "https://localhost:8000";

function login() {
    const loginRequest = new LoginRequest();
    loginRequest.setEmail("106115021@nitt.edu")
    loginRequest.setPassword("superstrongpassword")

    grpc.unary(DalalActionService.Login, {
        request: loginRequest,
        host: host,
        onEnd: res => {
            const { status, statusMessage, headers, message, trailers  } = res;
            console.log("login.onEnd.status", status, statusMessage);
            console.log("login.onEnd.headers", headers);
            if (status === Code.OK && message) {
                console.log("login.onEnd.message", message.toObject());
            }
            console.log("login.onEnd.trailers", trailers);
        }
    });
}

login();
