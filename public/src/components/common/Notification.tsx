import * as React from "react";

export interface NotificationProps { 
    messages: string[],
    icon: string
}

export class Notification extends React.Component<NotificationProps, {}> {
    render() {
        const messages = this.props.messages;
        const icon = this.props.icon;
        const notifications = messages.map((message) =>

        <div className="item">
            <i className={icon}></i>
            <span className="notif-item">{message}</span>
        </div>
    );

    return (
        <div id="notifbutton" className="ui right pointing dropdown icon button big inverted">            
            <i className="inbox icon"></i>Inbox
            <div id="mymenu" className="menu">
                <div className="header">
                <i className="tags icon"></i>
                    Notifications
                </div>
            <div className="divider"></div>
                {notifications}
            </div>
        </div>
    );
}
}