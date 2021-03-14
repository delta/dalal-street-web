import * as React from 'react';
import { Metadata } from "grpc-web-client";
import { InspectDegreeRequest } from '../../../proto_build/actions/InspectDegree_pb';
import { DalalActionService } from '../../../proto_build/DalalMessage_pb_service';
import { showErrorNotif } from "../../utils";

declare var $: any;
interface InspectUserDegreeEntry {
    position: number,
    volume: number
}
export interface InspectUserDegreeProps {
    sessionMd: Metadata,
}
export interface InspectUserDegreeState {
    inspectUserDegreeEntries: { userId: number, volume: number, position: number }[],
    currentPage: number,
    rowsPerPage: number,
    totalPages: number,
}

export class InspectUserDegree extends React.Component<InspectUserDegreeProps, InspectUserDegreeState> {
    constructor(props: InspectUserDegreeProps) {
        super(props);
        this.state = {
            inspectUserDegreeEntries: [],
            currentPage: 1,
            rowsPerPage: 10,
            totalPages: 0,
        }
    }

    getInspectUserDegree = async () => {
        const sessionMd = this.props.sessionMd;
        const inspectDegreeRequest = new InspectDegreeRequest();

        try {
            const response = await DalalActionService.inspectUserDegree(inspectDegreeRequest, sessionMd);

            const entriesMap: { [index: number]: InspectUserDegreeEntry } = {};

            response.getVolumeMap().forEach((volume, id) => {
                entriesMap[id] = { volume: volume, position: 0 }
            })

            response.getPositionMap().forEach((position, id) => {
                entriesMap[id].position = position;
            })

            var entriesArray: { userId: number, volume: number, position: number }[] = [];

            for (const k in entriesMap) {
                var entry = {
                    userId: parseInt(k),
                    volume: entriesMap[k].volume,
                    position: entriesMap[k].position,
                }
                entriesArray.push(entry);
            }


            entriesArray.sort((a: { userId: number, volume: number, position: number }, b: { userId: number, volume: number, position: number }) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));

            this.setState({
                inspectUserDegreeEntries: entriesArray,
                totalPages: Math.ceil(entriesArray.length / this.state.rowsPerPage)
            })

        } catch (e) {
            if (e.isGrpcError) {
                showErrorNotif("Oops! Unable to reach server. Please check your internet connection!");
            } else {
                showErrorNotif("Oops! Something went wrong! " + e.statusMessage);
            }
        }
    }

    getTableEntries = (entriesArray: { userId: number, volume: number, position: number }[]) => {
        return entriesArray.map((entry, index) => (
            <tr key={index}>
                <td><strong>{entry.userId}</strong></td>
                <td><strong>{entry.volume}</strong></td>
            </tr>
        ))
    }

    paginateSide = (pageNumber: number, paginateSide: number) => {
        if (paginateSide == 1 && pageNumber <= this.state.totalPages) {
            this.setState({ currentPage: pageNumber++ });
        }
        if (paginateSide == 0 && pageNumber > 0) {
            this.setState({ currentPage: pageNumber-- });
        }
    }

    paginatePage = (pageNumber: number) => {
        this.setState({ currentPage: pageNumber });
    }

    paginationElement = (totalPages: number) => {
        const paginateButton = [];

        for (let i = 1; i <= totalPages; i++) {
            paginateButton.push(i)
        }

        return paginateButton.map((value, index) => (
            <button onClick={() => { this.paginatePage(value) }} key={index} className={this.state.currentPage == value ? "active" : ""}>{value}</button>
        ))
    }

    render() {
        const state = this.state;
        if (state.inspectUserDegreeEntries.length == 0) {
            return <input type="button" className="ui inverted green button" onClick={this.getInspectUserDegree} value="Inspect User Degree" />
        } else {
            const indexOfLastRow = state.currentPage * state.rowsPerPage;
            const indexOfFirstRow = indexOfLastRow - state.rowsPerPage;
            const entriesList = state.inspectUserDegreeEntries.slice(indexOfFirstRow, indexOfLastRow);
            const tableEntries = this.getTableEntries(entriesList)
            const paginationElement = this.paginationElement(state.totalPages)
            return (
                <React.Fragment>
                    <table id="user-degree-table" className="ui segment inverted table celled admin-panel content2">
                        <thead>
                            <tr>
                                <th>
                                    userId
                               </th>
                                <th>
                                    volume
                               </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableEntries}
                        </tbody>
                    </table>

                    <div id="user-degree-pagination">
                        <button className="navigate-button"><i onClick={() => this.paginateSide(state.currentPage - 1, 0)} className="angle double left icon"></i></button>
                        {paginationElement}
                        <button className="navigate-button"><i onClick={() => this.paginateSide(state.currentPage + 1, 1)} className="angle double right icon"></i></button>
                    </div>

                </React.Fragment>
            )

        }
    }
}
