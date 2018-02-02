import * as React from "react";

import { MarketEvent } from "../../../proto_build/models/MarketEvent_pb";
import { Fragment } from "react";

declare var $:any;

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

        return(
            <Fragment>
                <div id={"ui_card_"+newsDetails.getId()} onClick={this.showModal} className="ui card">
                    <div className="image">
                        <img src="https://placeimg.com/350/350/animals"/>
                    </div>
                    <div className="content">
                        <a className="header">{newsDetails.getHeadline()}</a>
                        <div className="meta">
                        <span className="date">{newsDetails.getCreatedAt()}</span>
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
                            <img src="https://placeimg.com/350/350/animals"/>
                        </div>

                        <div className="description">
                            <div className="ui header">{newsDetails.getText()}
                            </div>
                        </div>
                
                        <div className="actions">
                            <div className="ui black deny button">
                                Close
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}