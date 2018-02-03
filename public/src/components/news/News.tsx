import * as React from "react";
import { Notification } from "../common/Notification";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Metadata } from "grpc-web-client"; 
import { DalalActionService, DalalStreamService } from "../../../proto_build/DalalMessage_pb_service";
import { GetMarketEventsRequest, GetMarketEventsResponse } from "../../../proto_build/actions/GetMarketEvents_pb";
import { MarketEvent } from "../../../proto_build/models/MarketEvent_pb";
import { subscribe, unsubscribe } from "../../../src/streamsutil";
import { SubscriptionId } from "../../../proto_build/datastreams/Subscribe_pb";
import { NewsComponent } from "./NewsComponent";

export interface NewsProps {
    sessionMd: Metadata,
    newsCount: number,
    notifications: Notification_pb[],
}

export interface NewsState {
    newsArray: MarketEvent[],
    subscriptionId: SubscriptionId,
}

export class News extends React.Component<NewsProps, NewsState> {
    constructor(props: NewsProps) {
        super(props);

        this.state = {
            newsArray: [],
            subscriptionId: new SubscriptionId,
        };
    }

    getOldNews = async () => {
        const req = new GetMarketEventsRequest();
        req.setLastEventId(0);
        req.setCount(this.props.newsCount);
                
        let newsResp = await DalalActionService.getMarketEvents(req, this.props.sessionMd);
        
        this.setState({
            newsArray: newsResp.getMarketEventsList(),
        });
    }

    getNewNews = async () => {
        const subscriptionId = await subscribe(this.props.sessionMd, 5);

        this.setState({
            subscriptionId: subscriptionId,
        });

        const newsRequest = await DalalStreamService.getMarketEventUpdates(subscriptionId, this.props.sessionMd);

        let newsData = this.state.newsArray.slice();

        for await (const update of newsRequest) {
            let newsUpdate = update.getMarketEvent()!;
            newsData.push(newsUpdate);

            this.setState({
                newsArray: newsData,
            });
        }
    }


    componentDidMount() {
        this.getOldNews();
        this.getNewNews();
    }

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.subscriptionId);
    }

    render() {
        const newsArray = this.state.newsArray;
        const news = newsArray.map((entry,index) => (
            <div className="four wide column box" key={index}>
                <NewsComponent newsDetail={entry} />
            </div>
        ));

        return (
            <div id="news-container" className="ui stackable grid pusher main-container">
                <div className="row" id="top_bar">
                     <div id="notif-component">
                         <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div className="row">
                    <h2 className="ui center aligned icon header inverted">
                        <i className="newspaper icon"></i>                        
                        <div className="content">
                            News
                            <div className="grey sub header">
                                All your news requirement in one place
                            </div>
                        </div>
                    </h2>
                </div>
                <div className="row">
                    {news} 
                </div>
            </div>
        )
    }
}