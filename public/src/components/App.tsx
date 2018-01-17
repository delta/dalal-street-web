import * as React from "react";
import { Navbar } from "./common/Navbar";
import { Main } from "./Main";

export class App extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<Navbar />
				<Main sessionId={"123"}/>
			</div>
		);
	}
}