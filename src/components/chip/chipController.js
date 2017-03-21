import ChipView from './chipView';
import {chipValues} from './../../constants/chipValues';
import {betStore} from './../../servises/betStore'
import {_tevStore, _tev} from './../../servises/touchEvents'

export default class ChipController {
	constructor() {
		let config = {
			onClickCb: this.onClick,
			chipTouchStartCb: this.chipTouchStart,
			ctx: this
		};

		this._chips = {};

		['chip0', 'chip1', 'chip2', 'chip3', 'chip4'].forEach((item)=>{
			let chip = new ChipView(item, config);
			this._chips[item] = chip;
		});
	}

	get chips(){
		return this._chips
	}

	onClick(price){
		let chipType = this.returnChipType(price),
		thisChip = this.chips[chipType];

		for(let key in this.chips){
			if(this.chips[key] === thisChip){
				thisChip.active ?
					thisChip.setDefault() :
					thisChip.setActive();
			} else if(this.chips[key].active) {
				this.chips[key].setDefault();
			}
		}

		betStore.activeChip = thisChip.active ?
			thisChip.chipData() : undefined;
	}

	chipTouchStart(price){
		let chipType = this.returnChipType(price);
		betStore.activeChip = {value: price, type: chipType};
	}

	returnChipType(price){
		let chipType;
		for(let key in chipValues)
			if(chipValues[key] === price) chipType = key;
		return chipType;
	}

	getActiveChip(){
		let chipActive;

		for(let chip in this.chips){
			if(this.chips[chip].active)
				chipActive = this.chips[chip];
		}

		return chipActive;
	}
}
