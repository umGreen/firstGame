import GameFieldView from './gameFieldView';
import {clickAreas} from './gameFieldCellMap';
import settings from './settings';

export default class GameFieldController {
	constructor(configByGameCtrl) {
		this.cfg = configByGameCtrl;

		this._gameFieldBig = new GameFieldView({hover: this.hoverAreas, ctx: this});
	}

	get pixiSprite(){
		return this._gameFieldBig.pixiContainer;
	}

	showHints(arr){
		this._gameFieldBig.showHints(arr);
	}

	hideHints(){
		this._gameFieldBig.hideHints();
	}



	showWinNum(num){
		this._gameFieldBig.showWinHunHint(num);
	}
	hideWinNum(){
		this._gameFieldBig.hideWinHint();

		return this;
	}


	/**
	 * Определение ячеек по клику на игровое поле
	 * @param pos
	 */
	getCellFromPos(pos){
		return clickAreas.find((item)=>{
			return pos.x >= item.x && pos.x < item.x+item.w && pos.y > item.y && pos.y < item.y + item.h
		});
	}

	/**
	 * Наведение на активные области
	 * @param event
	 * @returns {boolean}
	 */
	hoverAreas(event){
		if(!this.cfg.checkChips.call(this.cfg.ctx)) return false;

		// т.к. событие mousemove и touchmove у нас отрабатывают по всей сцене
		// (не важно на что вешаем), то вычисляем координаты нужного поля относительно
		// сцены вручную
		let pos = {
			x: event.data.global.x - settings.position.x,
			y: event.data.global.y - settings.position.y
		};

		let cell = this.getCellFromPos(pos);

		this.hideHints();

		if(cell && cell.numbers.length) this.showHints(cell.numbers);
	}

	/**
	 * /**
	 * Функция по переданным координатам возвращает координаты центра ячейки на игровом поле
	 * (используется для координат ставки)
	 * @param pos - {x, y}
	 * @param global - boolean, используем ли глобальные координаты, или координаты игрового поля
	 * @returns {x, y}
	 */
	getDataForBet(pos, global){
		if(global){
			pos.x -= settings.position.x;
			pos.y -= settings.position.y;
		}

		let cell = this.getCellFromPos(pos);

		if(cell && !cell.cells){
			// Если к ячейке привязаны только её координаты

			let center = !global ? cell.center :
				{x: cell.center.x + settings.position.x,
					y: cell.center.y + settings.position.y};

			let obj = {center: center, numbers: cell.numbers, type: cell.type};
			if(cell.dozen) obj.dozen = cell.dozen;
			if(cell.column) obj.column = cell.column;

			return obj;
		} else if(cell && cell.cells) {
			// Если к ячейке привязаны координаты других ячеек ~~SnakeBet
			let centers = [];

			cell.cells.forEach((item) => {
				let center = !global ? item.center :
					{x: item.center.x + settings.position.x,
						y: item.center.y + settings.position.y};

				let obj = {center: center, numbers: item.numbers, type: item.type};
				if(item.dozen) obj.dozen = item.dozen;
				if(item.column) obj.column = item.column;

				centers.push(obj)
			});

			return centers;
		}
	}

	getPositionForBet(betType, betData){
		let cell;

		cell = betType === 'numbers' ?
			clickAreas.filter(item => item.numbers.equals(betData, true)) :
			clickAreas.filter(item => betData ?
				item.type === betType && item[betType] === betData : item.type === betType);

		return cell[0];
	}

	disable(){
		this._gameFieldBig.disableField();
	}

	enable(){
		this._gameFieldBig.enableField();
	}
}
