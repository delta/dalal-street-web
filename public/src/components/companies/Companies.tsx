import * as React from "react";
import { Metadata } from "grpc-web-client";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb";
import { Notification } from "../common/Notification";
import { TinyNetworth } from "../common/TinyNetworth";
import { StockBriefInfo } from "../trading_terminal/TradingTerminal";
import { SearchBar } from "../trading_terminal/SearchBar";
import { CompanyDetails } from "./CompanyDetails";
import { Fragment } from "react";
import { GetMarketEventsRequest, GetMarketEventsResponse } from "../../../proto_build/actions/GetMarketEvents_pb";
import { DalalActionService, DalalStreamService } from "../../../proto_build/DalalMessage_pb_service";
import { MarketEvent } from "../../../proto_build/models/MarketEvent_pb";
import { subscribe, unsubscribe } from "../../../src/streamsutil";
import { SubscriptionId } from "../../../proto_build/datastreams/Subscribe_pb";
import { NewsComponent } from "../news/NewsComponent";

export interface CompanyProps {
    userCash: number,
    userReservedCash: number,
    userTotal: number,
    userStockWorth: number,
    connectionStatus: boolean,
    isMarketOpen: boolean,
    isBlocked: boolean,
    sessionMd: Metadata,
    notifications: Notification_pb[],
    stockBriefInfoMap: { [index: number]: StockBriefInfo },
    stockPricesMap: { [index: number]: number },
    disclaimerElement: JSX.Element,
    reservedStocksWorth: number
}

interface CompanyState {
    currentStockId: number,
    currentPrice: number,
    newsArray: MarketEvent[],
    subscriptionId: SubscriptionId,
    lastFetchedNewsId: number,
}

export class Company extends React.Component<CompanyProps, CompanyState> {
    constructor(props: CompanyProps) {
        super(props);

        let currentStockId = Number(Object.keys(this.props.stockBriefInfoMap).sort()[0]);
        for(const stockId in this.props.stockBriefInfoMap){
            let bankruptStatus: boolean = this.props.stockBriefInfoMap[stockId].isBankrupt;
            if(!bankruptStatus){
                currentStockId= Number(stockId);
                break;
            }
        }
		if(!isNaN(currentStockId) && this.props.stockBriefInfoMap[currentStockId]!.isBankrupt)
		{
			currentStockId= NaN;
		}
        this.state = {
            newsArray: [],
            subscriptionId: new SubscriptionId,
            lastFetchedNewsId: 0,
            currentStockId: currentStockId,
            currentPrice: props.stockPricesMap[currentStockId],
        };
    }

    getOldNews = async () => {
            const req = new GetMarketEventsRequest();
            req.setLastEventId(this.state.lastFetchedNewsId);
            req.setCount(10000);
            try {
                let resp = await DalalActionService.getMarketEvents(req, this.props.sessionMd);
                const nextId = resp.getMarketEventsList().slice(-1)[0].getId() - 1;
                let updatedNews = this.state.newsArray.slice();
                console.log("Current stock id " + this.state.currentStockId)
                updatedNews.push(...resp.getMarketEventsList());
                let CompanySpecificNews = updatedNews.filter((news)=>{
                    return news.getStockId() == this.state.currentStockId
                })
                console.log("Array: "+CompanySpecificNews)
                this.setState({
                    newsArray: CompanySpecificNews,
                    lastFetchedNewsId: nextId,
                });
            } catch (e) {
                // error could be grpc error or Dalal error. Both handled in exception
                console.log("Error happened! ", e.statusCode, e.statusMessage, e);
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
            if(newsUpdate.getStockId()==this.state.currentStockId){
                newsData.unshift(newsUpdate);
        
                this.setState({
                    newsArray: newsData,
                });
            }
           
        }
    }
    componentDidMount() {
        this.getOldNews();
        this.getNewNews();
    }

    componentWillUnmount() {
        unsubscribe(this.props.sessionMd, this.state.subscriptionId);
    }

    // child will affect the current stock id
    handleStockIdChange = (newStockId: number) => {
        this.setState({
            currentStockId: newStockId,
            currentPrice: this.props.stockPricesMap[newStockId],
        });
        this.getOldNews();
    };

    render() {
        const newsArray = this.state.newsArray;
        const news = newsArray.map((entry, index) => (
            <div className="four wide column box no-padding">
                <NewsComponent key={index} newsDetail={entry} />
            </div>
        ));
        return (
            <Fragment>
                <div className="row" id="top_bar">
                    <div id="search-bar">
                        <SearchBar
                            stockBriefInfoMap={this.props.stockBriefInfoMap}
                            stockPricesMap={this.props.stockPricesMap}
                            handleStockIdCallback={this.handleStockIdChange}
                            defaultStock={this.state.currentStockId} />
                    </div>

                    <TinyNetworth userCash={this.props.userCash} userReservedCash={this.props.userReservedCash} userReservedStocksWorth = {this.props.reservedStocksWorth} userTotal={this.props.userTotal} userStockWorth={this.props.userStockWorth} connectionStatus={this.props.connectionStatus} isMarketOpen={this.props.isMarketOpen} isBlocked={this.props.isBlocked} />
                    <div id="notif-component">
                        <Notification notifications={this.props.notifications} icon={"open envelope icon"} />
                    </div>
                </div>
                <div id="company-details" className="main-container ui stackable grid pusher">
                    <CompanyDetails
                        sessionMd={this.props.sessionMd}
                        currentStockId={this.state.currentStockId}
                        currentPrice={this.state.currentPrice}
                    />
                    <div className="row" style={{margin: "3rem"}}>
                        {news}
                    </div>
                    {this.props.disclaimerElement}
                </div>
            </Fragment>
        ); 
    }
}
