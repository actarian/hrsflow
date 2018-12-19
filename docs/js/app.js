(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = exports.Triangles = exports.Triangle = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */

/* global Swiper, TweenLite, TweenMax */
var _module = 100;

var Triangle =
/*#__PURE__*/
function () {
  function Triangle(white) {
    _classCallCheck(this, Triangle);

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

  _createClass(Triangle, [{
    key: "getRandomPosition",
    value: function getRandomPosition(element) {
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      var r = Math.floor(Math.random() * 4) * 90;
      var x = Math.floor(Math.random() * width / _module);
      var y = Math.floor(Math.random() * height / _module);
      var i = y * 30 + x;
      return {
        r: r,
        x: x * _module,
        y: y * _module,
        i: i
      };
    }
  }, {
    key: "appendInto",
    value: function appendInto(element, pool) {
      element.appendChild(this.element);
      this.parent = element;
      this.resize(element, pool);
    }
  }, {
    key: "resize",
    value: function resize(element, pool) {
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
        transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)'
      });
      this.appear();
    }
  }, {
    key: "appear",
    value: function appear() {
      var _this = this;

      var position = this.position;
      TweenMax.to(this.element, 1.0, {
        opacity: 1,
        onComplete: function onComplete() {
          _this.rotate();
        },
        onCompleteScope: this,
        ease: Quint.easeInOut,
        overwrite: 'all',
        delay: position.i * 0.02
      });
    }
  }, {
    key: "rotate",
    value: function rotate() {
      var _this2 = this;

      var position = this.position;
      var i = position.x / _module - 1;
      position.x = i * _module;
      TweenMax.to(this.element, 1.0, {
        // transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%)',
        x: position.x + '%',
        directionalRotation: '90_cw',
        onComplete: function onComplete() {
          _this2.disappear();
        },
        onCompleteScope: this,
        ease: Quint.easeInOut,
        overwrite: 'all',
        delay: 3 + Math.floor(Math.random() * 10)
      });
    }
  }, {
    key: "disappear",
    value: function disappear() {
      var _this3 = this;

      TweenMax.to(this.element, 1.0, {
        opacity: 0,
        onComplete: function onComplete() {
          var position = _this3.getRandomPosition(_this3.parent);

          _this3.position = position;
          TweenMax.set(_this3.element, {
            opacity: 0,
            transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)'
          });

          _this3.appear();
        },
        onCompleteScope: this,
        ease: Quint.easeInOut,
        overwrite: 'all'
      });
    }
  }, {
    key: "tween",
    value: function tween() {
      var _this4 = this;

      TweenMax.to(this.element, 1.0, {
        opacity: Math.min(1, Math.random() * 2),
        onComplete: function onComplete() {
          _this4.tween();
        },
        onCompleteScope: this,
        ease: Quint.easeInOut,
        overwrite: 'all',
        delay: position.i * 0.1
      });
    }
  }, {
    key: "render",
    value: function render() {
      console.log(this);
    }
  }]);

  return Triangle;
}();

exports.Triangle = Triangle;

var Triangles =
/*#__PURE__*/
function () {
  function Triangles(element) {
    _classCallCheck(this, Triangles);

    var triangles = new Array(20).fill(null).map(function () {
      return new Triangle(element.hasAttribute('white'));
    });
    this.element = element;
    this.triangles = triangles;
    var pool = {};
    triangles.forEach(function (triangle) {
      triangle.appendInto(element, pool);
    });
  }

  _createClass(Triangles, [{
    key: "resize",
    value: function resize() {
      var element = this.element;
      var pool = {};
      this.triangles.forEach(function (triangle) {
        triangle.resize(element, pool);
      });
    }
  }]);

  return Triangles;
}();

exports.Triangles = Triangles;

var App =
/*#__PURE__*/
function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this5 = this;

      var page = document.querySelector('.page');
      var swiperHero = new Swiper('.swiper-container--home-hero', {
        loop: true,
        effect: 'fade',
        parallax: true,
        spaceBetween: 300,
        speed: 600,
        autoplay: {
          delay: 5000,
          disableOnInteraction: true
        },
        on: {
          slideChangeTransitionEnd: function slideChangeTransitionEnd() {
            // console.log('slideChange', this.slides.length, this.activeIndex);
            var slide = this.slides[this.activeIndex];

            if (slide) {
              var video = slide.querySelector('video');
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
              } // console.log(videos);

            }
          }
        }
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
          dynamicBullets: true
        }
      });
      var shadows = [].slice.call(document.querySelectorAll('[data-parallax-shadow]'));
      var animations = [].slice.call(document.querySelectorAll('.triangles')).map(function (element) {
        return new Triangles(element);
      });
      var hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
      var mxy = {
        x: 0,
        y: 0
      };
      this.page = page;
      this.swiperHero = swiperHero;
      this.swiperHilights = swiperHilights;
      this.shadows = shadows;
      this.animations = animations;
      this.hrefs = hrefs;
      this.mxy = mxy;
      window.addEventListener('resize', function () {
        _this5.resize();
      });
      window.addEventListener('scroll', function () {
        _this5.scroll();
      });
      document.addEventListener('mousemove', function (e) {
        _this5.mxy.x = e.clientX / window.innerWidth - 0.5;
        _this5.mxy.y = e.clientY / window.innerHeight - 0.5;
      });
      hrefs.forEach(function (element) {
        element.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      this.loop();
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      this.shadows.forEach(function (element) {
        var xy = element.xy || {
          x: 0,
          y: 0
        };
        xy.x += (_this6.mxy.x - xy.x) / 8;
        xy.y += (_this6.mxy.y - xy.y) / 8;
        var shadow = element.getAttribute('data-parallax-shadow') || 90;
        var pow = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
        var x = (xy.x * -100).toFixed(2);
        var y = (xy.y * -50).toFixed(2);
        var bs = x + 'px ' + y + 'px ' + shadow + 'px -10px rgba(0, 0, 0, ' + pow + ')';

        if (element.bs !== bs) {
          TweenMax.set(element, {
            // transform: 'translateX(' + (xy.x * -4) + '%) translateY(' + (xy.y * -2) + '%)',
            boxShadow: bs
          });
          element.bs = bs;
        }

        element.xy = xy;
      });
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this7 = this;

      this.render();
      window.requestAnimationFrame(function () {
        _this7.loop();
      });
    }
  }, {
    key: "scroll",
    value: function scroll() {
      if (window.scrollY > 0) {
        this.page.setAttribute('class', 'page fixed');
      } else {
        this.page.setAttribute('class', 'page');
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.animations.forEach(function (animation) {
        animation.resize();
      });
    }
  }]);

  return App;
}();

exports.App = App;

(function () {
  "use strict";

  var app = new App();

  window.onload = function () {
    app.init();
  };
})();

},{}]},{},[1]);

//# sourceMappingURL=app.js.map
