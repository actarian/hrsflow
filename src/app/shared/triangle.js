/* jshint esversion: 6 */
/* global TweenMax */

const module = 98;

export default class Triangle {

	constructor(white) {
		const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		const size = Math.random() < 0.5 ? 60 : 120;
		const filled = Math.random() < 0.15 ? '-fill' : '';
		const color = white ? '-white' : '';
		const name = 'triangle-' + size + filled + color;
		element.appendChild(use);
		// Dom.addClass(element, 'triangle--' + size);
		element.setAttribute('class', 'triangle triangle--' + size);
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + name);
		use.setAttribute('width', size);
		use.setAttribute('height', size);
		this.element = element;
	}

	getRandomPosition(element) {
		const width = element.offsetWidth;
		const height = element.offsetHeight;
		const r = Math.floor(Math.random() * 4) * 90;
		const x = Math.floor((Math.random() * width) / module);
		const y = Math.floor((Math.random() * height) / module);
		const i = y * 30 + x;
		return {
			r: r,
			x: x * module,
			y: y * module,
			i: i,
		};
	}

	appendInto(element, pool) {
		element.appendChild(this.element);
		this.parent = element;
		this.resize(element, pool);
	}

	resize(element, pool) {
		let position = this.getRandomPosition(element);
		let t = 0;
		while (pool[position.i] !== undefined && t < 5) {
			position = this.getRandomPosition(element);
			t++;
		}
		pool[position.i] = position.i;
		this.position = position;
		this.parent = element;
		TweenMax.set(this.element, {
			opacity: 0,
			transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
		});
	}

	appear() {
		const position = this.position;
		TweenMax.to(this.element, 1.0, {
			opacity: 1,
			onComplete: () => {
				this.rotate();
			},
			onCompleteScope: this,
			ease: Quint.easeInOut,
			overwrite: 'all',
			delay: position.i * 0.02,
		});
	}

	rotate() {
		const position = this.position;
		const i = (position.x / module) - 1;
		position.x = i * module;
		TweenMax.to(this.element, 1.0, {
			// transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%)',
			x: position.x + '%',
			directionalRotation: '90_cw',
			onComplete: () => {
				this.disappear();
			},
			onCompleteScope: this,
			ease: Quint.easeInOut,
			overwrite: 'all',
			delay: 3 + Math.floor(Math.random() * 10),
		});
	}

	disappear() {
		TweenMax.to(this.element, 1.0, {
			opacity: 0,
			onComplete: () => {
				const position = this.getRandomPosition(this.parent);
				this.position = position;
				TweenMax.set(this.element, {
					opacity: 0,
					transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
				});
				this.appear();
			},
			onCompleteScope: this,
			ease: Quint.easeInOut,
			overwrite: 'all',
		});
	}

	kill() {
		TweenMax.killTweensOf(this.element);
	}

}
