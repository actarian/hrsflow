/* jshint esversion: 6 */
/* global Swiper, TweenLite, TweenMax */

const module = 100;

export class Triangle {

	constructor(white) {
		const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		const size = Math.random() < 0.5 ? 60 : 120;
		const filled = Math.random() < 0.15 ? '-fill' : '';
		const color = white ? '-white' : '';
		const name = 'triangle-' + size + filled + color;
		element.appendChild(use);
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
		this.appear();
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

	tween() {
		TweenMax.to(this.element, 1.0, {
			opacity: Math.min(1, Math.random() * 2),
			onComplete: () => {
				this.tween();
			},
			onCompleteScope: this,
			ease: Quint.easeInOut,
			overwrite: 'all',
			delay: position.i * 0.1,
		});
	}

	render() {
		console.log(this);
	}

}

export class Triangles {

	constructor(element) {
		const triangles = new Array(20).fill(null).map(() => {
			return new Triangle(element.hasAttribute('white'));
		});
		this.element = element;
		this.triangles = triangles;
		const pool = {};
		triangles.forEach((triangle) => {
			triangle.appendInto(element, pool);
		});
	}

	resize() {
		const element = this.element;
		const pool = {};
		this.triangles.forEach((triangle) => {
			triangle.resize(element, pool);
		});
	}

}

export class App {

	constructor() {}

	init() {
		const page = document.querySelector('.page');
		const swiperHero = new Swiper('.swiper-container--home-hero', {
			loop: true,
			effect: 'fade',
			parallax: true,
			spaceBetween: 300,
			speed: 600,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			on: {
				slideChangeTransitionEnd: function() {
					// console.log('slideChange', this.slides.length, this.activeIndex);
					const slide = this.slides[this.activeIndex];
					if (slide) {
						const video = slide.querySelector('video');
						/*
						const videos = [].slice.call(slide.parentNode.querySelectorAll('video'));
						videos.forEach(function(v) {
							if (!video && !!(v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2)) {
								v.pause();
							}
						});
						*/
						if (video) {
							video.play();
							console.log(video);
						}
						// console.log(videos);
					}
				},
			},
			/*
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				dynamicBullets: true,
			},
			*/
		});
		const swiperHilights = new Swiper('.swiper-container--hilights', {
			loop: false,
			/*
			mousewheel: {
				invert: true,
			},
			*/
			parallax: true,
			spaceBetween: 300,
			speed: 600,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				dynamicBullets: true,
			},
		});
		const shadows = [].slice.call(document.querySelectorAll('[data-parallax-shadow]'));
		const animations = [].slice.call(document.querySelectorAll('.triangles')).map((element) => {
			return new Triangles(element);
		});
		const hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
		const mxy = { x: 0, y: 0 };
		this.page = page;
		this.swiperHero = swiperHero;
		this.swiperHilights = swiperHilights;
		this.shadows = shadows;
		this.animations = animations;
		this.hrefs = hrefs;
		this.mxy = mxy;
		window.addEventListener('resize', () => {
			this.resize();
		});
		window.addEventListener('scroll', () => {
			this.scroll();
		});
		document.addEventListener('mousemove', (e) => {
			this.mxy.x = e.clientX / window.innerWidth - 0.5;
			this.mxy.y = e.clientY / window.innerHeight - 0.5;
		});
		hrefs.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
			});
		});
		this.loop();
	}

	render() {
		this.shadows.forEach((element) => {
			const xy = element.xy || { x: 0, y: 0 };
			xy.x += (this.mxy.x - xy.x) / 8;
			xy.y += (this.mxy.y - xy.y) / 8;
			const shadow = element.getAttribute('data-parallax-shadow') || 90;
			const pow = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
			const x = (xy.x * -100).toFixed(2);
			const y = (xy.y * -50).toFixed(2);
			const bs = x + 'px ' + y + 'px ' + shadow + 'px -10px rgba(0, 0, 0, ' + pow + ')';
			if (element.bs !== bs) {
				TweenMax.set(element, {
					// transform: 'translateX(' + (xy.x * -4) + '%) translateY(' + (xy.y * -2) + '%)',
					boxShadow: bs,
				});
				element.bs = bs;
			}
			element.xy = xy;
		});
	}

	loop() {
		this.render();
		window.requestAnimationFrame(() => {
			this.loop();
		});
	}

	scroll() {
		if (window.scrollY > 0) {
			this.page.setAttribute('class', 'page fixed');
		} else {
			this.page.setAttribute('class', 'page');
		}
	}

	resize() {
		this.animations.forEach((animation) => {
			animation.resize();
		});
	}

}

(function() {
	"use strict";

	var app = new App();

	window.onload = () => {
		app.init();
	};

}());
