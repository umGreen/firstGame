import {_pxC, _pxS, _pxT, _pxEx} from './../../constants/PIXIabbr';
import {spriteStore} from './../../constants/presets';
import settings from './settings';

export default class coldNumPanel {
	constructor(numbers) {
		this.numbers = numbers;

		// Текст для этого блока
		let texts = settings.texts.coldNumbers;

		// Контейнер для фишки с тенью и текстом
		this._spriteContainer = new _pxC();

		// Добавление текста в ячейке
		texts.forEach((item) => {
			let newText = item.type === 'gradientText' ?
				new _pxEx.BitmapText(item.text, settings.textStyle[item.type]) :
				new _pxT(item.text, settings.textStyle[item.type]);

			newText.position = {x: item.x || 0, y: item.y || 0};

			this._spriteContainer.addChild(newText);
		});

		this.createNumbers(this.numbers);
	}

	get sprite(){
		return this._spriteContainer;
	}


	/**
	 * Метод создаёт массив PIXI-контейнеров с числами
	 * @param numbers
	 */
	createNumbers(numbers){
		if(!numbers || !numbers.length) return false;

		if(!this.numberSprites) this.numberSprites = [];
		if(this.numberSprites.length) this.deleteNumbers();

		numbers.sort((a, b) => {return a.amount > b.amount});

		numbers.forEach((num, idx) => {
			let item = this.createNumber(num);
			item.position = {x: idx*75+20, y: 80};
			this.numberSprites.push(item);
		});

		this.numberSprites.forEach((item) => {
			this._spriteContainer.addChild(item);
		});
	}

	/**
	 * Метод создает PIXI-контейнер с полученными данными и возвращает его
	 * @param obj
	 * @returns {PIXI.Container}
	 */
	createNumber(obj){
		let color,
			map = settings.numColor;
		for(let key in map)
			if(~map[key].indexOf(obj.number)) color = key;

		if(obj.number === 37) obj.number = '00';

		let numCnt = new _pxC(),
			bg = new _pxS( spriteStore.bgNumbers[color] ),
			num = new _pxT(obj.number, settings.textStyle.number),
			amount = new _pxT(obj.amount, settings.textStyle.amount);

		num.position = {x: 33, y: 33};
		num.anchor.set(0.5);
		amount.position = {x: 35, y: 85};
		amount.anchor.set(0.5);

		numCnt.addChild(bg);
		numCnt.addChild(num);
		numCnt.addChild(amount);

		return numCnt;
	}

	/**
	 * Метод апдейтит горячие номера. Может принмать как массив объектов так и один объект (номер)
	 * @param param
	 */
	updateView(param){
		let str = Object.prototype.toString.call(param);
		let type = str.substr(8, str.length-9).toLowerCase();

		if(type === 'array'){
			param.forEach((item) => {this.numbers.push(item)});
		} else if(type === 'object'){
			this.numbers.push(param);
		}

		this.numbers.sort((a, b) => {return a.amount > b.amount});
		this.numbers.length = 4;

		this.createNumbers(this.numbers);
	}

	/**
	 * И общего контейнера удаляем pixi-контейнеры номеров
	 */
	deleteNumbers(){
		this.numberSprites.forEach((item) => {
			this._spriteContainer.children.forEach((item2) => {
				if(item2 === item) this._spriteContainer.removeChild(item);
			});
		});

		this.numberSprites.length = 0;
	}
}
