/* global Swiper, TweenLite, TweenMax */

(function() {
	"use strict";

	var swiperHero = new Swiper('.swiper-container--home-hero', {
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
				var slide = this.slides[this.activeIndex];
				if (slide) {
					var video = slide.querySelector('video');
					/*
					var videos = [].slice.call(slide.parentNode.querySelectorAll('video'));
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

	var swiperHilights = new Swiper('.swiper-container--hilights', {
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

	var module = 100;

	function Triangle(white) {
		var element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		var size = Math.random() < 0.5 ? 60 : 120;
		var filled = Math.random() < 0.15 ? '-fill' : '';
		var color = white ? '-white' : '';
		var name = 'triangle-' + size + filled + color;
		element.appendChild(use);
		element.setAttribute('class', 'triangle triangle--' + size);
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + name);
		use.setAttribute('width', size);
		use.setAttribute('height', size);
		this.element = element;
	}

	Triangle.prototype = {
		getRandomPosition: function(element) {
			var width = element.offsetWidth;
			var height = element.offsetHeight;
			var r = Math.floor(Math.random() * 4) * 90;
			var x = Math.floor((Math.random() * width) / module);
			var y = Math.floor((Math.random() * height) / module);
			var i = y * 30 + x;
			return {
				r: r,
				x: x * module,
				y: y * module,
				i: i,
			};
		},
		appendInto: function(element, pool) {
			element.appendChild(this.element);
			this.resize(element, pool);
		},
		resize: function(element, pool) {
			var position = this.getRandomPosition(element);
			var t = 0;
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
		},
		appear: function() {
			var position = this.position;
			TweenMax.to(this.element, 1.0, {
				opacity: 1,
				onComplete: function() {
					this.rotate();
				},
				onCompleteScope: this,
				ease: Quint.easeInOut,
				overwrite: 'all',
				delay: position.i * 0.02,
			});
		},
		rotate: function() {
			var position = this.position;
			var i = (position.x / module) - 1;
			position.x = i * module;
			TweenMax.to(this.element, 1.0, {
				// transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%)',
				x: position.x + '%',
				directionalRotation: '90_cw',
				onComplete: function() {
					this.disappear();
				},
				onCompleteScope: this,
				ease: Quint.easeInOut,
				overwrite: 'all',
				delay: 3 + Math.floor(Math.random() * 10),
			});
		},
		disappear: function() {
			TweenMax.to(this.element, 1.0, {
				opacity: 0,
				onComplete: function() {
					var position = this.getRandomPosition(this.parent);
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
		},
		tween: function() {
			TweenMax.to(this.element, 1.0, {
				opacity: Math.min(1, Math.random() * 2),
				onComplete: function() {
					this.tween();
				},
				onCompleteScope: this,
				ease: Quint.easeInOut,
				overwrite: 'all',
				delay: position.i * 0.1,
			});
		},
		render: function() {
			console.log(this);
		},
	};

	function Triangles(element) {
		var triangles = new Array(20).fill(null).map(function() {
			return new Triangle(element.hasAttribute('white'));
		});
		this.element = element;
		this.triangles = triangles;
		var pool = {};
		triangles.forEach(function(triangle) {
			triangle.appendInto(element, pool);
		});
	}

	Triangles.prototype = {
		resize: function() {
			var element = this.element;
			var pool = {};
			this.triangles.forEach(function(triangle) {
				triangle.resize(element, pool);
			});
		},
	};

	var shadows = [].slice.call(document.querySelectorAll('[data-parallax-shadow]'));
	var mxy = { x: 0, y: 0 };

	function render() {
		shadows.forEach(function(element) {
			var xy = element.xy || { x: 0, y: 0 };
			xy.x += (mxy.x - xy.x) / 8;
			xy.y += (mxy.y - xy.y) / 8;
			var shadow = element.getAttribute('data-parallax-shadow') || 90;
			var pow = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
			var x = (xy.x * -100).toFixed(2);
			var y = (xy.y * -50).toFixed(2);
			var bs = x + 'px ' + y + 'px ' + shadow + 'px -10px rgba(0, 0, 0, ' + pow + ')';
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

	function loop() {
		render();
		window.requestAnimationFrame(loop);
	}

	function onScroll() {
		var page = document.querySelector('.page');
		if (window.scrollY > 0) {
			page.setAttribute('class', 'page fixed');
		} else {
			page.setAttribute('class', 'page');
		}
	}

	function onLoad() {

		var animations = [].slice.call(document.querySelectorAll('.triangles'));

		animations = animations.map(function(element) {
			return new Triangles(element);
		});

		window.addEventListener('resize', function() {
			animations.forEach(function(animation) {
				animation.resize();
			});
		});

		window.addEventListener('scroll', onScroll);

		document.addEventListener('mousemove', function(e) {
			mxy.x = e.clientX / window.innerWidth - 0.5;
			mxy.y = e.clientY / window.innerHeight - 0.5;
		});

		[].slice.call(document.querySelectorAll('[href="#"]')).forEach(function(element) {
			element.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		});

		loop();

	}

	window.onload = onLoad;

}());
