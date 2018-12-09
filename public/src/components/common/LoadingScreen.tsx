import * as React from "react";

export class LoadingScreen extends React.Component<{},{}> {
    render() {
        return (
            <div id="loading-screen" className="ui segment">
                <div className="ui active dimmer">
                    <div className="ui huge text loader">Loading</div>
                </div>
                <p></p>
            </div>
        );
    }
}
