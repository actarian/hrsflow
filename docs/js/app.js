(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dom = _interopRequireDefault(require("./shared/dom"));

var _follower = _interopRequireDefault(require("./shared/follower"));

var _rect = _interopRequireDefault(require("./shared/rect"));

var _triangles = _interopRequireDefault(require("./shared/triangles"));

var _utils = _interopRequireDefault(require("./shared/utils"));

var _video = _interopRequireDefault(require("./shared/video"));

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
      var body = document.querySelector('body');
      var page = document.querySelector('.page');

      _dom.default.detect(body);

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
          init: function init() {
            this.el.classList.add('ready');
          },
          slideChangeTransitionEnd: function slideChangeTransitionEnd() {
            // console.log('slideChange', this.slides.length, this.activeIndex);
            var slide = this.slides[this.activeIndex];

            if (slide) {
              var video = slide.querySelector('video');

              if (video) {// video.play();
              }
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
        },
        on: {
          init: function init() {
            this.el.classList.add('ready');
          }
        }
      });
      var swiperGallery = new Swiper('.swiper-container--gallery', {
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 45,
        speed: 600,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
        on: {
          init: function init() {
            this.el.classList.add('ready');
          }
        }
      });
      var swipers = [swiperHero, swiperHilights, swiperGallery].filter(function (swiper) {
        return swiper.el !== undefined;
      });
      var videos = [].slice.call(document.querySelectorAll('video[playsinline]')).map(function (node, i) {
        var video = new _video.default(node);
        video.i = i;
        return video;
      });
      var triangles = [].slice.call(document.querySelectorAll('.triangles')).map(function (node, i) {
        var triangles = new _triangles.default(node);
        triangles.i = i;
        return triangles;
      });
      var parallaxes = [].slice.call(document.querySelectorAll('[data-parallax]'));
      var shadows = [].slice.call(document.querySelectorAll('[data-shadow]'));
      var appears = [].slice.call(document.querySelectorAll('[data-appear]'));
      var follower = new _follower.default(document.querySelector('.follower'));
      var hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
      var links = [].slice.call(document.querySelectorAll('.btn, .nav:not(.nav--service)>li>a'));
      var togglers = [].slice.call(document.querySelectorAll('[toggle]'));
      var mouse = {
        x: 0,
        y: 0
      };
      var timeline = new TimelineMax();

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
  }, {
    key: "addListeners",
    value: function addListeners() {
      window.addEventListener('resize', function () {
        app.onResize();
      });
      /*
      window.addEventListener('scroll', Utils.debounce(() => {
      	app.onScroll();
      }));
      */

      window.addEventListener('scroll', _utils.default.throttle(function () {
        app.onScroll();
      }, 1000 / 25));
      document.addEventListener('mousemove', function (e) {
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

      this.hrefs.forEach(function (node) {
        node.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      this.togglers.forEach(function (node) {
        node.addEventListener('click', function (e) {
          var target = node.getAttribute('toggle');
          target = target ? document.querySelector(target) : node;
          var toggle = node.getAttribute('toggle-class') || 'active';

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
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      this.mouse.x = e.clientX / window.innerWidth - 0.5;
      this.mouse.y = e.clientY / window.innerHeight - 0.5;

      if (this.follower.enabled) {
        this.follower.follow(this.links.map(function (x) {
          return _rect.default.fromNode(x);
        }));
        this.follower.move({
          x: e.clientX,
          y: e.clientY
        });
      }
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.windowRect = new _rect.default({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      });
      this.triangles.forEach(function (animation) {
        animation.resize();
      }); // this.follower.follow(this.links.map(x => Rect.fromNode(x)));
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      var scrollTop = _dom.default.scrollTop(); // fastscroll mobile


      if (_dom.default.fastscroll) {
        var newTop = Math.round(scrollTop * 10) / 10;

        if (this.page.previousTop !== newTop) {
          this.page.previousTop = newTop;
          _dom.default.scrolling = true;
        } else {
          _dom.default.scrolling = false;
        }
      }

      if (scrollTop > 80) {
        this.body.classList.add('fixed');
      } else {
        this.body.classList.remove('fixed');
      }

      this.appears = [].slice.call(document.querySelectorAll('[data-appear]')); // this.follower.follow(this.links.map(x => Rect.fromNode(x)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      // smoothscroll desktop
      // if (!Dom.overscroll && !Dom.touch) {
      if (!_dom.default.fastscroll) {
        if (this.body.offsetHeight !== this.page.offsetHeight) {
          this.body.setAttribute('style', "height: ".concat(this.page.offsetHeight, "px;"));
          /*
          TweenMax.set(this.body, {
          	height: this.page.offsetHeight,
          });
          */
        }

        var scrollTop = _dom.default.scrollTop();

        var newTop = this.page.previousTop || 0;
        newTop += (scrollTop - newTop) / 5;

        if (Math.abs(scrollTop - newTop) < 0.15) {
          newTop = scrollTop;
        }

        if (newTop !== undefined && !Number.isNaN(newTop) && this.page.previousTop !== newTop) {
          this.page.previousTop = newTop; // this.page.setAttribute('style', `top: ${-newTop}px;`);

          this.page.setAttribute('style', "transform: translateY(".concat(-newTop, "px);"));
          /*
          TweenMax.set(this.page, {
          	y: -newTop,
          });
          */

          _dom.default.scrolling = true;
        } else {
          _dom.default.scrolling = false;
        }
      } else if (this.body.hasAttribute('style')) {
        this.body.removeAttribute('style');
        this.page.removeAttribute('style');
      }

      if (!_dom.default.scrolling) {
        // shadows
        this.shadows.forEach(function (node) {
          var xy = node.xy || {
            x: 0,
            y: 0
          };
          var dx = _this.mouse.x - xy.x;
          var dy = _this.mouse.y - xy.y;
          xy.x += dx / 8;
          xy.y += dy / 8;
          var shadow = node.getAttribute('data-shadow') || 90;
          var alpha = (0.2 + 0.3 * (Math.abs(xy.x) + Math.abs(xy.y)) / 2).toFixed(3);
          var x = (xy.x * -100).toFixed(2);
          var y = (xy.y * -50).toFixed(2);
          var boxShadow = "".concat(x, "px ").concat(y, "px ").concat(shadow, "px -10px rgba(0, 0, 0, ").concat(alpha, ")"); // if (node.boxShadow !== boxShadow) {
          // 	node.boxShadow = boxShadow;

          node.setAttribute('style', "box-shadow: ".concat(boxShadow));
          /*
          TweenMax.set(node, {
          	boxShadow: boxShadow,
          });
          */
          // }

          node.xy = xy;
        });
      } // swipers


      this.swipers.forEach(function (swiper, i) {
        if (swiper.params.autoplay.enabled && !swiper.params.autoplay.disableOnInteraction) {
          var node = swiper.el;

          var rect = _rect.default.fromNode(node);

          var intersection = rect.intersection(_this.windowRect);

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
      }); // videos

      this.videos.forEach(function (video, i) {
        var node = video.node;

        var rect = _rect.default.fromNode(node);

        var intersection = rect.intersection(_this.windowRect);

        if (intersection.y > 0 && intersection.x > 0) {
          video.appear();
        } else {
          video.disappear();
        }
      });

      if (!_dom.default.mobile) {
        // triangles
        this.triangles.forEach(function (triangle, i) {
          var node = triangle.node;

          var rect = _rect.default.fromNode(node);

          var intersection = rect.intersection(_this.windowRect);

          if (intersection.y > 0) {
            triangle.appear();
          } else {
            triangle.disappear();
          }
        }); // parallax

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

        this.parallaxes.forEach(function (node, i) {
          var parallax = node.parallax || (node.parallax = parseInt(node.getAttribute('data-parallax')) || 5) * 2;
          var direction = i % 2 === 0 ? 1 : -1;
          var currentY = node.currentY || 0;

          var rect = _rect.default.fromNode(node);

          rect = new _rect.default({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          var intersection = rect.intersection(_this.windowRect);

          if (intersection.y > 0) {
            var y = Math.min(1, Math.max(-1, intersection.center.y));
            var s = (100 + parallax * 2) / 100;
            currentY = (-50 + y * parallax * direction).toFixed(3);

            if (node.currentY !== currentY) {
              node.currentY = currentY;

              if (node.parentNode.classList.contains('background')) {
                node.setAttribute('style', "top: 50%; left: 50%; transform: translateX(-50%) translateY(".concat(currentY, "%) scale3d(").concat(s, ",").concat(s, ",1.0);"));
              } else {
                node.setAttribute('style', "top: 50%; left: 50%; transform: translateX(-50%) translateY(".concat(currentY, "%);"));
              }
            }
          }
        }); // follower

        if (this.follower.enabled) {
          this.follower.render();
        }
      } // appears


      var fi = 0;
      this.appears.forEach(function (node, i) {
        var rect = _rect.default.fromNode(node);

        var intersection = rect.intersection(_this.windowRect);

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
            node.to = setTimeout(function () {
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
  }, {
    key: "loop",
    value: function loop() {
      var _this2 = this;

      this.render();

      if (this.playing) {
        window.requestAnimationFrame(function () {
          _this2.loop();
        });
      }
    }
  }, {
    key: "play",
    value: function play() {
      this.playing = true;
      this.loop();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.playing = false;
    }
  }]);

  return App;
}();

exports.default = App;
var app = new App();

window.onload = function () {
  app.init();
  app.play();
};

},{"./shared/dom":2,"./shared/follower":3,"./shared/rect":4,"./shared/triangles":6,"./shared/utils":7,"./shared/video":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dom =
/*#__PURE__*/
function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }

  _createClass(Dom, null, [{
    key: "detect",
    value: function detect(node) {
      var userAgent = navigator.userAgent.toLowerCase();
      var explorer = userAgent.indexOf('msie') > -1;
      var firefox = userAgent.indexOf('firefox') > -1;
      var opera = userAgent.toLowerCase().indexOf('op') > -1;
      var chrome = userAgent.indexOf('chrome') > -1;
      var safari = userAgent.indexOf('safari') > -1;

      if (chrome && safari) {
        safari = false;
      }

      if (chrome && opera) {
        chrome = false;
      }

      var android = userAgent.match(/android/i);
      var blackberry = userAgent.match(/blackberry/i);
      var ios = userAgent.match(/iphone|ipad|ipod/i);
      var operamini = userAgent.match(/opera mini/i);
      var iemobile = userAgent.match(/iemobile/i) || navigator.userAgent.match(/wpdesktop/i);
      var mobile = android || blackberry || ios || operamini || iemobile;
      var overscroll = navigator.platform === 'MacIntel' && typeof navigator.getBattery === 'function';
      var classList = {
        chrome: chrome,
        explorer: explorer,
        firefox: firefox,
        safari: safari,
        opera: opera,
        android: android,
        blackberry: blackberry,
        ios: ios,
        operamini: operamini,
        iemobile: iemobile,
        mobile: mobile,
        overscroll: overscroll
      };
      Object.assign(Dom, classList);
      Object.keys(classList).forEach(function (x) {
        if (classList[x]) {
          node.classList.add(x);
        }
      });

      var onTouchStart = function onTouchStart() {
        document.removeEventListener('touchstart', onTouchStart);
        Dom.touch = true;
        node.classList.add('touch');
      };

      document.addEventListener('touchstart', onTouchStart);

      var onMouseDown = function onMouseDown() {
        document.removeEventListener('mousedown', onMouseDown);
        Dom.mouse = true;
        node.classList.add('mouse');
      };

      document.addEventListener('mousedown', onMouseDown);

      var onScroll = function onScroll() {
        var now = _utils.default.now();

        if (Dom.lastScrollTime) {
          var diff = now - Dom.lastScrollTime;

          if (diff < 5) {
            document.removeEventListener('scroll', onScroll);
            Dom.fastscroll = true;
            node.classList.add('fastscroll');
            console.log('scroll', diff);
          }
        }

        Dom.lastScrollTime = now;
      };

      document.addEventListener('scroll', onScroll);
    }
  }, {
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
    key: "scrollTop",
    value: function scrollTop() {
      return document && document.defaultView ? document.defaultView.pageYOffset : 0;
      /*
      const pageYOffset = window ? window.pageYOffset : 0;
      const scrollTop = document && document.documentElement ? document.documentElement.scrollTop : 0;
      return pageYOffset || scrollTop;
      // window.scrollY;
      */
    }
    /*
    static on(event, target, callback) {
    	if (typeof callback === 'function') {
    		const listener = Dom.listeners[target + event] = (e) => {
    			const node = document.querySelector(selector);
    			if (node && e.target === node || node.contains(e.target)) {
    				callback(e);
    			}
    		};
    		document.addEventListener(event, listener);
    	}
    }
    	static off(event, selector) {
    	const listener = Dom.listeners[selector + event];
    	if (listener) {
    		document.removeEventListener(event, listener);
    	}
    }
    */

  }]);

  return Dom;
}();

exports.default = Dom;

},{"./utils":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var friction = 8;
var friction2 = 2;
var size = 20;

var Follower =
/*#__PURE__*/
function () {
  function Follower(node) {
    var _this = this;

    _classCallCheck(this, Follower);

    this.enabled = true;
    this.node = node;
    this.div1 = node.querySelectorAll('div')[0];
    this.div2 = node.querySelectorAll('div')[1];
    this.x = 0;
    this.y = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.w = size;
    this.h = size;
    this.r = size / 2;
    this.s = 0;
    this.o = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.rects = [];
    this.magnet = null;
    this.setMagnetThrottled = _utils.default.throttle(function () {
      return _this.setMagnet();
    }, 100);
  }

  _createClass(Follower, [{
    key: "follow",
    value: function follow(rects) {
      this.rects = rects;
    }
  }, {
    key: "move",
    value: function move(mouse) {
      this.mouse = mouse;
    }
  }, {
    key: "setMagnet",
    value: function setMagnet() {
      var _this2 = this;

      var magnet = this.rects.reduce(function (p, rect) {
        if (rect.contains(_this2.mouse.x, _this2.mouse.y)) {
          return {
            match: true,

            /*
            x: rect.left,
            y: rect.bottom - 3,
            width: rect.width,
            height: 3,
            */
            x: _this2.mouse.x,
            y: _this2.mouse.y,
            width: size,
            height: size,
            radius: 0,
            scale: 1,
            opacity: 0.05
          };
        } else {
          return p;
        }
      }, {
        match: false,
        x: this.mouse.x,
        y: this.mouse.y,
        width: size,
        height: size,
        radius: 75,
        scale: 0.25,
        opacity: 0.15
      });
      this.magnet = magnet;
    }
  }, {
    key: "render",
    value: function render() {
      if (window.innerWidth >= 1024 && this.mouse.x && this.mouse.y) {
        this.setMagnetThrottled();
        var magnet = this.magnet; //

        this.x += (magnet.x - this.x) / friction;
        this.y += (magnet.y - this.y) / friction;
        this.w += (magnet.width - this.w) / friction;
        this.h += (magnet.height - this.h) / friction;
        this.r += (magnet.radius - this.r) / friction;
        this.s += (magnet.scale - this.s) / friction;
        this.o += (magnet.opacity - this.o) / friction; //

        this.x2 += (this.mouse.x - this.x2) / friction2;
        this.y2 += (this.mouse.y - this.y2) / friction2;
        this.div1.setAttribute('style', "opacity: ".concat(this.o, "; left:").concat(this.x - this.s * 50, "px; top:").concat(this.y - this.s * 50, "px; width:").concat(this.s * 100, "px; height:").concat(this.s * 100, "px;"));
        this.div2.setAttribute('style', "opacity: 1; left:".concat(this.x2 - 2, "px; top:").concat(this.y2 - 2, "px;")); // this.div1.setAttribute('style', `opacity: ${this.o}; transform: translateX(${this.x + this.w / 2 - 50}px) translateY(${this.y + this.h / 2 - 50}px) scale3d(${this.s},${this.s},1.0);`);
        // this.div2.setAttribute('style', `opacity: 1; transform: translateX(${this.x2}px) translateY(${this.y2}px);`);

        /*
        TweenMax.set(this.div1, {
        	opacity: this.o,
        	// transform: `translateX(${this.x + this.w / 2 - 50}px) translateY(${this.y + this.h / 2 - 50}px) scale3d(${this.w / 100},${this.h / 100},1.0)`,
        	transform: `translateX(${this.x + this.w / 2 - 50}px) translateY(${this.y + this.h / 2 - 50}px) scale3d(${this.s},${this.s},1.0)`,
        });
        TweenMax.set(this.div2, {
        	opacity: 1,
        	transform: `translateX(${this.x2}px) translateY(${this.y2}px)`,
        });
        */
      } else {
        this.div1.setAttribute('style', "opacity: 0;");
        this.div2.setAttribute('style', "opacity: 0;");
        /*
        TweenMax.set(this.div1, {
        	opacity: 0,
        });
        TweenMax.set(this.div2, {
        	opacity: 0,
        });
        */
      }
    }
  }]);

  return Follower;
}();

exports.default = Follower;

},{"./utils":7}],4:[function(require,module,exports){
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
    key: "contains",
    value: function contains(left, top) {
      return Rect.contains(this, left, top);
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
    key: "contains",
    value: function contains(rect, left, top) {
      return rect.top <= top && top <= rect.bottom && rect.left <= left && left <= rect.right;
    }
  }, {
    key: "intersectRect",
    value: function intersectRect(r1, r2) {
      return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    }
  }, {
    key: "fromNode",
    value: function fromNode(node) {
      if (!node.getClientRects().length) {
        return new Rect();
      }

      var rect = node.getBoundingClientRect(); // const defaultView = node.ownerDocument.defaultView;

      return new Rect({
        // top: rect.top + defaultView.pageYOffset,
        // left: rect.left + defaultView.pageXOffset,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  }]);

  return Rect;
}();

exports.default = Rect;

},{}],5:[function(require,module,exports){
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
var _module = 59; // 98;

var Triangle =
/*#__PURE__*/
function () {
  function Triangle(white) {
    _classCallCheck(this, Triangle);

    var node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    var size = Math.random() < 0.5 ? 60 : 120;
    var filled = Math.random() < 0.15 ? '-fill' : '';
    var color = white ? '-white' : '';
    var name = 'triangle-' + size + filled + color;
    node.appendChild(use); // Dom.addClass(node, 'triangle--' + size);

    node.setAttribute('class', 'triangle triangle--' + size);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + name);
    use.setAttribute('width', size);
    use.setAttribute('height', size);
    this.node = node;
  }

  _createClass(Triangle, [{
    key: "getRandomPosition",
    value: function getRandomPosition(node) {
      var width = node.offsetWidth;
      var height = node.offsetHeight;
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
    value: function appendInto(node, pool) {
      node.appendChild(this.node);
      this.parent = node;
      this.resize(node, pool);
    }
  }, {
    key: "resize",
    value: function resize(node, pool) {
      var w2 = window.innerWidth / 2 - node.offsetLeft;
      var position = this.getRandomPosition(node);
      var t = 0;

      while ((pool[position.i] !== undefined || position.x > w2 - 2 * _module && position.x < w2 + 2 * _module) && t < 5) {
        position = this.getRandomPosition(node);
        t++;
      }

      pool[position.i] = position.i;
      this.position = position;
      this.parent = node;
      this.node.setAttribute('style', "opacity: 0; top: ".concat(position.y, "px; left: ").concat(position.x, "px; transform: rotate(").concat(position.r, "deg);"));
      /*
      TweenMax.set(this.node, {
      	opacity: 0,
      	transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
      });
      */
    }
  }, {
    key: "appear",
    value: function appear() {
      var position = this.position;
      TweenMax.to(this.node, 1.0, {
        opacity: 1,
        onComplete: function onComplete() {// this.rotate();
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
      var _this = this;

      var position = this.position;
      var i = position.x / _module - 1;
      position.x = i * _module;
      TweenMax.to(this.node, 1.0, {
        // transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%)',
        x: position.x + '%',
        directionalRotation: '90_cw',
        onComplete: function onComplete() {
          _this.disappear();
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
      var _this2 = this;

      TweenMax.to(this.node, 1.0, {
        opacity: 0,
        onComplete: function onComplete() {
          var position = _this2.getRandomPosition(_this2.parent);

          _this2.position = position;

          _this2.node.setAttribute('style', "opacity:0; top: ".concat(position.y, "px; left: ").concat(position.x, "px; transform: rotate(").concat(position.r, "deg);"));
          /*
          TweenMax.set(this.node, {
          	opacity: 0,
          	transform: 'translateX(' + position.x + '%) translateY(' + position.y + '%) rotateZ(' + position.r + 'deg)',
          });
          */


          _this2.appear();
        },
        onCompleteScope: this,
        ease: Quint.easeInOut,
        overwrite: 'all'
      });
    }
  }, {
    key: "kill",
    value: function kill() {
      TweenMax.killTweensOf(this.node);
    }
  }]);

  return Triangle;
}();

exports.default = Triangle;

},{}],6:[function(require,module,exports){
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
  function Triangles(node) {
    _classCallCheck(this, Triangles);

    var triangles = new Array(20).fill(null).map(function () {
      return new _triangle.default(node.hasAttribute('white'));
    });
    this.node = node;
    this.triangles = triangles;
    var pool = {};
    triangles.forEach(function (triangle) {
      triangle.appendInto(node, pool);
    });
  }

  _createClass(Triangles, [{
    key: "resize",
    value: function resize() {
      var _this = this;

      var node = this.node;
      var pool = {};
      this.triangles.forEach(function (triangle) {
        triangle.resize(node, pool);

        if (_this.visible) {
          triangle.appear();
        }
      });
    }
  }, {
    key: "appear",
    value: function appear() {
      if (!this.visible) {
        this.visible = true;
        this.triangles.forEach(function (triangle) {
          triangle.appear();
        });
      }
    }
  }, {
    key: "disappear",
    value: function disappear() {
      if (this.visible) {
        this.visible = false;
        this.triangles.forEach(function (triangle) {
          triangle.kill();
        });
      }
    }
  }]);

  return Triangles;
}();

exports.default = Triangles;

},{"./triangle":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */

/* global window, document */
var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "now",
    value: function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
  }, {
    key: "performanceNow",
    value: function performanceNow() {
      return performance ? performance.timing.navigationStart + performance.now() : Utils.now();
    }
  }, {
    key: "throttle",
    value: function throttle(callback, wait, options) {
      var context = null,
          result = null,
          args = null,
          timeout = null;
      var previous = 0;

      if (!options) {
        options = {};
      }

      var later = function later() {
        previous = options.leading === false ? 0 : Utils.now();
        timeout = null;
        result = callback.apply(context, args);

        if (!timeout) {
          context = args = null;
        }
      };

      return function () {
        context = this;
        args = arguments;
        var now = Utils.now();

        if (!previous && options.leading === false) {
          previous = now;
        }

        var remaining = wait - (now - previous);

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          previous = now;
          result = callback.apply(context, args);

          if (!timeout) {
            context = args = null;
          }
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    }
  }, {
    key: "debounce",
    value: function debounce(callback) {
      var _this = this,
          _arguments = arguments;

      var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var timeout;
      return function () {
        var context = _this,
            args = _arguments;

        var later = function later() {
          timeout = null;

          if (!immediate) {
            callback.apply(context, args);
          }
        };

        var callNow = immediate && !timeout;

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);

        if (callNow) {
          callback.apply(context, args);
        }
      };
    }
  }]);

  return Utils;
}();

exports.default = Utils;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jshint esversion: 6 */
var Video =
/*#__PURE__*/
function () {
  function Video(node) {
    _classCallCheck(this, Video);

    this.node = node;
    this.addListeners();
  }

  _createClass(Video, [{
    key: "addListeners",
    value: function addListeners() {
      var _this = this;

      var click = function click() {
        if (!_this.paused) {
          _this.paused = true;

          _this.disappear();

          _this.node.parentNode.classList.add('onpause');

          setTimeout(function () {
            _this.node.parentNode.classList.remove('onpause');
          }, 1500);
        } else {
          _this.paused = false;

          _this.appear();

          _this.node.parentNode.classList.add('onplay');

          setTimeout(function () {
            _this.node.parentNode.classList.remove('onplay');
          }, 1500);
        }
      };

      this.node.addEventListener('click', click);
    }
  }, {
    key: "appear",
    value: function appear() {
      if (!this.visible && !this.paused) {
        this.visible = true;
        this.node.play();
      }
    }
  }, {
    key: "disappear",
    value: function disappear() {
      if (this.visible) {
        this.visible = false;
        console.log(this.node);
        this.node.pause();
        console.log('video.disappear');
      }
    }
  }]);

  return Video;
}();

exports.default = Video;

},{}]},{},[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzcmMvYXBwL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgU3dpcGVyLCBUd2Vlbk1heCwgVGltZWxpbmVNYXggKi9cblxuaW1wb3J0IERvbSBmcm9tICcuL3NoYXJlZC9kb20nO1xuaW1wb3J0IEZvbGxvd2VyIGZyb20gJy4vc2hhcmVkL2ZvbGxvd2VyJztcbmltcG9ydCBSZWN0IGZyb20gJy4vc2hhcmVkL3JlY3QnO1xuaW1wb3J0IFRyaWFuZ2xlcyBmcm9tICcuL3NoYXJlZC90cmlhbmdsZXMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vc2hhcmVkL3V0aWxzJztcbmltcG9ydCBWaWRlbyBmcm9tICcuL3NoYXJlZC92aWRlbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XG5cblx0Y29uc3RydWN0b3IoKSB7fVxuXG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblx0XHRjb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcblx0XHREb20uZGV0ZWN0KGJvZHkpO1xuXHRcdGNvbnN0IHN3aXBlckhlcm8gPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lci0taG9tZS1oZXJvJywge1xuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdC8vIGVmZmVjdDogJ2ZhZGUnLFxuXHRcdFx0Ly8gZm9sbG93RmluZ2VyOiB0cnVlLFxuXHRcdFx0cGFyYWxsYXg6IHRydWUsXG5cdFx0XHRzcGFjZUJldHdlZW46IDAsXG5cdFx0XHRzcGVlZDogNjAwLFxuXHRcdFx0YXV0b3BsYXk6IHtcblx0XHRcdFx0ZGVsYXk6IDUwMDAsXG5cdFx0XHRcdGRpc2FibGVPbkludGVyYWN0aW9uOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG9uOiB7XG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnc2xpZGVDaGFuZ2UnLCB0aGlzLnNsaWRlcy5sZW5ndGgsIHRoaXMuYWN0aXZlSW5kZXgpO1xuXHRcdFx0XHRcdGNvbnN0IHNsaWRlID0gdGhpcy5zbGlkZXNbdGhpcy5hY3RpdmVJbmRleF07XG5cdFx0XHRcdFx0aWYgKHNsaWRlKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB2aWRlbyA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJyk7XG5cdFx0XHRcdFx0XHRpZiAodmlkZW8pIHtcblx0XHRcdFx0XHRcdFx0Ly8gdmlkZW8ucGxheSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHQvKlxuXHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG5cdFx0XHRcdGNsaWNrYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZHluYW1pY0J1bGxldHM6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0Ki9cblx0XHR9KTtcblx0XHRjb25zdCBzd2lwZXJIaWxpZ2h0cyA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyLS1oaWxpZ2h0cycsIHtcblx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0Lypcblx0XHRcdG1vdXNld2hlZWw6IHtcblx0XHRcdFx0aW52ZXJ0OiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdCovXG5cdFx0XHRwYXJhbGxheDogdHJ1ZSxcblx0XHRcdHNwYWNlQmV0d2VlbjogMzAwLFxuXHRcdFx0c3BlZWQ6IDYwMCxcblx0XHRcdHBhZ2luYXRpb246IHtcblx0XHRcdFx0ZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxuXHRcdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdGR5bmFtaWNCdWxsZXRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG9uOiB7XG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0XHRcdFx0fSxcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCBzd2lwZXJHYWxsZXJ5ID0gbmV3IFN3aXBlcignLnN3aXBlci1jb250YWluZXItLWdhbGxlcnknLCB7XG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcblx0XHRcdHNwYWNlQmV0d2VlbjogNDUsXG5cdFx0XHRzcGVlZDogNjAwLFxuXHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG5cdFx0XHRcdGNsaWNrYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZHluYW1pY0J1bGxldHM6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0b246IHtcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyZWFkeScpO1xuXHRcdFx0XHR9LFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHN3aXBlcnMgPSBbc3dpcGVySGVybywgc3dpcGVySGlsaWdodHMsIHN3aXBlckdhbGxlcnldLmZpbHRlcihzd2lwZXIgPT4gc3dpcGVyLmVsICE9PSB1bmRlZmluZWQpO1xuXHRcdGNvbnN0IHZpZGVvcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndmlkZW9bcGxheXNpbmxpbmVdJykpLm1hcCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0Y29uc3QgdmlkZW8gPSBuZXcgVmlkZW8obm9kZSk7XG5cdFx0XHR2aWRlby5pID0gaTtcblx0XHRcdHJldHVybiB2aWRlbztcblx0XHR9KTtcblx0XHRjb25zdCB0cmlhbmdsZXMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmlhbmdsZXMnKSkubWFwKChub2RlLCBpKSA9PiB7XG5cdFx0XHRjb25zdCB0cmlhbmdsZXMgPSBuZXcgVHJpYW5nbGVzKG5vZGUpO1xuXHRcdFx0dHJpYW5nbGVzLmkgPSBpO1xuXHRcdFx0cmV0dXJuIHRyaWFuZ2xlcztcblx0XHR9KTtcblx0XHRjb25zdCBwYXJhbGxheGVzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1wYXJhbGxheF0nKSk7XG5cdFx0Y29uc3Qgc2hhZG93cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2hhZG93XScpKTtcblx0XHRjb25zdCBhcHBlYXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hcHBlYXJdJykpO1xuXHRcdGNvbnN0IGZvbGxvd2VyID0gbmV3IEZvbGxvd2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb2xsb3dlcicpKTtcblx0XHRjb25zdCBocmVmcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWY9XCIjXCJdJykpO1xuXHRcdGNvbnN0IGxpbmtzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnRuLCAubmF2Om5vdCgubmF2LS1zZXJ2aWNlKT5saT5hJykpO1xuXHRcdGNvbnN0IHRvZ2dsZXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdG9nZ2xlXScpKTtcblx0XHRjb25zdCBtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXHRcdGNvbnN0IHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KCk7XG5cdFx0aWYgKGZvbGxvd2VyLmVuYWJsZWQpIHtcblx0XHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgnZm9sbG93ZXItZW5hYmxlZCcpO1xuXHRcdH1cblx0XHR0aGlzLmJvZHkgPSBib2R5O1xuXHRcdHRoaXMucGFnZSA9IHBhZ2U7XG5cdFx0dGhpcy5zd2lwZXJIZXJvID0gc3dpcGVySGVybztcblx0XHR0aGlzLnN3aXBlckhpbGlnaHRzID0gc3dpcGVySGlsaWdodHM7XG5cdFx0dGhpcy5zd2lwZXJzID0gc3dpcGVycztcblx0XHR0aGlzLnZpZGVvcyA9IHZpZGVvcztcblx0XHR0aGlzLnRyaWFuZ2xlcyA9IHRyaWFuZ2xlcztcblx0XHR0aGlzLnBhcmFsbGF4ZXMgPSBwYXJhbGxheGVzO1xuXHRcdHRoaXMuc2hhZG93cyA9IHNoYWRvd3M7XG5cdFx0dGhpcy5hcHBlYXJzID0gYXBwZWFycztcblx0XHR0aGlzLmZvbGxvd2VyID0gZm9sbG93ZXI7XG5cdFx0dGhpcy5ocmVmcyA9IGhyZWZzO1xuXHRcdHRoaXMubGlua3MgPSBsaW5rcztcblx0XHR0aGlzLnRvZ2dsZXJzID0gdG9nZ2xlcnM7XG5cdFx0dGhpcy5tb3VzZSA9IG1vdXNlO1xuXHRcdHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdFx0dGhpcy5hZGRMaXN0ZW5lcnMoKTtcblx0XHRib2R5LmNsYXNzTGlzdC5hZGQoJ3JlYWR5Jyk7XG5cdH1cblxuXHRhZGRMaXN0ZW5lcnMoKSB7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuXHRcdFx0YXBwLm9uUmVzaXplKCk7XG5cdFx0fSk7XG5cblx0XHQvKlxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBVdGlscy5kZWJvdW5jZSgoKSA9PiB7XG5cdFx0XHRhcHAub25TY3JvbGwoKTtcblx0XHR9KSk7XG5cdFx0Ki9cblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBVdGlscy50aHJvdHRsZSgoKSA9PiB7XG5cdFx0XHRhcHAub25TY3JvbGwoKTtcblx0XHR9LCAxMDAwIC8gMjUpKTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG5cdFx0XHRhcHAub25Nb3VzZU1vdmUoZSk7XG5cdFx0fSk7XG5cblx0XHQvKlxuXHRcdC8vIGludGVyc2VjdGlvbiBvYnNlcnZlclxuXHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IG5ldyBJbnRlcnNlY3Rpb25TZXJ2aWNlKCk7XG5cdFx0cGFyYWxsYXhlcy5mb3JFYWNoKChub2RlLCBpKSA9PiBpbnRlcnNlY3Rpb24ub2JzZXJ2ZShub2RlLCAoZW50cnksIGVpKSA9PiB7XG5cdFx0XHRsZXQgcG93ID0gMSArIDAuMSAqIGk7XG5cdFx0XHRwb3cgPSAocG93ICogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8pO1xuXHRcdFx0bm9kZS5wb3cgPSBwb3c7XG5cdFx0fSkpO1xuXHRcdCovXG5cblx0XHQvLyBocmVmPVwiI1wiIG5vb3Bcblx0XHR0aGlzLmhyZWZzLmZvckVhY2goKG5vZGUpID0+IHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMudG9nZ2xlcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGxldCB0YXJnZXQgPSBub2RlLmdldEF0dHJpYnV0ZSgndG9nZ2xlJyk7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KSA6IG5vZGU7XG5cdFx0XHRcdGxldCB0b2dnbGUgPSBub2RlLmdldEF0dHJpYnV0ZSgndG9nZ2xlLWNsYXNzJykgfHwgJ2FjdGl2ZSc7XG5cdFx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRvZ2dsZSkpIHtcblx0XHRcdFx0XHR0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0b2dnbGUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKHRvZ2dsZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fVxuXG5cdG9uTW91c2VNb3ZlKGUpIHtcblx0XHR0aGlzLm1vdXNlLnggPSBlLmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCAtIDAuNTtcblx0XHR0aGlzLm1vdXNlLnkgPSBlLmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgLSAwLjU7XG5cdFx0aWYgKHRoaXMuZm9sbG93ZXIuZW5hYmxlZCkge1xuXHRcdFx0dGhpcy5mb2xsb3dlci5mb2xsb3codGhpcy5saW5rcy5tYXAoeCA9PiBSZWN0LmZyb21Ob2RlKHgpKSk7XG5cdFx0XHR0aGlzLmZvbGxvd2VyLm1vdmUoe1xuXHRcdFx0XHR4OiBlLmNsaWVudFgsXG5cdFx0XHRcdHk6IGUuY2xpZW50WVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0b25SZXNpemUoKSB7XG5cdFx0dGhpcy53aW5kb3dSZWN0ID0gbmV3IFJlY3Qoe1xuXHRcdFx0dG9wOiAwLFxuXHRcdFx0bGVmdDogMCxcblx0XHRcdHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcblx0XHRcdGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuXHRcdH0pO1xuXHRcdHRoaXMudHJpYW5nbGVzLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuXHRcdFx0YW5pbWF0aW9uLnJlc2l6ZSgpO1xuXHRcdH0pO1xuXHRcdC8vIHRoaXMuZm9sbG93ZXIuZm9sbG93KHRoaXMubGlua3MubWFwKHggPT4gUmVjdC5mcm9tTm9kZSh4KSkpO1xuXHR9XG5cblx0b25TY3JvbGwoKSB7XG5cdFx0Y29uc3Qgc2Nyb2xsVG9wID0gRG9tLnNjcm9sbFRvcCgpO1xuXHRcdC8vIGZhc3RzY3JvbGwgbW9iaWxlXG5cdFx0aWYgKERvbS5mYXN0c2Nyb2xsKSB7XG5cdFx0XHRjb25zdCBuZXdUb3AgPSBNYXRoLnJvdW5kKHNjcm9sbFRvcCAqIDEwKSAvIDEwO1xuXHRcdFx0aWYgKHRoaXMucGFnZS5wcmV2aW91c1RvcCAhPT0gbmV3VG9wKSB7XG5cdFx0XHRcdHRoaXMucGFnZS5wcmV2aW91c1RvcCA9IG5ld1RvcDtcblx0XHRcdFx0RG9tLnNjcm9sbGluZyA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHREb20uc2Nyb2xsaW5nID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChzY3JvbGxUb3AgPiA4MCkge1xuXHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZpeGVkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZCcpO1xuXHRcdH1cblx0XHR0aGlzLmFwcGVhcnMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFwcGVhcl0nKSk7XG5cdFx0Ly8gdGhpcy5mb2xsb3dlci5mb2xsb3codGhpcy5saW5rcy5tYXAoeCA9PiBSZWN0LmZyb21Ob2RlKHgpKSk7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cblx0XHQvLyBzbW9vdGhzY3JvbGwgZGVza3RvcFxuXHRcdC8vIGlmICghRG9tLm92ZXJzY3JvbGwgJiYgIURvbS50b3VjaCkge1xuXHRcdGlmICghRG9tLmZhc3RzY3JvbGwpIHtcblx0XHRcdGlmICh0aGlzLmJvZHkub2Zmc2V0SGVpZ2h0ICE9PSB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdHRoaXMuYm9keS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYGhlaWdodDogJHt0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0fXB4O2ApO1xuXHRcdFx0XHQvKlxuXHRcdFx0XHRUd2Vlbk1heC5zZXQodGhpcy5ib2R5LCB7XG5cdFx0XHRcdFx0aGVpZ2h0OiB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ki9cblx0XHRcdH1cblx0XHRcdGNvbnN0IHNjcm9sbFRvcCA9IERvbS5zY3JvbGxUb3AoKTtcblx0XHRcdGxldCBuZXdUb3AgPSB0aGlzLnBhZ2UucHJldmlvdXNUb3AgfHwgMDtcblx0XHRcdG5ld1RvcCArPSAoc2Nyb2xsVG9wIC0gbmV3VG9wKSAvIDU7XG5cdFx0XHRpZiAoTWF0aC5hYnMoc2Nyb2xsVG9wIC0gbmV3VG9wKSA8IDAuMTUpIHtcblx0XHRcdFx0bmV3VG9wID0gc2Nyb2xsVG9wO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5ld1RvcCAhPT0gdW5kZWZpbmVkICYmICFOdW1iZXIuaXNOYU4obmV3VG9wKSAmJiB0aGlzLnBhZ2UucHJldmlvdXNUb3AgIT09IG5ld1RvcCkge1xuXHRcdFx0XHR0aGlzLnBhZ2UucHJldmlvdXNUb3AgPSBuZXdUb3A7XG5cdFx0XHRcdC8vIHRoaXMucGFnZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHRvcDogJHstbmV3VG9wfXB4O2ApO1xuXHRcdFx0XHR0aGlzLnBhZ2Uuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoJHstbmV3VG9wfXB4KTtgKTtcblx0XHRcdFx0Lypcblx0XHRcdFx0VHdlZW5NYXguc2V0KHRoaXMucGFnZSwge1xuXHRcdFx0XHRcdHk6IC1uZXdUb3AsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQqL1xuXHRcdFx0XHREb20uc2Nyb2xsaW5nID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdERvbS5zY3JvbGxpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRoaXMuYm9keS5oYXNBdHRyaWJ1dGUoJ3N0eWxlJykpIHtcblx0XHRcdHRoaXMuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cdFx0XHR0aGlzLnBhZ2UucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXHRcdH1cblxuXHRcdGlmICghRG9tLnNjcm9sbGluZykge1xuXHRcdFx0Ly8gc2hhZG93c1xuXHRcdFx0dGhpcy5zaGFkb3dzLmZvckVhY2goKG5vZGUpID0+IHtcblx0XHRcdFx0Y29uc3QgeHkgPSBub2RlLnh5IHx8IHsgeDogMCwgeTogMCB9O1xuXHRcdFx0XHRjb25zdCBkeCA9IHRoaXMubW91c2UueCAtIHh5Lng7XG5cdFx0XHRcdGNvbnN0IGR5ID0gdGhpcy5tb3VzZS55IC0geHkueTtcblx0XHRcdFx0eHkueCArPSBkeCAvIDg7XG5cdFx0XHRcdHh5LnkgKz0gZHkgLyA4O1xuXHRcdFx0XHRjb25zdCBzaGFkb3cgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zaGFkb3cnKSB8fCA5MDtcblx0XHRcdFx0Y29uc3QgYWxwaGEgPSAoMC4yICsgMC4zICogKE1hdGguYWJzKHh5LngpICsgTWF0aC5hYnMoeHkueSkpIC8gMikudG9GaXhlZCgzKTtcblx0XHRcdFx0Y29uc3QgeCA9ICh4eS54ICogLTEwMCkudG9GaXhlZCgyKTtcblx0XHRcdFx0Y29uc3QgeSA9ICh4eS55ICogLTUwKS50b0ZpeGVkKDIpO1xuXHRcdFx0XHRjb25zdCBib3hTaGFkb3cgPSBgJHt4fXB4ICR7eX1weCAke3NoYWRvd31weCAtMTBweCByZ2JhKDAsIDAsIDAsICR7YWxwaGF9KWA7XG5cdFx0XHRcdC8vIGlmIChub2RlLmJveFNoYWRvdyAhPT0gYm94U2hhZG93KSB7XG5cdFx0XHRcdC8vIFx0bm9kZS5ib3hTaGFkb3cgPSBib3hTaGFkb3c7XG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBib3gtc2hhZG93OiAke2JveFNoYWRvd31gKTtcblx0XHRcdFx0Lypcblx0XHRcdFx0VHdlZW5NYXguc2V0KG5vZGUsIHtcblx0XHRcdFx0XHRib3hTaGFkb3c6IGJveFNoYWRvdyxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCovXG5cdFx0XHRcdC8vIH1cblx0XHRcdFx0bm9kZS54eSA9IHh5O1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gc3dpcGVyc1xuXHRcdHRoaXMuc3dpcGVycy5mb3JFYWNoKChzd2lwZXIsIGkpID0+IHtcblx0XHRcdGlmIChzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmVuYWJsZWQgJiYgIXN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZGlzYWJsZU9uSW50ZXJhY3Rpb24pIHtcblx0XHRcdFx0Y29uc3Qgbm9kZSA9IHN3aXBlci5lbDtcblx0XHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uLnkgPiAwKSB7XG5cdFx0XHRcdFx0aWYgKCFzd2lwZXIuYXV0b3BsYXkucnVubmluZykge1xuXHRcdFx0XHRcdFx0c3dpcGVyLmF1dG9wbGF5LnN0YXJ0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChzd2lwZXIuYXV0b3BsYXkucnVubmluZykge1xuXHRcdFx0XHRcdFx0c3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIHZpZGVvc1xuXHRcdHRoaXMudmlkZW9zLmZvckVhY2goKHZpZGVvLCBpKSA9PiB7XG5cdFx0XHRjb25zdCBub2RlID0gdmlkZW8ubm9kZTtcblx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRpZiAoaW50ZXJzZWN0aW9uLnkgPiAwICYmIGludGVyc2VjdGlvbi54ID4gMCkge1xuXHRcdFx0XHR2aWRlby5hcHBlYXIoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZpZGVvLmRpc2FwcGVhcigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFEb20ubW9iaWxlKSB7XG5cblx0XHRcdC8vIHRyaWFuZ2xlc1xuXHRcdFx0dGhpcy50cmlhbmdsZXMuZm9yRWFjaCgodHJpYW5nbGUsIGkpID0+IHtcblx0XHRcdFx0Y29uc3Qgbm9kZSA9IHRyaWFuZ2xlLm5vZGU7XG5cdFx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdFx0aWYgKGludGVyc2VjdGlvbi55ID4gMCkge1xuXHRcdFx0XHRcdHRyaWFuZ2xlLmFwcGVhcigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRyaWFuZ2xlLmRpc2FwcGVhcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gcGFyYWxsYXhcblx0XHRcdC8qXG5cdFx0XHR0aGlzLnBhcmFsbGF4ZXMuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0XHRsZXQgY3VycmVudFkgPSBub2RlLmN1cnJlbnRZIHx8IDA7XG5cdFx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdFx0cmVjdCA9IG5ldyBSZWN0KHtcblx0XHRcdFx0XHR0b3A6IHJlY3QudG9wIC0gY3VycmVudFksXG5cdFx0XHRcdFx0bGVmdDogcmVjdC5sZWZ0LFxuXHRcdFx0XHRcdHdpZHRoOiByZWN0LndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogcmVjdC5oZWlnaHQsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0XHRjdXJyZW50WSA9IGludGVyc2VjdGlvbi5jZW50ZXIueSAqIHBhcnNlSW50KG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXBhcmFsbGF4JykpO1xuXHRcdFx0XHRpZiAobm9kZS5jdXJyZW50WSAhPT0gY3VycmVudFkpIHtcblx0XHRcdFx0XHRub2RlLmN1cnJlbnRZID0gY3VycmVudFk7XG5cdFx0XHRcdFx0VHdlZW5NYXguc2V0KG5vZGUsIHtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoJyArIGN1cnJlbnRZICsgJ3B4KScsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Ki9cblx0XHRcdHRoaXMucGFyYWxsYXhlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHBhcmFsbGF4ID0gbm9kZS5wYXJhbGxheCB8fCAobm9kZS5wYXJhbGxheCA9IHBhcnNlSW50KG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXBhcmFsbGF4JykpIHx8IDUpICogMjtcblx0XHRcdFx0Y29uc3QgZGlyZWN0aW9uID0gaSAlIDIgPT09IDAgPyAxIDogLTE7XG5cdFx0XHRcdGxldCBjdXJyZW50WSA9IG5vZGUuY3VycmVudFkgfHwgMDtcblx0XHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0XHRyZWN0ID0gbmV3IFJlY3Qoe1xuXHRcdFx0XHRcdHRvcDogcmVjdC50b3AsXG5cdFx0XHRcdFx0bGVmdDogcmVjdC5sZWZ0LFxuXHRcdFx0XHRcdHdpZHRoOiByZWN0LndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogcmVjdC5oZWlnaHQsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uLnkgPiAwKSB7XG5cdFx0XHRcdFx0Y29uc3QgeSA9IE1hdGgubWluKDEsIE1hdGgubWF4KC0xLCBpbnRlcnNlY3Rpb24uY2VudGVyLnkpKTtcblx0XHRcdFx0XHRjb25zdCBzID0gKDEwMCArIHBhcmFsbGF4ICogMikgLyAxMDA7XG5cdFx0XHRcdFx0Y3VycmVudFkgPSAoLTUwICsgeSAqIHBhcmFsbGF4ICogZGlyZWN0aW9uKS50b0ZpeGVkKDMpO1xuXHRcdFx0XHRcdGlmIChub2RlLmN1cnJlbnRZICE9PSBjdXJyZW50WSkge1xuXHRcdFx0XHRcdFx0bm9kZS5jdXJyZW50WSA9IGN1cnJlbnRZO1xuXHRcdFx0XHRcdFx0aWYgKG5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2JhY2tncm91bmQnKSkge1xuXHRcdFx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgdG9wOiA1MCU7IGxlZnQ6IDUwJTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpIHRyYW5zbGF0ZVkoJHtjdXJyZW50WX0lKSBzY2FsZTNkKCR7c30sJHtzfSwxLjApO2ApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHRvcDogNTAlOyBsZWZ0OiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKCR7Y3VycmVudFl9JSk7YCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZm9sbG93ZXJcblx0XHRcdGlmICh0aGlzLmZvbGxvd2VyLmVuYWJsZWQpIHtcblx0XHRcdFx0dGhpcy5mb2xsb3dlci5yZW5kZXIoKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIGFwcGVhcnNcblx0XHRsZXQgZmkgPSAwO1xuXHRcdHRoaXMuYXBwZWFycy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG5cdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0aWYgKGludGVyc2VjdGlvbi55ID4gMCkge1xuXHRcdFx0XHRmaSA9IGZpIHx8IGk7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGxldCBvdmVybGFwID0gJy09MC4zJztcblx0XHRcdFx0aWYgKCF0aGlzLnRpbWVsaW5lLmlzQWN0aXZlKCkpIHtcblx0XHRcdFx0XHRvdmVybGFwID0gJys9MCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy50aW1lbGluZS50byhub2RlLCAwLjUsIHsgYXV0b0FscGhhOiAxIH0sIG92ZXJsYXApO1xuXHRcdFx0XHQqL1xuXHRcdFx0XHRpZiAoIW5vZGUudG8pIHtcblx0XHRcdFx0XHRub2RlLnRvID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoJ2FwcGVhcmVkJyk7XG5cdFx0XHRcdFx0fSwgMTUwICogKGkgLSBmaSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FwcGVhcmVkJykpIHtcblx0XHRcdFx0XHRub2RlLnRvID0gbnVsbDtcblx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FwcGVhcmVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHR9XG5cblx0bG9vcCgpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHtcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmxvb3AoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0dGhpcy5wbGF5aW5nID0gdHJ1ZTtcblx0XHR0aGlzLmxvb3AoKTtcblx0fVxuXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMucGxheWluZyA9IGZhbHNlO1xuXHR9XG5cbn1cblxudmFyIGFwcCA9IG5ldyBBcHAoKTtcblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcblx0YXBwLmluaXQoKTtcblx0YXBwLnBsYXkoKTtcbn07XG4iXSwiZmlsZSI6ImRvY3MvanMvYXBwLmpzIn0=
