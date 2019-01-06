/* jshint esversion: 6 */
/* global window, document, Swiper, TweenMax */

import Dom from './shared/dom';
import Follower from './shared/follower';
import Rect from './shared/rect';
import Triangles from './shared/triangles';
import Utils from './shared/utils';
import Video from './shared/video';

export default class App {

	constructor() {}

	init() {
		const body = document.querySelector('body');
		const page = document.querySelector('.page');
		Dom.detect(body);
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
						if (video) {
							// video.play();
						}
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
		const swipers = [swiperHero, swiperHilights];
		const videos = [].slice.call(document.querySelectorAll('video[playsinline]')).map((node, i) => {
			const video = new Video(node);
			video.i = i;
			return video;
		});
		const triangles = [].slice.call(document.querySelectorAll('.triangles')).map((node, i) => {
			const triangles = new Triangles(node);
			triangles.i = i;
			return triangles;
		});
		const parallaxes = [].slice.call(document.querySelectorAll('[data-parallax]'));
		const shadows = [].slice.call(document.querySelectorAll('[data-parallax-shadow]'));
		const follower = new Follower(document.querySelector('.follower'));
		const hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
		const mouse = { x: 0, y: 0 };
		this.body = body;
		this.page = page;
		this.swiperHero = swiperHero;
		this.swiperHilights = swiperHilights;
		this.swipers = swipers;
		this.videos = videos;
		this.triangles = triangles;
		this.parallaxes = parallaxes;
		this.shadows = shadows;
		this.follower = follower;
		this.hrefs = hrefs;
		this.mouse = mouse;
		this.onResize();
		this.addListeners();
	}

	addListeners() {

		window.addEventListener('resize', () => {
			app.onResize();
		});

		window.addEventListener('scroll', Utils.throttle(() => {
			app.onScroll();
		}, 1000 / 25));

		document.addEventListener('mousemove', (e) => {
			app.onMouseMove(e);
		});

		/*
		// intersection observer
		const intersection = new IntersectionService();
		parallaxes.forEach((node, i) => intersection.observe(node, (entry, ei) => {
			let pow = 1 + 0.1 * i;
			pow = (pow * entry.intersectionRatio);
			node.pow = pow;
		}));
		*/

		// href="#" noop
		this.hrefs.forEach((node) => {
			node.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
			});
		});

	}

	onMouseMove(e) {
		this.mouse.x = e.clientX / window.innerWidth - 0.5;
		this.mouse.y = e.clientY / window.innerHeight - 0.5;
		this.follower.follow(this.hrefs.map(x => Rect.fromNode(x)));
		this.follower.move({
			x: e.clientX,
			y: e.clientY
		});
	}

	onResize() {
		this.windowRect = new Rect({
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight,
		});
		this.triangles.forEach((animation) => {
			animation.resize();
		});
		// this.follower.follow(this.hrefs.map(x => Rect.fromNode(x)));
	}

	onScroll() {
		if (Dom.scrollTop() > 80) {
			this.body.classList.add('fixed');
		} else {
			this.body.classList.remove('fixed');
		}
		// this.follower.follow(this.hrefs.map(x => Rect.fromNode(x)));
	}

	render() {

		// smoothscroll
		if (!Dom.overscroll && !Dom.touch) {
			if (this.body.offsetHeight !== this.page.offsetHeight) {
				TweenMax.set(this.body, {
					height: this.page.offsetHeight,
				});
			}
			let top = this.page.top || 0;
			top += (-Dom.scrollTop() - top) / 10;
			top = Math.round(top * 10) / 10;
			if (this.page.top !== top) {
				this.page.top = top;
				TweenMax.set(this.page, {
					y: top,
				});
			}
		} else if (this.body.hasAttribute('style')) {
			this.body.removeAttribute('style');
		}

		// shadows
		this.shadows.forEach((node) => {
			const xy = node.xy || { x: 0, y: 0 };
			xy.x += (this.mouse.x - xy.x) / 8;
			xy.y += (this.mouse.y - xy.y) / 8;
			const shadow = node.getAttribute('data-parallax-shadow') || 90;
			const alpha = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
			const x = (xy.x * -100).toFixed(2);
			const y = (xy.y * -50).toFixed(2);
			const boxShadow = x + 'px ' + y + 'px ' + shadow + 'px -10px rgba(0, 0, 0, ' + alpha + ')';
			// if (node.boxShadow !== boxShadow) {
			// 	node.boxShadow = boxShadow;
			TweenMax.set(node, {
				boxShadow: boxShadow,
			});
			// }
			node.xy = xy;
		});

		// swipers
		this.swipers.forEach((swiper, i) => {
			const node = swiper.el;
			let rect = Rect.fromNode(node);
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0) {
				if (!swiper.autoplay.running) {
					swiper.autoplay.start();
				}
			} else {
				if (swiper.autoplay.running) {
					swiper.autoplay.stop();
				}
			}
		});

		// videos
		this.videos.forEach((video, i) => {
			const node = video.node;
			let rect = Rect.fromNode(node);
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0) {
				video.appear();
			} else {
				video.disappear();
			}
		});

		// triangles
		this.triangles.forEach((triangle, i) => {
			const node = triangle.node;
			let rect = Rect.fromNode(node);
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0) {
				triangle.appear();
			} else {
				triangle.disappear();
			}
		});

		// parallax
		this.parallaxes.forEach((node, i) => {
			let currentY = node.currentY || 0;
			let rect = Rect.fromNode(node);
			rect = new Rect({
				top: rect.top - currentY,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			});
			const intersection = rect.intersection(this.windowRect);
			// if (intersection.y > 0) {}
			currentY = intersection.center.y * parseInt(node.getAttribute('data-parallax'));
			if (node.currentY !== currentY) {
				node.currentY = currentY;
				TweenMax.set(node, {
					transform: 'translateY(' + currentY + 'px)',
				});
			}
			// }
		});

		// follower
		this.follower.render();

	}

	loop() {
		this.render();
		if (this.playing) {
			window.requestAnimationFrame(() => {
				this.loop();
			});
		}
	}

	play() {
		this.playing = true;
		this.loop();
	}

	pause() {
		this.playing = false;
	}

}

var app = new App();

window.onload = () => {
	app.init();
	app.play();
};
