import * as React from "react";
import { MarketEvent } from "../../../proto_build/models/MarketEvent_pb";
import { Fragment } from "react";

declare var $:any;
declare var moment: any;

export interface NewsComponentProps {
    newsDetail: MarketEvent,
}

export class NewsComponent extends React.Component<NewsComponentProps,{}> {
    constructor( props: NewsComponentProps) {
        super(props);

        this.state = {
            newsDetails: new MarketEvent,
        }
    }

    showModal = (event: any) => {
        // get the number part from the id of id of the div 
        let event_id = String(event.currentTarget.id).slice(8);
        $("#ui_modal_"+event_id).modal('show');
    }

    render() {

        const newsDetails = this.props.newsDetail;
        const url = "url(./public/src/images/news/" + newsDetails.getImagePath() + ") center/cover no-repeat";
        const divStyle = {
            background: url
        }
        const newsTime = moment(newsDetails.getCreatedAt())
        return(
            <Fragment>
                <div id={"ui_card_"+newsDetails.getId()} onClick={this.showModal} className="news-element news-card ui card">
                    <div className="news-wrapper" style={divStyle}>
                        <div className="header">
                            <div className="date">
                                <span className="day">{newsTime.date()} </span>
                                <span className="month">{newsTime.format('MMMM')} </span>
                                <span className="year">{newsTime.year()}</span>
                            </div>
                            <ul className="menu-content">
                                <li>
                                    <a href="#" className="fa fa-bookmark-o"></a>
                                </li>
                            </ul>
                        </div>
                        <div className="news-data">
                            <div className="content">
                                <h1 className="title"><a href="#">{newsDetails.getHeadline()}</a></h1>
                                <p className="text"></p>
                                <a href="#" className="button">Read more</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id={"ui_modal_"+newsDetails.getId()} className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        {newsDetails.getHeadline()}
                    </div>
                    <div className="image content">
                        <div className="ui medium image">
                            <img src={"./public/src/images/news/" + newsDetails.getImagePath()}/>
                        </div>

                        <div className="description">
                            <div className="ui header">{newsDetails.getText()}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        
        );
    }
}