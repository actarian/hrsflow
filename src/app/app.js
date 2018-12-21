/* jshint esversion: 6 */
/* global window, document, Swiper, TweenMax */

import Dom from './shared/dom';
import Rect from './shared/rect';
import Triangles from './shared/triangles';

export default class App {

	constructor() {}

	init() {
		const body = document.querySelector('body');
		const page = document.querySelector('.page');
		const swiperHero = new Swiper('.swiper-container--home-hero', {
			loop: true,
			// effect: 'fade',
			// followFinger: true,
			parallax: true,
			spaceBetween: 0,
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
		const elements = [].slice.call(document.querySelectorAll('.case-studies__item'));
		const hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
		const mxy = { x: 0, y: 0 };
		this.body = body;
		this.page = page;
		this.swiperHero = swiperHero;
		this.swiperHilights = swiperHilights;
		this.shadows = shadows;
		this.animations = animations;
		this.elements = elements;
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
		/*
		const intersection = new IntersectionService();
		elements.forEach((element, i) => intersection.observe(element, (entry, ei) => {
			let pow = 1 + 0.1 * i;
			pow = (pow * entry.intersectionRatio);
			element.pow = pow;
		}));
		*/
		this.resize();
		this.loop();
	}

	render() {
		// smoothscroll
		if (this.body.offsetHeight !== this.page.offsetHeight) {
			TweenMax.set(this.body, {
				height: this.page.offsetHeight,
			});
		}
		let cy = this.page.cy || 0;
		cy += (-window.scrollY - cy) / 10;
		this.page.cy = cy;
		TweenMax.set(this.page, {
			y: cy,
		});
		// shadows
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
		// parallax
		/*
		this.elements.forEach((element, i) => {
			if (element.parentNode) {
				const parentRect = element.parentNode.getBoundingClientRect();
				const rect = new Rect({
					top: parentRect.top + element.offsetTop,
					left: parentRect.left + element.offsetLeft,
					width: element.offsetWidth,
					height: element.offsetHeight,
				});
				const intersection = rect.intersection(this.windowRect);
				element.intersection = intersection;
				TweenMax.set(element, {
					y: element.intersection.center.y * (100 + 30 * i),
				});
			}
		});
		/*
		this.elements.forEach((element, i) => {
			if (element.intersection) {
				let pow = element.pow || 0;
				pow += (element.intersection.center.y - pow) / 10;
				element.pow = pow;
				TweenMax.set(element, {
					// opacity: pow,
					// y: pow * 100,
					y: element.intersection.center.y * 100,
				});
			}
		});
		*/
	}

	loop() {
		this.render();
		window.requestAnimationFrame(() => {
			this.loop();
		});
	}

	resize() {
		this.windowRect = new Rect({
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight,
		});
		this.animations.forEach((animation) => {
			animation.resize();
		});
	}

	scroll() {
		if (window.scrollY > 0) {
			Dom.addClass(this.body, 'fixed');
		} else {
			Dom.removeClass(this.body, 'fixed');
		}
		/*
		const wrect = new Rect({
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight,
		});
		this.elements.forEach((element, i) => {
			if (element.parentNode) {
				const parentRect = element.parentNode.getBoundingClientRect();
				const rect = new Rect({
					top: parentRect.top + element.offsetTop,
					left: parentRect.left + element.offsetLeft,
					width: element.offsetWidth,
					height: element.offsetHeight,
				});
				const intersection = rect.intersection(wrect);
				element.intersection = intersection;
			}
		});
		*/
		/*
		TweenMax.to(this.page, 1.650, {
			y: -window.scrollY,
			ease: Quad.easeOut,
			overwrite: 'all',
		});
		*/
	}

}

var app = new App();

window.onload = () => {
	app.init();
};
