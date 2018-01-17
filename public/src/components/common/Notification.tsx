import * as React from "react";

export interface NotificationProps { 
    messages: string[],
    icon: string
}

export class Notification extends React.Component<NotificationProps, {}> {
    render() {
        const messages = this.props.messages;
        const icon = this.props.icon;
        const notifications = messages.map((message, index) =>
            <div key={index} className="item">
                <i className={icon}></i>
                <span className="notif-item">{message}</span>
            </div>
        );

        return (
            <div id="notifbutton" className="ui dropdown icon item">
                <span id="notifbuttontext">
                    <i className="inbox icon"></i>Inbox
                </span>
                <div id="mymenu" className="menu">
                    {notifications}
                </div>
            </div>
        );
    }
}