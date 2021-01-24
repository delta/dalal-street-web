import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";
import { UpdateEndOfDayValuesRequest } from "../../../proto_build/actions/UpdateEndOfDayValues_pb";
import { showSuccessNotif, showErrorNotif } from "../../utils";

export interface UpdateEndOfDayProps {
  sessionMd: Metadata;
}

class UpdateEndOfDayValues extends React.Component<UpdateEndOfDayProps, {}> {
  updateEndOfDayValue = async () => {
    const updateEndOfDayValue = new UpdateEndOfDayValuesRequest();
    try {
      await DalalActionService.updateEndOfDayValues(
        updateEndOfDayValue,
        this.props.sessionMd
      );
      showSuccessNotif("Updated end of day values");
    } catch (error) {
      console.log("Something went wrong, ", error);
      showErrorNotif("Couldn't update end of day values");
    }
  };

  render() {
    return (
      <React.Fragment>
        <table>
          <tbody className="ui bottom attached tab segment active inverted">
            <tr>
              <td>
                <input
                  type="button"
                  className="ui inverted green button"
                  onClick={this.updateEndOfDayValue}
                  value="Update End of Day Value"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export { UpdateEndOfDayValues };
