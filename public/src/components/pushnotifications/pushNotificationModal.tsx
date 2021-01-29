import * as React from "react";
import { askUserPermission, register } from "./pushnotifications";
import { showErrorNotif } from "../../utils";

class PushNotificationModal extends React.Component<{}, {}> {
  handleAccept = async () => {
    const resp = await askUserPermission();
    if (resp === "granted") {
      console.log("registered");
      const subscription = await register({});
      if (subscription == null)
        showErrorNotif(
          "Unable to register for push Notifications, try again later"
        );
      console.log("Subscription : ", subscription);
    }
  };
  handleReject = () => {
    localStorage.setItem("dalal_push_notif", "no");
  };
  render() {
    return (
      <div className="ui basic modal" id="pushNotifModal">
        <div className="ui icon header">
          <i className="bell icon"></i>
          Want to receive Desktop notifications ?
        </div>
        <div className="content">
          <p>
            Never miss an update from Dalal Street, turn on desktop notification
            to receive instant updates from Dalal Street{" "}
          </p>
        </div>
        <div className="actions">
          <div
            className="ui red basic cancel inverted button"
            onClick={this.handleReject}
          >
            <i className="remove icon"></i>
            No
          </div>
          <div
            className="ui green ok inverted button"
            onClick={this.handleAccept}
          >
            <i className="checkmark icon"></i>
            Yes
          </div>
        </div>
      </div>
    );
  }
}

export { PushNotificationModal };
