/* jshint esversion: 6 */
/* global TweenMax */

import Utils from './utils';

const friction = 5;
const friction2 = 1;
const size = 20;

export default class Follower {

	constructor(node) {
		this.enabled = false;
		this.node = node;
		this.div1 = node.querySelectorAll('div')[0];
		this.div2 = node.querySelectorAll('div')[1];
		this.x = 0;
		this.y = 0;
		this.x2 = 0;
		this.y2 = 0;
		this.w = size;
		this.h = size;
		this.r = size / 2;
		this.s = 0;
		this.o = 0;
		this.mouse = { x: 0, y: 0 };
		this.rects = [];
		this.magnet = null;
		this.setMagnetThrottled = Utils.throttle(() => {
			return this.setMagnet();
		}, 100);
	}

	follow(rects) {
		this.rects = rects;
	}

	move(mouse) {
		this.mouse = mouse;
	}

	setMagnet() {
		const magnet = this.rects.reduce((p, rect) => {
			if (rect.contains(this.mouse.x, this.mouse.y)) {
				return {
					match: true,
					x: rect.left,
					y: rect.bottom - 3,
					width: rect.width,
					height: 3,
					radius: 0,
					scale: 1,
					opacity: 1,
				};
			} else {
				return p;
			}
		}, {
			match: false,
			x: this.mouse.x - size / 2,
			y: this.mouse.y - size / 2,
			width: size,
			height: size,
			radius: 75,
			scale: 0.25,
			opacity: 0.0,
		});
		this.magnet = magnet;
	}

	render() {
		if (window.innerWidth >= 1024 && this.mouse.x && this.mouse.y) {
			this.setMagnetThrottled();
			const magnet = this.magnet;
			// console.log(magnet);
			/*
			const magnet = this.rects.reduce((p, rect) => {
				if (rect.contains(this.mouse.x, this.mouse.y)) {
					return {
						match: true,
						x: rect.left,
						y: rect.bottom - 3,
						width: rect.width,
						height: 3,
						radius: 0,
						scale: 1,
						opacity: 1,
					};
				} else {
					return p;
				}
			}, {
				match: false,
				x: this.mouse.x - size / 2,
				y: this.mouse.y - size / 2,
				width: size,
				height: size,
				radius: 75,
				scale: 0.25,
				opacity: 0.0,
			});
			*/
			this.x += (magnet.x - this.x) / friction;
			this.y += (magnet.y - this.y) / friction;
			this.x2 += (this.mouse.x - this.x2) / friction2;
			this.y2 += (this.mouse.y - this.y2) / friction2;
			this.w += (magnet.width - this.w) / friction;
			this.h += (magnet.height - this.h) / friction;
			this.r += (magnet.radius - this.r) / friction;
			// this.s += (magnet.scale - this.s) / friction;
			// this.o += (magnet.opacity - this.o) / friction;
			TweenMax.set(this.div1, {
				opacity: 1,
				// width: `${this.w}px`,
				// height: `${this.h}px`,
				// transform: `translateX(${this.x}px) translateY(${this.y}px)`,
				// borderRadius: `${magnet.radius}px`,
				transform: `translateX(${this.x + this.w / 2 - 50}px) translateY(${this.y + this.h / 2 - 50}px) scale3d(${this.w / 100},${this.h / 100},1.0)`,
			});
			TweenMax.set(this.div2, {
				opacity: 1,
				transform: `translateX(${this.x2}px) translateY(${this.y2}px)`,
			});
		} else {
			TweenMax.set(this.div1, {
				opacity: 0,
			});
			TweenMax.set(this.div2, {
				opacity: 0,
			});
		}
	}

}
