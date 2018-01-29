import * as React from "react";

export class NotFound extends React.Component<{}, {}> {
	render() {
		let quotes: string[] = [
			"The main purpose of the stock market is to make fools of as many men as possible. - Bernard Baruch",
			"Stock market bubbles don't grow out of thin air. They have a solid basis in reality, but reality as distorted by a misconception. - George Soros",
			"If stock market experts were so expert, they would be buying stock, not selling advice. - Norman Ralph Augustine",
			"Everyone has the brainpower to follow the stock market. If you made it through fifth-grade math, you can do it. - Peter Lynch"
		];
		return (
			<div id="404_container" className="ui stackable grid pusher main-container">
				<div className="ui large grey header">
					The given link does not exist on the server <br />
					{quotes[Math.floor(Math.random() * 4)]} <br />
				</div>
			</div>
		);
	}
}