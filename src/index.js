import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

//import Symbaroum from './symbaroum.js';
const Symbaroum = {
	races: {
		ambrier: {
			choose: {talents:['privileged',"contacts"]}
		},
		barbarian:{
			choose: {talents:["contacts","nature"]}
		},
		ogre: {
			gain:{ talents: ["pariah","longlife"]}
		},
		goblin: {
			gain: {talents: ["pariah","shortlife"]}
		},
		changeling: {
			gain: {talents: ["longlife"]}
		}
	},
	talents: {
		privileged: {
			type:"trait",
			restricted: true,
			modifier_once:{
				items: {thaler: {$set: 50}}
			}
		},
		contacts: {
			type:"trait",
			restricted: true,
		},
		survival: {
			type: "trait",
			requires: {race: "goblin"},
			novice: {
				action: "free"
			},
			adept: {
				action: "special",
				modifier: {armor: {additional: {survival: {$set:"+1W4"}}}}
			},
			master: {
				action: "free"
			}

		},
		robust: {
			type:"trait",
			requires:{race:"ogre"},
			apply: "highest",
			novice:{
				action:"special",
				modifier: {
					restriction: {items:{armor:{lightArmor:"only", price:2}}},
					armor: {additional: {robust: {$set:"+1w4"}}},
					defense: {$apply: (x) => x - 2},	
					offense: {additional: {robust: {$set:"+1w4"}}}
				}	
			},
			adept:{
				action:"special",
				modifier: {
					restriction: {items:{armor:{lightArmor:"only", price:3}}},
					armor: {additional: {robust: {$set:"+1w6"}}},
					defense: {$apply: (x) => x - 3},	
					offense: {additional: {robust: {$set:"+1w6"}}}
				}	
			},
			master:{
				action:"special",
				modifier: {
					restriction: {items:{armor:{lightArmor:"only", price:4}}},
					armor: {additional: {robust: {$set:"+1w8"}}},
					defense: {$apply: (x) => x - 4},	
					offense: {additional: {robust: {$set:"+1w8"}}}
				}	
			}
		},
		shapeshifter: {
			type: "trait",
			requires: {race: "changeling"},
			novice: {
				action: "free"
			},
			adept: {
				action: "free"
			},
			master: {
				action: "free"
			}
		},
		pariah: {
			type: "trait",
			restricted: true
		},
		longlife: {
			type: "trait",
			restricted: true
		},
		shortlife: {
			type: "trait",
			restricted: true
		},
		nature: {
			type: "trait",
			restricted: true
		}
	}
}

const LANG_DE = {
	perception: "Aufmerksamkeit",
	charisma: "Ausstrahlung",
	dexterity: "Gewandheit",
	stealth: "Heimlichkeit",
	precision: "Präzision",
	wits: "Scharfsinn",
	strength: "Stärke",
	will: "Willenskraft",
	perception_help: "Entdecken von Verborgenem, und nicht Offensichtlichem",
	charisma_help: "Bestimmt die Fähigkeit zur Konversation und einhalten von Etikette",
	dexterity_help: "Bewegungskunst und Ausweichen.<br><b>Abgeleitet:</b><br> Verteidigung = Gewandheit - Behinderung durch Rüstung",
	stealth_help: "Dinge verstecken, schleichen, verbergen werden über Heimlichkeit abgehandelt",
	precision_help: "Allgemeines Attribut zum Treffen mit Waffen, sowohl Nah- als auch Fernkampf",
	wits_help: "Fähigkeit zum verstehen von Vorgängen, stellt auch die Ausbildung und das Allgemeinwissen da",
	strength_help: "Stemmen, zerschlagen, heben sowie Zähigkeit<br><b>Abgeleitet:</b><br>Schmerzgrenze = Stärke/2(aufgerundet)<br> Zähigkeit = Stärke, minimum 10<br> Anzahl an tragbaren Gegenständen = Stärke",
	will_help: "Verteidigung gegen mystische Kräfte sowie Fähigkeit zum Wirken von mystischen Kräften<br><b>Abgeleitet:</b><br>Korruptionsschwelle = Willenskraft/2(aufgerundet)<br>Maximale Korruption = Willenskraft",
	attributes_title: "Eigenschaften",
	personal_title: "Allgemeine Info",
	personal_characterName: "Charakter Name",
	personal_playerName: "Spieler Name",
	personal_job: "Beruf",
	personal_shadow: "Schatten",
	job_help: "Gewerbe/Konzept des Character",
	shadow_help: "Mystische Aura die alles Lebende umgibt, Farbe entspricht dem Ursprung und den Grundkonzept des Character",
	ambrier: "Ambrier/Mensch",
	ogre: "Oger",
	changeling: "Wechselbalg",
	barbarian: "Barbaren/Mensch",
	goblin: "Goblin",
	race_title: "Völker",
	changeling_help: "Das Kukuksei von Elfen, Menschen ziehen sie groß mit der Idee es sei ihres, mit der Pubertät lüftet sich das Geheimnis meist",
	ambrier_help: "Menschen aus der alten Heimat, südlich der Titanen",
	barbarian_help: "Menschen aus den Stämmen nördlich der Titanen",
	goblin_help: "Etwa kindsgroße Humanoide, leben als Tagelöhner in den Städten",
	ogre_help: "Große Humanoide, mysteriöser Ursprung, kräftig besitzen keinen eigenen Namen",
	nature: "Wildniskunde",
	nature_help: "Erfolgreiche Aufmerksamkeitsprobe erlaubt das finden von Nahrung",
	contacts: "Kontakte",
	contacts_help: "Mit einer Ausstrahlungsprobe kann man seine Kontakte um hilfe oder Informationen bitten",
	privileged: "Privilegiert",
	privileged_help: "Erhöhtes Startgeld(50 anstelle von 5 Talern), sowie verbesserter Umgang mit anderen deiner gesellschaftlichen Schicht",


}

