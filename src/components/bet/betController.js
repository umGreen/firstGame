import BetView from './betView';
import settings from './settings';

export default class BetController {
	constructor(configByGameCtrl) {
		this._numbers = configByGameCtrl.info.numbers;
		this._type = configByGameCtrl.info.type;
		this._moreType = configByGameCtrl.info[ configByGameCtrl.info.type ];

		let config = configByGameCtrl;
		config.limits = settings.limits[ this._numbers.length ];

		this._betView = new BetView(config);
	}

	get betSprite(){
		return this._betView.betViewContainer
	}

	get balance(){
		return this._betView.balance;
	}

	get numbers(){
		return this._numbers;
	}

	get type(){
		return this._type;
	}

	get moreType(){
		return this._moreType;
	}

	updateBet(value){
		this._betView.updateBet(value)
	}

	getTopChipValue(){
		return this._betView.getTopChipValue();
	}

	lock(lockStatus){
		this._betView.lock(lockStatus);
	}

	clearBet(){
		this._betView.clearBet();
	}
}