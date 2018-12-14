/* global Swiper, TweenLite, TweenMax */

(function() {
	"use strict";

	var swiperHero = new Swiper('.swiper-container--home-hero', {
		loop: true,
		effect: 'fade',
		parallax: true,
		spaceBetween: 500,
		speed: 600,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
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
		spaceBetween: 500,
		speed: 600,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			dynamicBullets: true,
		},
	});

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
			var module = 100;
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
			var position = this.getRandomPosition(element);
			var t = 0;
			while (pool[position.i] !== undefined && t < 5) {
				position = this.getRandomPosition(element);
				t++;
			}
			pool[position.i] = position.i;
			this.position = position;
			element.appendChild(this.element);
			TweenLite.set(this.element, {
				opacity: 0,
				transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)'
			});
			this.tween();
		},
		tween: function() {
			TweenLite.to(this.element, 1.0, {
				opacity: Math.min(1, Math.random() * 2),
				onComplete: function() {
					this.tween();
				},
				onCompleteScope: this,
			}, this.position.i * 0.1);
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
		render: function() {
			this.triangles.forEach(function(triangle) {
				triangle.render();
			});
		},
	};

	function render() {
		animations.forEach(function(triangles) {
			triangles.render();
		});
	}

	function loop() {
		render();
		window.requestAnimationFrame(loop);
	}

	function onLoad() {

		var animations = [].slice.call(document.querySelectorAll('.triangles'));

		animations = animations.map(function(element) {
			return new Triangles(element);
		});

		[].slice.call(document.querySelectorAll('[href="#"]')).forEach(function(element) {
			element.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		});

		/*
		loop();
		*/
	}

	window.onload = onLoad;

}());
