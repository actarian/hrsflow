/* jshint esversion: 6 */
/* global TweenMax */

const module = 59; // 98;

export default class Triangle {

	constructor(white) {
		const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		const size = Math.random() < 0.5 ? 60 : 120;
		const filled = Math.random() < 0.15 ? '-fill' : '';
		const color = white ? '-white' : '';
		const name = 'triangle-' + size + filled + color;
		node.appendChild(use);
		// Dom.addClass(node, 'triangle--' + size);
		node.setAttribute('class', 'triangle triangle--' + size);
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + name);
		use.setAttribute('width', size);
		use.setAttribute('height', size);
		this.node = node;
	}

	getRandomPosition(node) {
		const width = node.offsetWidth;
		const height = node.offsetHeight;
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

	appendInto(node, pool) {
		node.appendChild(this.node);
		this.parent = node;
		this.resize(node, pool);
	}

	resize(node, pool) {
		const w2 = window.innerWidth / 2 - node.offsetLeft;
		let position = this.getRandomPosition(node);
		let t = 0;
		while (
			(pool[position.i] !== undefined || (position.x > w2 - 2 * module && position.x < w2 + 2 * module)) &&
			t < 5
		) {
			position = this.getRandomPosition(node);
			t++;
		}
		pool[position.i] = position.i;
		this.position = position;
		this.parent = node;
		this.node.setAttribute('style', `opacity: 0; top: ${position.y}px; left: ${position.x}px; transform: rotate(${position.r}deg);`);
		/*
		TweenMax.set(this.node, {
			opacity: 0,
			transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
		});
		*/
	}

	appear() {
		const position = this.position;
		TweenMax.to(this.node, 1.0, {
			opacity: 1,
			onComplete: () => {
				// this.rotate();
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
		TweenMax.to(this.node, 1.0, {
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
		TweenMax.to(this.node, 1.0, {
			opacity: 0,
			onComplete: () => {
				const position = this.getRandomPosition(this.parent);
				this.position = position;
				this.node.setAttribute('style', `opacity:0; top: ${position.y}px; left: ${position.x}px; transform: rotate(${position.r}deg);`);
				/*
				TweenMax.set(this.node, {
					opacity: 0,
					transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
				});
				*/
				this.appear();
			},
			onCompleteScope: this,
			ease: Quint.easeInOut,
			overwrite: 'all',
		});
	}

	kill() {
		TweenMax.killTweensOf(this.node);
	}

}
