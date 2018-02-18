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
import { showNotif } from "../../utils";

declare var $: any;

export interface NewsProps {
    sessionMd: Metadata,
    newsCount: number,
    notifications: Notification_pb[],
    disclaimerElement: JSX.Element
}

export interface NewsState {
    newsArray: MarketEvent[],
    subscriptionId: SubscriptionId,
    lastFetchedNewsId: number,
    moreExists: boolean,
}

export class News extends React.Component<NewsProps, NewsState> {
    constructor(props: NewsProps) {
        super(props);

        this.state = {
            newsArray: [],
            subscriptionId: new SubscriptionId,
            lastFetchedNewsId: 0,
            moreExists: true,
        };
    }

    getOldNews = async () => {
        if (this.state.moreExists) {
            const req = new GetMarketEventsRequest();
            req.setLastEventId(this.state.lastFetchedNewsId);
            req.setCount(this.props.newsCount);
            try {
                let resp = await DalalActionService.getMarketEvents(req, this.props.sessionMd);
                const nextId = resp.getMarketEventsList().slice(-1)[0].getId() - 1;
                let updatedNews = this.state.newsArray.slice();
                updatedNews.push(...resp.getMarketEventsList());
                this.setState({
                    newsArray: updatedNews,
                    moreExists: resp.getMoreExists(),
                    lastFetchedNewsId: nextId,
                });
            } catch(e) {
                // error could be grpc error or Dalal error. Both handled in exception
                console.log("Error happened! ", e.statusCode, e.statusMessage, e);
            }
        }
        else {
            showNotif("No further news. You're all caught up!");
        }
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
            newsData.unshift(newsUpdate);
            

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
            <div className="four wide column box no-padding">
                <NewsComponent key={index} newsDetail={entry} />
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
                    <span id="load-older-news" onClick={this.getOldNews}>
                        <i>Load older news ↻</i>
                    </span>
                </div>
                <div className="row">
                    {news} 
                </div>
                {this.props.disclaimerElement}
            </div>
        )
    }
}