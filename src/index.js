import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

//import Symbaroum from './symbaroum.js';

const LANG_DE = {
	perception: "Aufmerksamkeit",
	charisma: "Ausstrahlun",
	dexterity: "Gewandheit",
	stealth: "Heimlichkeit",
	precision: "Präzision",
	wits: "Scharfsinn",
	strength: "Stärke",
	will: "Willenskraft"
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			createNew: true,
			character: {
				personal: {
					characterName: null,
					playername: null,
					shadow: null,
					job: null
				},
				attributes: {
					perception: 5,
					charisma: 5,
					dexterity: 5,
					stealth:5,
					precision:5,
					wits: 5,
					strength: 5,
					will: 5,
				},
				stats: {},
				talents: {},
				experience: {
					pool: 50,
					spend: 0
				}
			},
			pool:80
		}
	}

	render() {
		if(this.state.createNew === null) {
			//todo people should be choosing if they want to create or load a character 
		}
		if(this.state.createNew === false){
			//todo people should be able to load their character
		}
		return (
			//<personal />
			<Attributes pool={this.state.pool} min="5" max="15" value={this.state.character.attributes}/>
			//<race />
			//<talents />
			//<equipment />
		)
	}
}

class Attributes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pool: this.props.pool,
			attributes: this.props.value
			};
	}
	get available() {
		// add all values and calculate
		let spent = 0;
		Array.from(Object.values(this.state.attributes)).forEach((num)=>{
			spent += num;
		});

		return this.state.pool - spent;
	}

	updateNumber(num, name) {
		const updatedState = update(this.state,{attributes:{[name]:{$set:this.state.attributes[name] + num}}});
		this.setState(updatedState);
	}

	renderInputs() {
		const NumberInputs = Object.keys(this.state.attributes).map((key)=>{
			return	<NumberInput 
			updateNumber={this.updateNumber.bind(this)}
			key={key}
			name={key}
			value={this.state.attributes[key]}
			label={LANG_DE[key]}
			min={this.props.min}
			max={this.props.max}
			disabled={this.available <= 0}
			/>
		});
		return NumberInputs;
	}

        render () {
	       return (
		       <div>
		       	{this.renderInputs()}
		       	<p>Es dürfen noch {this.available} Punkte ausgegeben werden</p>
		       </div>
	       )
        } 
}

class NumberInput extends React.Component {
	clickPlus() {
		if(this.props.value >= this.props.max){
			return;
		}

		this.props.updateNumber(1, this.props.name);
	}

	clickMinus() {
		if(this.props.value <= this.props.min) {
			return;
		}

		this.props.updateNumber(-1, this.props.name);
	}

	disablePlus() {
		return this.props.disabled || this.props.value >= this.props.max;
	}

	render() {
		return (
			<div className="number-input">
				<button className="number-btn minus" disabled={this.props.value <= this.props.min} onClick={this.clickMinus.bind(this)}>-</button>
				<span className="number-value">{this.props.value}</span>
				<button className="number-btn plus" disabled={this.disablePlus()} onClick={this.clickPlus.bind(this)}>+</button>
				<span>{this.props.label}</span>	
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

