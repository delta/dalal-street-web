import * as React from "react";
import { Notification as Notification_pb } from "../../../proto_build/models/Notification_pb"

export interface NotificationProps { 
    notifications: Notification_pb[],
    icon: string
}

export class Notification extends React.Component<NotificationProps, {}> {

    render() {
        const notifications = this.props.notifications;
        const icon = this.props.icon;
        const notifsList = notifications.map((notif, index) =>
            <div key={index} className="item">
                <i className={icon}></i>
                <span className="notif-item">{notif.getText()}</span>
            </div>
        );

        return (
            <div id="notifbutton" className="ui dropdown icon item">
                <span id="notifbuttontext">
                    <i className="inbox icon"></i>Inbox
                </span>
                <div id="mymenu" className="menu">
                    {notifsList}
                </div>
            </div>
        );
    }
}