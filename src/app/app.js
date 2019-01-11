/* jshint esversion: 6 */
/* global window, document, Swiper, TweenMax, TimelineMax */

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
				init: function() {
					this.el.classList.add('ready');
				},
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
			on: {
				init: function() {
					this.el.classList.add('ready');
				},
			}
		});
		const swiperGallery = new Swiper('.swiper-container--gallery', {
			loop: false,
			slidesPerView: 'auto',
			spaceBetween: 45,
			speed: 600,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				dynamicBullets: true,
			},
			on: {
				init: function() {
					this.el.classList.add('ready');
				},
			}
		});
		const swipers = [swiperHero, swiperHilights, swiperGallery].filter(swiper => swiper.el !== undefined);
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
		const shadows = [].slice.call(document.querySelectorAll('[data-shadow]'));
		const appears = [].slice.call(document.querySelectorAll('[data-appear]'));
		const follower = new Follower(document.querySelector('.follower'));
		const hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
		const links = [].slice.call(document.querySelectorAll('.btn, .nav:not(.nav--service)>li>a'));
		const togglers = [].slice.call(document.querySelectorAll('[toggle]'));
		const mouse = { x: 0, y: 0 };
		const timeline = new TimelineMax();
		if (follower.enabled) {
			body.classList.add('follower-enabled');
		}
		this.body = body;
		this.page = page;
		this.swiperHero = swiperHero;
		this.swiperHilights = swiperHilights;
		this.swipers = swipers;
		this.videos = videos;
		this.triangles = triangles;
		this.parallaxes = parallaxes;
		this.shadows = shadows;
		this.appears = appears;
		this.follower = follower;
		this.hrefs = hrefs;
		this.links = links;
		this.togglers = togglers;
		this.mouse = mouse;
		this.timeline = timeline;
		this.onResize();
		this.addListeners();
		body.classList.add('ready');
	}

	addListeners() {

		window.addEventListener('resize', () => {
			app.onResize();
		});

		/*
		window.addEventListener('scroll', Utils.debounce(() => {
			app.onScroll();
		}));
		*/

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

		this.togglers.forEach((node) => {
			node.addEventListener('click', (e) => {
				let target = node.getAttribute('toggle');
				target = target ? document.querySelector(target) : node;
				let toggle = node.getAttribute('toggle-class') || 'active';
				if (target.classList.contains(toggle)) {
					target.classList.remove(toggle);
				} else {
					target.classList.add(toggle);
				}
				e.preventDefault();
				e.stopImmediatePropagation();
			});
		});

	}

	onMouseMove(e) {
		this.mouse.x = e.clientX / window.innerWidth - 0.5;
		this.mouse.y = e.clientY / window.innerHeight - 0.5;
		if (this.follower.enabled) {
			this.follower.follow(this.links.map(x => Rect.fromNode(x)));
			this.follower.move({
				x: e.clientX,
				y: e.clientY
			});
		}
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
		// this.follower.follow(this.links.map(x => Rect.fromNode(x)));
	}

	onScroll() {
		const scrollTop = Dom.scrollTop();
		// fastscroll mobile
		if (Dom.fastscroll) {
			const newTop = Math.round(scrollTop * 10) / 10;
			if (this.page.previousTop !== newTop) {
				this.page.previousTop = newTop;
				Dom.scrolling = true;
			} else {
				Dom.scrolling = false;
			}
		}
		if (scrollTop > 80) {
			this.body.classList.add('fixed');
		} else {
			this.body.classList.remove('fixed');
		}
		// this.follower.follow(this.links.map(x => Rect.fromNode(x)));
	}

	render() {

		// smoothscroll desktop
		// if (!Dom.overscroll && !Dom.touch) {
		if (!Dom.fastscroll) {
			const scrollTop = Dom.scrollTop();
			if (this.body.offsetHeight !== this.page.offsetHeight) {
				this.body.setAttribute('style', `height: ${this.page.offsetHeight}px;`);
				/*
				TweenMax.set(this.body, {
					height: this.page.offsetHeight,
				});
				*/
			}
			let newTop = this.page.previousTop || 0;
			newTop += (scrollTop - newTop) / 10;
			newTop = Math.round(newTop * 10) / 10;
			if (this.page.previousTop !== newTop) {
				this.page.previousTop = newTop;
				// this.page.setAttribute('style', `top: ${-newTop}px;`);
				this.page.setAttribute('style', `transform: translateY(${-newTop}px);`);
				/*
				TweenMax.set(this.page, {
					y: -newTop,
				});
				*/
				Dom.scrolling = true;
			} else {
				Dom.scrolling = false;
			}
		} else if (this.body.hasAttribute('style')) {
			this.body.removeAttribute('style');
		}

		if (!Dom.scrolling) {
			// shadows
			this.shadows.forEach((node) => {
				const xy = node.xy || { x: 0, y: 0 };
				const dx = this.mouse.x - xy.x;
				const dy = this.mouse.y - xy.y;
				xy.x += dx / 8;
				xy.y += dy / 8;
				const shadow = node.getAttribute('data-shadow') || 90;
				const alpha = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
				const x = (xy.x * -100).toFixed(2);
				const y = (xy.y * -50).toFixed(2);
				const boxShadow = `${x}px ${y}px ${shadow}px -10px rgba(0, 0, 0, ${alpha})`;
				// if (node.boxShadow !== boxShadow) {
				// 	node.boxShadow = boxShadow;
				node.setAttribute('style', `box-shadow: ${boxShadow}`);
				/*
				TweenMax.set(node, {
					boxShadow: boxShadow,
				});
				*/
				// }
				node.xy = xy;
			});
		}

		// swipers
		this.swipers.forEach((swiper, i) => {
			if (swiper.params.autoplay.enabled) {
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

		if (!Dom.mobile) {

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
			/*
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
				currentY = intersection.center.y * parseInt(node.getAttribute('data-parallax'));
				if (node.currentY !== currentY) {
					node.currentY = currentY;
					TweenMax.set(node, {
						transform: 'translateY(' + currentY + 'px)',
					});
				}
			});
			*/
			this.parallaxes.forEach((node, i) => {
				const parallax = node.parallax || (node.parallax = parseInt(node.getAttribute('data-parallax')) || 5);
				const direction = i % 2 === 0 ? 1 : -1;
				let currentY = node.currentY || 0;
				let rect = Rect.fromNode(node);
				rect = new Rect({
					top: rect.top - currentY,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				});
				const intersection = rect.intersection(this.windowRect);
				if (intersection.y > 0) {
					const y = Math.min(1, Math.max(-1, intersection.center.y));
					const s = (100 + parallax * 2) / 100;
					currentY = (y * parallax * direction).toFixed(3);
					if (node.currentY !== currentY) {
						node.currentY = currentY;
						// node.setAttribute('style', `left: 50%; top:${currentY}%;`);
						node.setAttribute('style', `left: 50%; transform: translateX(-50%) translateY(${currentY}%) scale3d(${s},${s},1.0);`);
					}
				}
			});

			// follower
			if (this.follower.enabled) {
				this.follower.render();
			}

		}

		// appears
		let fi = 0;
		this.appears.forEach((node, i) => {
			let rect = Rect.fromNode(node);
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0) {
				fi = fi || i;
				/*
				let overlap = '-=0.3';
				if (!this.timeline.isActive()) {
					overlap = '+=0';
				}
				this.timeline.to(node, 0.5, { autoAlpha: 1 }, overlap);
				*/
				if (!node.to) {
					node.to = setTimeout(() => {
						node.classList.add('appeared');
					}, 150 * (i - fi));
				}
			} else {
				if (node.classList.contains('appeared')) {
					node.to = null;
					node.classList.remove('appeared');
				}
			}
		});

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
