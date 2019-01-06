/* jshint esversion: 6 */
/* global TweenMax */

const friction = 8;

export default class Follower {

	constructor(node) {
		this.node = node;
		this.x = 0;
		this.y = 0;
		this.s = 0;
		this.opacity = 0;
		this.mouse = { x: 0, y: 0 };
		this.rects = [];
	}

	follow(rects) {
		this.rects = rects;
	}

	move(mouse) {
		this.mouse = mouse;
	}

	render() {
		let ex = this.mouse.x;
		let ey = this.mouse.y;
		let es = 0.25;
		const magnet = this.rects.reduce((p, rect) => {
			const dx = Math.abs(ex - rect.center.x);
			const dy = Math.abs(ey - rect.center.y);
			if (dx < p.dx && dx < 100 &&
				dy < p.dy && dy < 100) {
				return {
					match: true,
					x: rect.center.x,
					y: rect.center.y,
					dx,
					dy,
				};
			} else {
				return p;
			}
		}, { match: false, x: 0, y: 0, dx: Number.POSITIVE_INFINITY, dy: Number.POSITIVE_INFINITY });
		if (magnet.match) {
			ex = magnet.x;
			ey = magnet.y;
			es = 1;
		}
		this.x += (ex - this.x) / friction;
		this.y += (ey - this.y) / friction;
		this.s += (es - this.s) / friction;
		this.opacity += (1.0 - this.opacity) / friction;
		TweenMax.set(this.node, {
			opacity: this.opacity,
			transform: `translateX(${this.x}px) translateY(${this.y}px) scale3d(${this.s},${this.s},${this.s})`,
		});
	}

}