function renderHelp(key) {
		if(LANG_DE[key+"_help"]){
			return <span><span className="help">?</span><div className="hover-help">{LANG_DE[key+"_help"]}</div></span>
		}
		return;
};

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			createNew: true,
			character: {
				personal: {
					characterName: "",
					playerName: "",
					shadow: "",
					job: ""
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
				race: "",
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

	changeAttributes(attr) {
		const newState = update(this.state, {character: {attributes:{$set:attr}}});
		this.setState((state)=>{
			return newState;
		});
	}


	changePersonal(attr) {
		const newState = update(this.state, {character: {personal:{$set:attr}}});
		this.setState((state)=>{
			return newState;
		});
	}

	changeRace(race) {
		let state = Object.assign(this.state, {});
		Object.keys(state.character.talents).forEach((talent)=>{
			if(Symbaroum.talents[talent].type === "trait"){
				delete state.character.talents[talent];
			}
		});


		let newState = update(state, {character: {race: {$set:race}}});
		
		//logic for gaining free race talentt traits
		if(Symbaroum.races[race].gain) {
			Object.keys(Symbaroum.races[race].gain).forEach((cat)=>{
				Symbaroum.races[race].gain[cat].forEach((stat)=>{
					newState = update(newState, {character: {[cat]: {[stat]: {$set: Symbaroum[cat][stat]}}}});
				})
			})
		}

		this.setState((state)=>{
			return newState;
		});
	}


	changeTrait(trait) {
		Object.keys(this.state.character.talents).forEach((talent)=>{
			if(talent.type === "trait"){
				delete this.state.character.talents[talent];
			}
		});

		const newState = update(this.state, {character: {talents: {$set: {[trait]: Symbaroum.talents[trait]}}}});
		this.setState((state)=>{
			return newState;
		});
	}

	getTraits(){
		let temp = Object.keys(this.state.character.talents);
		
		temp
			.filter((talent)=>{
				return Symbaroum.talents[talent].type === "trait";
		})
			.map((talent)=>{	
			return Symbaroum.talents[talent];
		});

		return temp;
	}


	get logState() {
		return JSON.stringify(this.state);
	}

	render() {
		if(this.state.createNew === null) {
			//todo people should be choosing if they want to create or load a character 
		}
		if(this.state.createNew === false){
			//todo people should be able to load their character with a state
		}
		return (
			<div className="no-print">
				<h1>Symchar</h1>
				<div className="content">
					<Attributes pool={this.state.pool} min="5" max="15" value={this.state.character.attributes} 
					onChange={this.changeAttributes.bind(this)}/>
					<div className="col">
					<Personal 
					onChange={this.changePersonal.bind(this)}
					personal={this.state.character.personal}/>
					<Race onChangeTrait={this.changeTrait.bind(this)} onChangeRace={this.changeRace.bind(this)} races={Symbaroum.races} race={this.state.character.race} traits={this.getTraits()} />	
					</div>
				</div>
				<p>{this.logState}</p>
				<button onClick={window.print}>Drucken</button>
			</div>
		)
	}
}

class Race extends React.Component {
	selectRace(race) {
		this.props.onChangeRace(race);
	}

	selectTrait(trait) {
		this.props.onChangeTrait(trait);
	}

	getClass(race) {
		let classes = "races-btn"
		if(this.props.race === race) {
			classes += " selected" 
		}
		return classes;
	};

	getTraitClass(trait) {
		let classes = "trait-btn"
		this.props.traits.forEach((traitx)=>{
			if(trait === traitx) {
				classes += " selected"
			}
		})
		return classes;
	}

	renderRaces() {
		return Object.keys(this.props.races).map((race)=>{
			return <button className={this.getClass(race)} onClick={this.selectRace.bind(this,race)} key={race}>
				{LANG_DE[race]}{renderHelp(race)}
				</button>
		});
	}

	renderRace(race) {
		if(race){
			//show description and if we got a choice let the user choose one with buttons
			if(Symbaroum.races[race].choose){
				return Object.keys(Symbaroum.races[race].choose).map((stat)=>{
					return	Symbaroum.races[race].choose[stat].map((stat)=>{
						return <button  className={this.getTraitClass(stat)} onClick={this.selectTrait.bind(this, stat)} key={stat}>{LANG_DE[stat]}</button>;
					});
				})
			}
		}
		return;
	}

	render() {
		return (
			<div className="races">
				<h2>{LANG_DE.race_title}</h2>
				<div className="races-btns">
					{this.renderRaces()}
				
				</div>
				<div className="race-info">
					{LANG_DE[this.props.race]}
				</div>
				<div className="race-options">
					{this.renderRace(this.props.race)}
				</div>
			</div>
		)
	}
}

class Personal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			personal: props.personal
		}
	}

	onChange(event){
		this.setState(update(this.state,{personal:{[event.target.name]:{$set:event.target.value}}}),()=>{
			this.props.onChange(this.state.personal);
		});
	}
	
	renderHelp(key){
		if(LANG_DE[key+"_help"]){
			return <span><span className="help">?</span><div className="hover-help">{LANG_DE[key+"_help"]}</div></span>
		}
		return;
	}
	
	renderInputs(){
		return Object.keys(this.state.personal).map(key=>{
			return <div className="personal-input-wrapper" key={key}>
					<label className="personal-label" htmlFor={key}>{LANG_DE["personal_" + key]}{this.renderHelp(key)}</label>
					<input className="personal-input" id={key} name={key} onChange={this.onChange.bind(this)} defaultValue={this.state.personal[key]} />
				</div>
		})
	}

	render() {

		return (
			<div className="personal">
				<h2>{LANG_DE.personal_title}</h2>
				<div className="personal-inputs">
					{this.renderInputs()}
				</div>
			</div>
		);
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

	changeState() {
		this.props.onChange(this.state.attributes);
	};

	updateNumber(num, name) {
		const updatedState = update(this.state,{attributes:{[name]:{$set:this.state.attributes[name] + num}}});
		this.setState(updatedState,()=>{
			this.changeState();
		});
	}

	renderInputs() {
		const NumberInputs = Object.keys(this.state.attributes).map((key)=>{
			return	<NumberInput 
			updateNumber={this.updateNumber.bind(this)}
			key={key}
			name={key}
			value={this.state.attributes[key]}
			label={LANG_DE[key]}
			help={LANG_DE[key+'_help']}
			min={this.props.min}
			max={this.props.max}
			disabled={this.available <= 0}
			/>
		});
		return NumberInputs;
	}

        render () {
	       return (
		       <div className="attributes">
		       	<h2>{LANG_DE.attributes_title}</h2>
		       	<div className="attributes-inputs">
		       		{this.renderInputs()}
		       	</div>
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
				<span className="number-label">{this.props.label}<span className="help">?</span>
				<div className="hover-help" dangerouslySetInnerHTML={{__html: this.props.help}} ></div>
				</span>

				<div className="number-control">
				<button className="number-btn minus" disabled={this.props.value <= this.props.min} 
				onClick={this.clickMinus.bind(this)}>-</button>
				<span className="number-value">{this.props.value}</span>
				<button className="number-btn plus" disabled={this.disablePlus()} onClick={this.clickPlus.bind(this)}>+</button>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

