(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dom = _interopRequireDefault(require("./shared/dom"));

var _rect = _interopRequireDefault(require("./shared/rect"));

var _triangles = _interopRequireDefault(require("./shared/triangles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var App =
/*#__PURE__*/
function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this = this;

      var body = document.querySelector('body');
      var page = document.querySelector('.page');
      var swiperHero = new Swiper('.swiper-container--home-hero', {
        loop: true,
        // effect: 'fade',
        // followFinger: true,
        parallax: true,
        spaceBetween: 0,
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
        return new _triangles.default(element);
      });
      var elements = [].slice.call(document.querySelectorAll('.case-studies__item'));
      var hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
      var mxy = {
        x: 0,
        y: 0
      };
      this.body = body;
      this.page = page;
      this.swiperHero = swiperHero;
      this.swiperHilights = swiperHilights;
      this.shadows = shadows;
      this.animations = animations;
      this.elements = elements;
      this.hrefs = hrefs;
      this.mxy = mxy;
      window.addEventListener('resize', function () {
        _this.resize();
      });
      window.addEventListener('scroll', function () {
        _this.scroll();
      });
      document.addEventListener('mousemove', function (e) {
        _this.mxy.x = e.clientX / window.innerWidth - 0.5;
        _this.mxy.y = e.clientY / window.innerHeight - 0.5;
      });
      hrefs.forEach(function (element) {
        element.addEventListener('click', function (e) {
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
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // smoothscroll
      if (this.body.offsetHeight !== this.page.offsetHeight) {
        TweenMax.set(this.body, {
          height: this.page.offsetHeight
        });
      }

      var cy = this.page.cy || 0;
      cy += (-window.scrollY - cy) / 10;
      this.page.cy = cy;
      TweenMax.set(this.page, {
        y: cy
      }); // shadows

      this.shadows.forEach(function (element) {
        var xy = element.xy || {
          x: 0,
          y: 0
        };
        xy.x += (_this2.mxy.x - xy.x) / 8;
        xy.y += (_this2.mxy.y - xy.y) / 8;
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
      }); // parallax

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
  }, {
    key: "loop",
    value: function loop() {
      var _this3 = this;

      this.render();
      window.requestAnimationFrame(function () {
        _this3.loop();
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      this.windowRect = new _rect.default({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      });
      this.animations.forEach(function (animation) {
        animation.resize();
      });
    }
  }, {
    key: "scroll",
    value: function scroll() {
      if (window.scrollY > 0) {
        _dom.default.addClass(this.body, 'fixed');
      } else {
        _dom.default.removeClass(this.body, 'fixed');
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
  }]);

  return App;
}();

exports.default = App;
var app = new App();

window.onload = function () {
  app.init();
};

},{"./shared/dom":2,"./shared/rect":3,"./shared/triangles":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */
var Dom =
/*#__PURE__*/
function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }

  _createClass(Dom, null, [{
    key: "fragmentFirstElement",
    value: function fragmentFirstElement(fragment) {
      return Array.prototype.slice.call(fragment.children).find(function (x) {
        return x.nodeType === Node.ELEMENT_NODE;
      });
    }
  }, {
    key: "fragmentFromHTML",
    value: function fragmentFromHTML(html) {
      return document.createRange().createContextualFragment(html);
    }
  }, {
    key: "hasClass",
    value: function hasClass(element, name) {
      return element && new RegExp("(?:^|\\s+)".concat(name, "(?:\\s+|$)")).test(element.className);
    }
  }, {
    key: "addClass",
    value: function addClass(element, name) {
      if (element && !Dom.hasClass(element, name)) {
        element.className = element.className ? "".concat(element.className, " ").concat(name) : name;
      }

      return Dom;
    }
  }, {
    key: "removeClass",
    value: function removeClass(element, name) {
      if (element && Dom.hasClass(element, name)) {
        element.className = element.className.split(name).join("").replace(/\s\s+/g, " "); // .replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
      }

      return Dom;
    }
  }, {
    key: "scrollTop",
    value: function scrollTop() {
      var pageYOffset = window ? window.pageXOffset : 0;
      var scrollTop = document && document.documentElement ? document.documentElement.scrollTop : 0;
      return pageYOffset || scrollTop;
    }
  }]);

  return Dom;
}();

exports.default = Dom;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */
var Rect =
/*#__PURE__*/
function () {
  function Rect(rect) {
    _classCallCheck(this, Rect);

    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    this.set(rect);
  }

  _createClass(Rect, [{
    key: "set",
    value: function set(rect) {
      if (rect) {
        Object.assign(this, rect);
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
      }

      this.center = {
        top: this.top + this.height / 2,
        left: this.left + this.width / 2
      };
      this.center.x = this.center.left;
      this.center.y = this.center.top;
    }
  }, {
    key: "intersect",
    value: function intersect(rect) {
      return Rect.intersectRect(this, rect);
    }
  }, {
    key: "intersection",
    value: function intersection(rect) {
      var center = {
        x: (this.center.x - rect.center.x) / (rect.width / 2),
        y: (this.center.y - rect.center.y) / (rect.height / 2)
      };

      if (this.intersect(rect)) {
        var dx = this.left > rect.left ? 0 : Math.abs(rect.left - this.left);
        var dy = this.top > rect.top ? 0 : Math.abs(rect.top - this.top);
        var x = dx ? 1 - dx / this.width : (rect.left + rect.width - this.left) / this.width;
        var y = dy ? 1 - dy / this.height : (rect.top + rect.height - this.top) / this.height;
        x = Math.min(1, x);
        y = Math.min(1, y);
        return {
          x: x,
          y: y,
          center: center
        };
      } else {
        return {
          x: 0,
          y: 0,
          center: center
        };
      }
    }
  }], [{
    key: "intersectRect",
    value: function intersectRect(r1, r2) {
      return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    }
  }]);

  return Rect;
}();

exports.default = Rect;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */

/* global TweenMax */
var _module = 98;

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
    element.appendChild(use); // Dom.addClass(element, 'triangle--' + size);

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

exports.default = Triangle;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _triangle = _interopRequireDefault(require("./triangle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Triangles =
/*#__PURE__*/
function () {
  function Triangles(element) {
    _classCallCheck(this, Triangles);

    var triangles = new Array(20).fill(null).map(function () {
      return new _triangle.default(element.hasAttribute('white'));
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

exports.default = Triangles;

},{"./triangle":4}]},{},[1]);

//# sourceMappingURL=app.js.map
