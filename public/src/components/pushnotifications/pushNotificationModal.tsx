import * as React from "react";
import {
  askUserPermission,
  register,
  isDevServer,
  createNotificationSubscription,
  setVAPIDPublicKey,
} from "./pushnotifications";
import { showErrorNotif } from "../../utils";
import { Metadata } from "grpc-web-client";
import { AddUserSubscriptionRequest } from "../../../proto_build/actions/AddUserSubscription_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
interface PushNotificationProps {
  sessionMd: Metadata;
  vapidPublicKey: string;
}
class PushNotificationModal extends React.Component<PushNotificationProps, {}> {
  handleAccept = async () => {
    const resp = await askUserPermission();
    localStorage.setItem("dalal_push_notif", "yes");
    if (resp === "granted") {
      console.log("registered");
      await register({ scope: "/" });
      const subscription = await createNotificationSubscription();
      if (subscription == null)
        showErrorNotif(
          "Unable to register for push Notifications, try again later"
        );
      if (isDevServer()) console.log("Subscription : ", subscription);
      this.sendSubscriptionToServer(subscription);
    }
  };
  handleReject = () => {
    localStorage.setItem("dalal_push_notif", "no");
  };

  sendSubscriptionToServer = async (subscription: PushSubscription | null) => {
    if (!subscription) return;
    const request = new AddUserSubscriptionRequest();
    request.setData(JSON.stringify(subscription));
    try {
      await DalalActionService.addUserSubscription(
        request,
        this.props.sessionMd
      );
    } catch (err) {
      console.log(err);
      showErrorNotif(
        "Unable to register for push Notifications, try again later"
      );
    }
  };

  componentDidMount() {
    setVAPIDPublicKey(this.props.vapidPublicKey);
  }

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
