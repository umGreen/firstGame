import PIXI from 'pixi.js';
import {spritesStore} from './../../spritesStore';
import {styles} from './../../constants/styles';

export default class FloatChipView extends PIXI.Sprite {
	constructor() {
		super();

		// Контейнер для плавающей фишки
		this._floatChipsContainer = new PIXI.Container();
		this._floatChipsContainer.x = 50;
		this._floatChipsContainer.y = 50;
		this._floatChipsContainer.visible = false;

		['chipSm0', 'chipSm1', 'chipSm2', 'chipSm3', 'chipSm4'].forEach((chipType)=>{
			let floatChipSprite = new PIXI.Sprite( spritesStore.chips[chipType] );
			floatChipSprite.visible = false;
			floatChipSprite.anchor.set(0.5);
			this._floatChipsContainer.addChild(floatChipSprite);
		});

		// Значение на фишке
		let chipValueText = new PIXI.Text(';)', styles.floatChipTextStyle);
		chipValueText.visible = false;
		this._floatChipsContainer.addChild(chipValueText);
		chipValueText.anchor.x = 0.5;
		chipValueText.anchor.y = 0.55;
	}

	/**
	 * Возвращает контейнер со спрайтами фишек, тенью и текстом
	 * @returns {PIXI.Container|*}
	 */
	get floatChipContainer(){
		return this._floatChipsContainer;
	}

	setText(text){
		// let chipValueText = new PIXI.Text( text, floatChipTextStyle );
	}

	/**
	 * Функция показывает плавающую фишку
	 * @param type - тип показываемой фишки
	 * @param text - устанавливаемый текст
	 */
	viewFloatChip(type, value){
		let arr = ['fChip0', 'fChip1', 'fChip2', 'fChip3', 'fChip4'],
			idx = arr.indexOf(type);

		this.hideFloatChips();

		this._floatChipsContainer.visible = true;
		this._floatChipsContainer.children[idx].visible = true;

		this._floatChipsContainer.children[5].text = this.formatChipValue(value);
		this._floatChipsContainer.children[5].visible = true;
	}

	/**
	 * Скрывает все фишки и текст с тенью
	 */
	hideFloatChips(){
		this._floatChipsContainer.children.forEach((fChip)=>{
			fChip.visible = false;
		})
	}

	/**
	 * Установка позиции контейнера со спрайтом фишки
	 * @param pos - {x: Number, y: Number}
	 */
	setPosition(pos){
		this._floatChipsContainer.x = pos.x;
		this._floatChipsContainer.y = pos.y;
	}

	/**
	 * Форматирование значения ставки
	 * @param value
	 * @returns {string}
	 */
	formatChipValue(value){
		let str = value;
		str = str.toString();
		return (str.length > 3) ? str.substring(0, 1) + 'K' : value;
	}
}