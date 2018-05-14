import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';

import io from 'socket.io-client';

import './styles/app.css';

function Header(props) {
	return (
		<div styleName='header'>
		</div>
	);
}

function Box(props) {
	return (
		<div>
			<ul styleName='grid'>
				{Object.entries(props.currencies).map((element) =>
					<li key={element[0]} styleName={props.classes.list}>
						{`${element[0]}: $${element[1].value}`}
					</li>)}
			</ul>
		</div>
	);
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			coins: ['BTC', 'BCH', 'ETH', 'XRP', 'LTC', 'ETC', 'ZEC', 'XMR', 'DASH', 'REP'],
			languages: {},
			classes: {
				list: ['box'].join(' ')
			}
		};

		this.populateObj = this.populateObj.bind(this);

	}

	componentDidMount() {

		this.populateObj();

		var subscription = this.state.coins.map((element) => element = `2~Kraken~${element}~USD`);

		/*['2~Kraken~BTC~USD', '2~Kraken~XRP~USD']*/
		var socket = io.connect('https://streamer.cryptocompare.com/');
		var splitMessage;
		var currency;


		socket.emit('SubAdd', { subs: subscription });

		socket.on('m', (message) => {
			console.log(message);
			splitMessage = message.split('~');
			if (splitMessage[0] == 2) {

				currency = splitMessage[2];

				const newData = update(this.state, {
					languages: { [currency]: { value: { $set: splitMessage[5] } } }
				});

				console.log(splitMessage[5]);

				return this.setState(newData);
			}
		});
	}

	populateObj() {

		var y = {};

		this.state.coins.map((element) => {

			y = Object.defineProperty(y, element, {
				value: { value: '' },
				writable: true,
				configurable: true,
				enumerable: true
			});
		});

		const x = update(this.state, { languages: { $set: y } });

		return this.setState(x);
	}

	render() {
		return (
			<div>
				<Box currencies={this.state.languages} classes={this.state.classes} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));