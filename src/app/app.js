/* jshint esversion: 6 */
/* global window, document, Swiper, TweenMax, TimelineMax */

import Dom from './shared/dom';
import Follower from './shared/follower';
import Rect from './shared/rect';
import Triangles from './shared/triangles';
import Utils from './shared/utils';
import Video from './shared/video';

const shadowsEnabled = false;
let menuStyle = 1;

export default class App {

	constructor() {}

	init() {

		Element.prototype.scrollIntoView_ = Element.prototype.scrollIntoView;
		Element.prototype.scrollIntoView = function() {
			if (Dom.fastscroll) {
				return this.scrollIntoView_.apply(this, arguments);
			} else {
				let rect = Rect.fromNode(this);
				const scrollTop = Dom.scrollTop();
				window.scrollTo(0, Math.max(0, scrollTop + rect.top - 120));
			}
		};

		/*
		document.addEventListener('click', (e) => {
			e.target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
		});
		*/

		const body = document.querySelector('body');
		menuStyle = body.classList.contains('fixed') ? 0 : 1;
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
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
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
		const swiperMedia = new Swiper('.swiper-container--media', {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 600,
			simulateTouch: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			on: {
				init: function() {
					this.el.classList.add('ready');
				},
			}
		});
		const swipers = [swiperHero, swiperHilights, swiperGallery, swiperMedia].filter(swiper => swiper.el !== undefined);
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
		appears.forEach((node) => {
			// node.appearingIndex = [].slice.call(node.parentNode.childNodes).filter(x => x.nodeType === 1 && x.hasAttribute('data-appear')).indexOf(node);
			let section = node.parentNode;
			let p = node;
			while (p) {
				p = p.parentNode;
				if (p && p.classList && p.classList.contains('section')) {
					section = p;
					p = null;
				}
			}
			node.appearingIndex = [].slice.call(section.querySelectorAll('[data-appear]')).indexOf(node);
		});
		const follower = new Follower(document.querySelector('.follower'));
		const hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
		const links = [].slice.call(document.querySelectorAll('.btn, .nav:not(.nav--service)>li>a'));
		const togglers = [].slice.call(document.querySelectorAll('[toggle]'));
		const focuses = [].slice.call(document.querySelectorAll('[focus]'));
		const stickys = [].slice.call(document.querySelectorAll('[sticky]'));
		stickys.forEach(x => x.content = x.querySelector('[sticky-content]'));
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
		this.stickys = stickys;
		this.follower = follower;
		this.hrefs = hrefs;
		this.links = links;
		this.togglers = togglers;
		this.focuses = focuses;
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

		window.addEventListener('wheel', (e) => {
			app.onWheel(e);
		});

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
				const selector = node.getAttribute('toggle');
				const target = selector ? (selector === ':parent' ? node.parentNode : document.querySelector(selector)) : node;
				const toggle = node.getAttribute('toggle-class') || 'active';
				if (target.classList.contains(toggle)) {
					target.classList.remove(toggle);
				} else {
					target.classList.add(toggle);
				}
				// e.preventDefault();
				e.stopPropagation();
			});
		});

		this.focuses.forEach((node) => {
			const doFocus = (e) => {
				const selector = node.getAttribute('focus');
				const target = selector ? (selector === ':parent' ? node.parentNode : document.querySelector(selector)) : node;
				target.focus();
				target.select();
				// e.preventDefault();
				e.stopPropagation();
			};
			node.addEventListener('touchstart', doFocus);
			node.addEventListener('mouseenter', doFocus);
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

	onScroll(e) {
		const scrollTop = Dom.scrollTop();
		// fastscroll mobile
		if (Dom.fastscroll) {
			const newTop = Math.round(scrollTop * 10) / 10;
			if (this.page.previousTop !== newTop) {
				this.page.previousTop = newTop;
				Dom.scrolling = true;
				if (newTop > this.page.previousTop) {
					this.body.classList.add('scroll-up');
					this.body.classList.remove('scroll-down');
				} else {
					this.body.classList.remove('scroll-up');
					this.body.classList.add('scroll-down');
				}
			} else {
				Dom.scrolling = false;
			}
		}
		if (scrollTop > 80) {
			this.body.classList.add('fixed');
		} else if (menuStyle === 1) {
			this.body.classList.remove('fixed');
		}
		// !!! this.appears = [].slice.call(document.querySelectorAll('[data-appear]'));
		// this.follower.follow(this.links.map(x => Rect.fromNode(x)));
	}

	onWheel(e) {
		if (e.deltaY > 0) {
			this.body.classList.add('scroll-up');
			this.body.classList.remove('scroll-down');
		} else {
			this.body.classList.remove('scroll-up');
			this.body.classList.add('scroll-down');
		}
	}

	render() {

		// smoothscroll desktop
		// if (!Dom.overscroll && !Dom.touch) {
		if (!Dom.fastscroll) {
			if (this.body.offsetHeight !== this.page.offsetHeight) {
				this.body.setAttribute('style', `height: ${this.page.offsetHeight}px;`);
				/*
				TweenMax.set(this.body, {
					height: this.page.offsetHeight,
				});
				*/
			}
			const scrollTop = Dom.scrollTop();
			let newTop = this.page.previousTop || 0;
			newTop += (scrollTop - newTop) / 5;
			if (Math.abs(scrollTop - newTop) < 0.15) {
				newTop = scrollTop;
			}
			if (newTop !== undefined && !Number.isNaN(newTop) && this.page.previousTop !== newTop) {
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
			this.page.removeAttribute('style');
		}

		if (shadowsEnabled && !Dom.scrolling) {
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
			if (swiper.params.autoplay.enabled && !swiper.params.autoplay.disableOnInteraction) {
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
			if (intersection.y > 0 && intersection.x > 0) {
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

			// follower
			if (this.follower.enabled) {
				this.follower.render();
			}

		}

		this.parallaxes.forEach((node, i) => {
			const parallax = node.parallax || (node.parallax = parseInt(node.getAttribute('data-parallax')) || 5) * 2;
			const direction = i % 2 === 0 ? 1 : -1;
			let currentY = node.currentY || 0;
			let rect = Rect.fromNode(node);
			rect = new Rect({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			});
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0) {
				const y = Math.min(1, Math.max(-1, intersection.center.y));
				const s = (100 + parallax * 2) / 100;
				currentY = (-50 + (y * parallax * direction)).toFixed(3);
				if (node.currentY !== currentY) {
					node.currentY = currentY;
					if (node.parentNode.classList.contains('background')) {
						node.setAttribute('style', `height: ${s * 100}%; top: 50%; left: 50%; transform: translateX(-50%) translateY(${currentY}%);`);
					} else {
						node.setAttribute('style', `height: ${s * 100}%; top: 50%; left: 50%; transform: translateX(-50%) translateY(${currentY}%);`);
					}
				}
			}
		});

		// appears
		// let firstVisibleIndex = 0;
		this.appears.forEach((node, i) => {
			let rect = Rect.fromNode(node);
			const intersection = rect.intersection(this.windowRect);
			if (intersection.y > 0.0) {
				// if (intersection.center.y < 0.45) {
				// console.log(intersection.center.y);
				// 	firstVisibleIndex = firstVisibleIndex || i;
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
					}, 150 * node.appearingIndex); // (i - firstVisibleIndex));
				}
			} else {
				if (node.classList.contains('appeared')) {
					node.to = null;
					node.classList.remove('appeared');
				}
			}
		});

		this.stickys.forEach((node, i) => {
			let top = parseInt(node.getAttribute('sticky')) || 0;
			let rect = Rect.fromNode(node);
			const maxtop = node.offsetHeight - node.content.offsetHeight;
			if (rect.left > 30) {
				top = Math.max(0, Math.min(maxtop, top - rect.top));
				node.content.setAttribute('style', `transform: translateY(${top}px);`);
			} else {
				node.content.setAttribute('style', `transform: none;`);
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
