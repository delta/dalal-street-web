import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { Cluster } from '../../../proto_build/models/Cluster_pb';
import { InspectComponentsRequest } from '../../../proto_build/actions/InspectComponents_pb';
import { DalalActionService } from '../../../proto_build/DalalMessage_pb_service';
import { showErrorNotif } from "../../utils";

export interface InspectConnectedComponentsProps {
    sessionMd: Metadata,
}

export interface InspectConnectedComponentState {
    clusters: Cluster[]
}

export class InspectConnectedComponents extends React.Component<InspectConnectedComponentsProps, InspectConnectedComponentState> {
    constructor(props: InspectConnectedComponentsProps) {
        super(props);
        this.state = {
            clusters: []
        }
    }

    getInspectConnectedComponents = async () => {
        const sessionMd = this.props.sessionMd;
        const inspectComponentsRequest = new InspectComponentsRequest();

        try {
            const response = await DalalActionService.inspectConnectedComponents(inspectComponentsRequest, sessionMd);

            this.setState({
                clusters: response.getClustersList().sort((a: Cluster, b: Cluster) => (a.getVolume() < b.getVolume()) ? 1 : ((b.getVolume() < a.getVolume()) ? -1 : 0))
            })
        } catch (e) {
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }

    getAccordionEntries = (clusters: Cluster[]) => {
        return clusters.map((entry: Cluster, index: any) => (
            <React.Fragment>
                <div key={index} className="title">
                    <h3><i className="dropdown icon"></i>volume: <strong>{entry.getVolume()}</strong></h3>
                </div>
                <div className="content">
                    <div className="ui divided grid">
                        {entry.getMembersList().map((entry, index) => (
                            <div key={index} className="four wide column">{entry}</div>
                        ))}
                    </div>
                </div>

            </React.Fragment>
        ))
    }

    componentDidUpdate() {
        ($('.ui.accordion') as any).accordion();
    }

    render() {
        if (this.state.clusters.length == 0) {
            return <input type="button" className="ui inverted green button" onClick={this.getInspectConnectedComponents} value="Inspect Connected Components" />
        } else {
            const clusterEntries = this.getAccordionEntries(this.state.clusters);
            return (
                <React.Fragment>
                    <div className="ui segment admin-panel content2">
                        <div className="ui fluid accordion">
                            {clusterEntries}
                        </div>
                    </div>
                </React.Fragment>
            )
        }

    }
}
