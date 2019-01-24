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

var shadowsEnabled = false;

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
          } // e.preventDefault();


          e.stopPropagation();
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

      if (shadowsEnabled && !_dom.default.scrolling) {
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

    this.enabled = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzcmMvYXBwL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgU3dpcGVyLCBUd2Vlbk1heCwgVGltZWxpbmVNYXggKi9cblxuaW1wb3J0IERvbSBmcm9tICcuL3NoYXJlZC9kb20nO1xuaW1wb3J0IEZvbGxvd2VyIGZyb20gJy4vc2hhcmVkL2ZvbGxvd2VyJztcbmltcG9ydCBSZWN0IGZyb20gJy4vc2hhcmVkL3JlY3QnO1xuaW1wb3J0IFRyaWFuZ2xlcyBmcm9tICcuL3NoYXJlZC90cmlhbmdsZXMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vc2hhcmVkL3V0aWxzJztcbmltcG9ydCBWaWRlbyBmcm9tICcuL3NoYXJlZC92aWRlbyc7XG5cbmNvbnN0IHNoYWRvd3NFbmFibGVkID0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XG5cblx0Y29uc3RydWN0b3IoKSB7fVxuXG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblx0XHRjb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcblx0XHREb20uZGV0ZWN0KGJvZHkpO1xuXHRcdGNvbnN0IHN3aXBlckhlcm8gPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lci0taG9tZS1oZXJvJywge1xuXHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdC8vIGVmZmVjdDogJ2ZhZGUnLFxuXHRcdFx0Ly8gZm9sbG93RmluZ2VyOiB0cnVlLFxuXHRcdFx0cGFyYWxsYXg6IHRydWUsXG5cdFx0XHRzcGFjZUJldHdlZW46IDAsXG5cdFx0XHRzcGVlZDogNjAwLFxuXHRcdFx0YXV0b3BsYXk6IHtcblx0XHRcdFx0ZGVsYXk6IDUwMDAsXG5cdFx0XHRcdGRpc2FibGVPbkludGVyYWN0aW9uOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG9uOiB7XG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnc2xpZGVDaGFuZ2UnLCB0aGlzLnNsaWRlcy5sZW5ndGgsIHRoaXMuYWN0aXZlSW5kZXgpO1xuXHRcdFx0XHRcdGNvbnN0IHNsaWRlID0gdGhpcy5zbGlkZXNbdGhpcy5hY3RpdmVJbmRleF07XG5cdFx0XHRcdFx0aWYgKHNsaWRlKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB2aWRlbyA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJyk7XG5cdFx0XHRcdFx0XHRpZiAodmlkZW8pIHtcblx0XHRcdFx0XHRcdFx0Ly8gdmlkZW8ucGxheSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHQvKlxuXHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG5cdFx0XHRcdGNsaWNrYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZHluYW1pY0J1bGxldHM6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0Ki9cblx0XHR9KTtcblx0XHRjb25zdCBzd2lwZXJIaWxpZ2h0cyA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyLS1oaWxpZ2h0cycsIHtcblx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0Lypcblx0XHRcdG1vdXNld2hlZWw6IHtcblx0XHRcdFx0aW52ZXJ0OiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdCovXG5cdFx0XHRwYXJhbGxheDogdHJ1ZSxcblx0XHRcdHNwYWNlQmV0d2VlbjogMzAwLFxuXHRcdFx0c3BlZWQ6IDYwMCxcblx0XHRcdHBhZ2luYXRpb246IHtcblx0XHRcdFx0ZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxuXHRcdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdGR5bmFtaWNCdWxsZXRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG9uOiB7XG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0XHRcdFx0fSxcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCBzd2lwZXJHYWxsZXJ5ID0gbmV3IFN3aXBlcignLnN3aXBlci1jb250YWluZXItLWdhbGxlcnknLCB7XG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcblx0XHRcdHNwYWNlQmV0d2VlbjogNDUsXG5cdFx0XHRzcGVlZDogNjAwLFxuXHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG5cdFx0XHRcdGNsaWNrYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZHluYW1pY0J1bGxldHM6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0b246IHtcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyZWFkeScpO1xuXHRcdFx0XHR9LFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IHN3aXBlcnMgPSBbc3dpcGVySGVybywgc3dpcGVySGlsaWdodHMsIHN3aXBlckdhbGxlcnldLmZpbHRlcihzd2lwZXIgPT4gc3dpcGVyLmVsICE9PSB1bmRlZmluZWQpO1xuXHRcdGNvbnN0IHZpZGVvcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndmlkZW9bcGxheXNpbmxpbmVdJykpLm1hcCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0Y29uc3QgdmlkZW8gPSBuZXcgVmlkZW8obm9kZSk7XG5cdFx0XHR2aWRlby5pID0gaTtcblx0XHRcdHJldHVybiB2aWRlbztcblx0XHR9KTtcblx0XHRjb25zdCB0cmlhbmdsZXMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmlhbmdsZXMnKSkubWFwKChub2RlLCBpKSA9PiB7XG5cdFx0XHRjb25zdCB0cmlhbmdsZXMgPSBuZXcgVHJpYW5nbGVzKG5vZGUpO1xuXHRcdFx0dHJpYW5nbGVzLmkgPSBpO1xuXHRcdFx0cmV0dXJuIHRyaWFuZ2xlcztcblx0XHR9KTtcblx0XHRjb25zdCBwYXJhbGxheGVzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1wYXJhbGxheF0nKSk7XG5cdFx0Y29uc3Qgc2hhZG93cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2hhZG93XScpKTtcblx0XHRjb25zdCBhcHBlYXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hcHBlYXJdJykpO1xuXHRcdGNvbnN0IGZvbGxvd2VyID0gbmV3IEZvbGxvd2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb2xsb3dlcicpKTtcblx0XHRjb25zdCBocmVmcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWY9XCIjXCJdJykpO1xuXHRcdGNvbnN0IGxpbmtzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnRuLCAubmF2Om5vdCgubmF2LS1zZXJ2aWNlKT5saT5hJykpO1xuXHRcdGNvbnN0IHRvZ2dsZXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdG9nZ2xlXScpKTtcblx0XHRjb25zdCBtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXHRcdGNvbnN0IHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KCk7XG5cdFx0aWYgKGZvbGxvd2VyLmVuYWJsZWQpIHtcblx0XHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgnZm9sbG93ZXItZW5hYmxlZCcpO1xuXHRcdH1cblx0XHR0aGlzLmJvZHkgPSBib2R5O1xuXHRcdHRoaXMucGFnZSA9IHBhZ2U7XG5cdFx0dGhpcy5zd2lwZXJIZXJvID0gc3dpcGVySGVybztcblx0XHR0aGlzLnN3aXBlckhpbGlnaHRzID0gc3dpcGVySGlsaWdodHM7XG5cdFx0dGhpcy5zd2lwZXJzID0gc3dpcGVycztcblx0XHR0aGlzLnZpZGVvcyA9IHZpZGVvcztcblx0XHR0aGlzLnRyaWFuZ2xlcyA9IHRyaWFuZ2xlcztcblx0XHR0aGlzLnBhcmFsbGF4ZXMgPSBwYXJhbGxheGVzO1xuXHRcdHRoaXMuc2hhZG93cyA9IHNoYWRvd3M7XG5cdFx0dGhpcy5hcHBlYXJzID0gYXBwZWFycztcblx0XHR0aGlzLmZvbGxvd2VyID0gZm9sbG93ZXI7XG5cdFx0dGhpcy5ocmVmcyA9IGhyZWZzO1xuXHRcdHRoaXMubGlua3MgPSBsaW5rcztcblx0XHR0aGlzLnRvZ2dsZXJzID0gdG9nZ2xlcnM7XG5cdFx0dGhpcy5tb3VzZSA9IG1vdXNlO1xuXHRcdHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdFx0dGhpcy5hZGRMaXN0ZW5lcnMoKTtcblx0XHRib2R5LmNsYXNzTGlzdC5hZGQoJ3JlYWR5Jyk7XG5cdH1cblxuXHRhZGRMaXN0ZW5lcnMoKSB7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuXHRcdFx0YXBwLm9uUmVzaXplKCk7XG5cdFx0fSk7XG5cblx0XHQvKlxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBVdGlscy5kZWJvdW5jZSgoKSA9PiB7XG5cdFx0XHRhcHAub25TY3JvbGwoKTtcblx0XHR9KSk7XG5cdFx0Ki9cblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBVdGlscy50aHJvdHRsZSgoKSA9PiB7XG5cdFx0XHRhcHAub25TY3JvbGwoKTtcblx0XHR9LCAxMDAwIC8gMjUpKTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG5cdFx0XHRhcHAub25Nb3VzZU1vdmUoZSk7XG5cdFx0fSk7XG5cblx0XHQvKlxuXHRcdC8vIGludGVyc2VjdGlvbiBvYnNlcnZlclxuXHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IG5ldyBJbnRlcnNlY3Rpb25TZXJ2aWNlKCk7XG5cdFx0cGFyYWxsYXhlcy5mb3JFYWNoKChub2RlLCBpKSA9PiBpbnRlcnNlY3Rpb24ub2JzZXJ2ZShub2RlLCAoZW50cnksIGVpKSA9PiB7XG5cdFx0XHRsZXQgcG93ID0gMSArIDAuMSAqIGk7XG5cdFx0XHRwb3cgPSAocG93ICogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8pO1xuXHRcdFx0bm9kZS5wb3cgPSBwb3c7XG5cdFx0fSkpO1xuXHRcdCovXG5cblx0XHQvLyBocmVmPVwiI1wiIG5vb3Bcblx0XHR0aGlzLmhyZWZzLmZvckVhY2goKG5vZGUpID0+IHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMudG9nZ2xlcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGxldCB0YXJnZXQgPSBub2RlLmdldEF0dHJpYnV0ZSgndG9nZ2xlJyk7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KSA6IG5vZGU7XG5cdFx0XHRcdGNvbnN0IHRvZ2dsZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0b2dnbGUtY2xhc3MnKSB8fCAnYWN0aXZlJztcblx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModG9nZ2xlKSkge1xuXHRcdFx0XHRcdHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKHRvZ2dsZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQodG9nZ2xlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9XG5cblx0b25Nb3VzZU1vdmUoZSkge1xuXHRcdHRoaXMubW91c2UueCA9IGUuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoIC0gMC41O1xuXHRcdHRoaXMubW91c2UueSA9IGUuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCAtIDAuNTtcblx0XHRpZiAodGhpcy5mb2xsb3dlci5lbmFibGVkKSB7XG5cdFx0XHR0aGlzLmZvbGxvd2VyLmZvbGxvdyh0aGlzLmxpbmtzLm1hcCh4ID0+IFJlY3QuZnJvbU5vZGUoeCkpKTtcblx0XHRcdHRoaXMuZm9sbG93ZXIubW92ZSh7XG5cdFx0XHRcdHg6IGUuY2xpZW50WCxcblx0XHRcdFx0eTogZS5jbGllbnRZXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRvblJlc2l6ZSgpIHtcblx0XHR0aGlzLndpbmRvd1JlY3QgPSBuZXcgUmVjdCh7XG5cdFx0XHR0b3A6IDAsXG5cdFx0XHRsZWZ0OiAwLFxuXHRcdFx0d2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuXHRcdFx0aGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdFx0fSk7XG5cdFx0dGhpcy50cmlhbmdsZXMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiB7XG5cdFx0XHRhbmltYXRpb24ucmVzaXplKCk7XG5cdFx0fSk7XG5cdFx0Ly8gdGhpcy5mb2xsb3dlci5mb2xsb3codGhpcy5saW5rcy5tYXAoeCA9PiBSZWN0LmZyb21Ob2RlKHgpKSk7XG5cdH1cblxuXHRvblNjcm9sbCgpIHtcblx0XHRjb25zdCBzY3JvbGxUb3AgPSBEb20uc2Nyb2xsVG9wKCk7XG5cdFx0Ly8gZmFzdHNjcm9sbCBtb2JpbGVcblx0XHRpZiAoRG9tLmZhc3RzY3JvbGwpIHtcblx0XHRcdGNvbnN0IG5ld1RvcCA9IE1hdGgucm91bmQoc2Nyb2xsVG9wICogMTApIC8gMTA7XG5cdFx0XHRpZiAodGhpcy5wYWdlLnByZXZpb3VzVG9wICE9PSBuZXdUb3ApIHtcblx0XHRcdFx0dGhpcy5wYWdlLnByZXZpb3VzVG9wID0gbmV3VG9wO1xuXHRcdFx0XHREb20uc2Nyb2xsaW5nID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdERvbS5zY3JvbGxpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHNjcm9sbFRvcCA+IDgwKSB7XG5cdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LmFkZCgnZml4ZWQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XG5cdFx0fVxuXHRcdHRoaXMuYXBwZWFycyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYXBwZWFyXScpKTtcblx0XHQvLyB0aGlzLmZvbGxvd2VyLmZvbGxvdyh0aGlzLmxpbmtzLm1hcCh4ID0+IFJlY3QuZnJvbU5vZGUoeCkpKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblxuXHRcdC8vIHNtb290aHNjcm9sbCBkZXNrdG9wXG5cdFx0Ly8gaWYgKCFEb20ub3ZlcnNjcm9sbCAmJiAhRG9tLnRvdWNoKSB7XG5cdFx0aWYgKCFEb20uZmFzdHNjcm9sbCkge1xuXHRcdFx0aWYgKHRoaXMuYm9keS5vZmZzZXRIZWlnaHQgIT09IHRoaXMucGFnZS5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdFx0dGhpcy5ib2R5LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgaGVpZ2h0OiAke3RoaXMucGFnZS5vZmZzZXRIZWlnaHR9cHg7YCk7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdFR3ZWVuTWF4LnNldCh0aGlzLmJvZHksIHtcblx0XHRcdFx0XHRoZWlnaHQ6IHRoaXMucGFnZS5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQqL1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2Nyb2xsVG9wID0gRG9tLnNjcm9sbFRvcCgpO1xuXHRcdFx0bGV0IG5ld1RvcCA9IHRoaXMucGFnZS5wcmV2aW91c1RvcCB8fCAwO1xuXHRcdFx0bmV3VG9wICs9IChzY3JvbGxUb3AgLSBuZXdUb3ApIC8gNTtcblx0XHRcdGlmIChNYXRoLmFicyhzY3JvbGxUb3AgLSBuZXdUb3ApIDwgMC4xNSkge1xuXHRcdFx0XHRuZXdUb3AgPSBzY3JvbGxUb3A7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmV3VG9wICE9PSB1bmRlZmluZWQgJiYgIU51bWJlci5pc05hTihuZXdUb3ApICYmIHRoaXMucGFnZS5wcmV2aW91c1RvcCAhPT0gbmV3VG9wKSB7XG5cdFx0XHRcdHRoaXMucGFnZS5wcmV2aW91c1RvcCA9IG5ld1RvcDtcblx0XHRcdFx0Ly8gdGhpcy5wYWdlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgdG9wOiAkey1uZXdUb3B9cHg7YCk7XG5cdFx0XHRcdHRoaXMucGFnZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHRyYW5zZm9ybTogdHJhbnNsYXRlWSgkey1uZXdUb3B9cHgpO2ApO1xuXHRcdFx0XHQvKlxuXHRcdFx0XHRUd2Vlbk1heC5zZXQodGhpcy5wYWdlLCB7XG5cdFx0XHRcdFx0eTogLW5ld1RvcCxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCovXG5cdFx0XHRcdERvbS5zY3JvbGxpbmcgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0RG9tLnNjcm9sbGluZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5ib2R5Lmhhc0F0dHJpYnV0ZSgnc3R5bGUnKSkge1xuXHRcdFx0dGhpcy5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblx0XHRcdHRoaXMucGFnZS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHNoYWRvd3NFbmFibGVkICYmICFEb20uc2Nyb2xsaW5nKSB7XG5cdFx0XHQvLyBzaGFkb3dzXG5cdFx0XHR0aGlzLnNoYWRvd3MuZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0XHRjb25zdCB4eSA9IG5vZGUueHkgfHwgeyB4OiAwLCB5OiAwIH07XG5cdFx0XHRcdGNvbnN0IGR4ID0gdGhpcy5tb3VzZS54IC0geHkueDtcblx0XHRcdFx0Y29uc3QgZHkgPSB0aGlzLm1vdXNlLnkgLSB4eS55O1xuXHRcdFx0XHR4eS54ICs9IGR4IC8gODtcblx0XHRcdFx0eHkueSArPSBkeSAvIDg7XG5cdFx0XHRcdGNvbnN0IHNoYWRvdyA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNoYWRvdycpIHx8IDkwO1xuXHRcdFx0XHRjb25zdCBhbHBoYSA9ICgwLjIgKyAwLjMgKiAoTWF0aC5hYnMoeHkueCkgKyBNYXRoLmFicyh4eS55KSkgLyAyKS50b0ZpeGVkKDMpO1xuXHRcdFx0XHRjb25zdCB4ID0gKHh5LnggKiAtMTAwKS50b0ZpeGVkKDIpO1xuXHRcdFx0XHRjb25zdCB5ID0gKHh5LnkgKiAtNTApLnRvRml4ZWQoMik7XG5cdFx0XHRcdGNvbnN0IGJveFNoYWRvdyA9IGAke3h9cHggJHt5fXB4ICR7c2hhZG93fXB4IC0xMHB4IHJnYmEoMCwgMCwgMCwgJHthbHBoYX0pYDtcblx0XHRcdFx0Ly8gaWYgKG5vZGUuYm94U2hhZG93ICE9PSBib3hTaGFkb3cpIHtcblx0XHRcdFx0Ly8gXHRub2RlLmJveFNoYWRvdyA9IGJveFNoYWRvdztcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYGJveC1zaGFkb3c6ICR7Ym94U2hhZG93fWApO1xuXHRcdFx0XHQvKlxuXHRcdFx0XHRUd2Vlbk1heC5zZXQobm9kZSwge1xuXHRcdFx0XHRcdGJveFNoYWRvdzogYm94U2hhZG93LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ki9cblx0XHRcdFx0Ly8gfVxuXHRcdFx0XHRub2RlLnh5ID0geHk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBzd2lwZXJzXG5cdFx0dGhpcy5zd2lwZXJzLmZvckVhY2goKHN3aXBlciwgaSkgPT4ge1xuXHRcdFx0aWYgKHN3aXBlci5wYXJhbXMuYXV0b3BsYXkuZW5hYmxlZCAmJiAhc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5kaXNhYmxlT25JbnRlcmFjdGlvbikge1xuXHRcdFx0XHRjb25zdCBub2RlID0gc3dpcGVyLmVsO1xuXHRcdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRcdGlmIChpbnRlcnNlY3Rpb24ueSA+IDApIHtcblx0XHRcdFx0XHRpZiAoIXN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSB7XG5cdFx0XHRcdFx0XHRzd2lwZXIuYXV0b3BsYXkuc3RhcnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHN3aXBlci5hdXRvcGxheS5ydW5uaW5nKSB7XG5cdFx0XHRcdFx0XHRzd2lwZXIuYXV0b3BsYXkuc3RvcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gdmlkZW9zXG5cdFx0dGhpcy52aWRlb3MuZm9yRWFjaCgodmlkZW8sIGkpID0+IHtcblx0XHRcdGNvbnN0IG5vZGUgPSB2aWRlby5ub2RlO1xuXHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdGlmIChpbnRlcnNlY3Rpb24ueSA+IDAgJiYgaW50ZXJzZWN0aW9uLnggPiAwKSB7XG5cdFx0XHRcdHZpZGVvLmFwcGVhcigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmlkZW8uZGlzYXBwZWFyKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoIURvbS5tb2JpbGUpIHtcblxuXHRcdFx0Ly8gdHJpYW5nbGVzXG5cdFx0XHR0aGlzLnRyaWFuZ2xlcy5mb3JFYWNoKCh0cmlhbmdsZSwgaSkgPT4ge1xuXHRcdFx0XHRjb25zdCBub2RlID0gdHJpYW5nbGUubm9kZTtcblx0XHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uLnkgPiAwKSB7XG5cdFx0XHRcdFx0dHJpYW5nbGUuYXBwZWFyKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dHJpYW5nbGUuZGlzYXBwZWFyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBwYXJhbGxheFxuXHRcdFx0Lypcblx0XHRcdHRoaXMucGFyYWxsYXhlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG5cdFx0XHRcdGxldCBjdXJyZW50WSA9IG5vZGUuY3VycmVudFkgfHwgMDtcblx0XHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0XHRyZWN0ID0gbmV3IFJlY3Qoe1xuXHRcdFx0XHRcdHRvcDogcmVjdC50b3AgLSBjdXJyZW50WSxcblx0XHRcdFx0XHRsZWZ0OiByZWN0LmxlZnQsXG5cdFx0XHRcdFx0d2lkdGg6IHJlY3Qud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiByZWN0LmhlaWdodCxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRcdGN1cnJlbnRZID0gaW50ZXJzZWN0aW9uLmNlbnRlci55ICogcGFyc2VJbnQobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyYWxsYXgnKSk7XG5cdFx0XHRcdGlmIChub2RlLmN1cnJlbnRZICE9PSBjdXJyZW50WSkge1xuXHRcdFx0XHRcdG5vZGUuY3VycmVudFkgPSBjdXJyZW50WTtcblx0XHRcdFx0XHRUd2Vlbk1heC5zZXQobm9kZSwge1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgnICsgY3VycmVudFkgKyAncHgpJyxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQqL1xuXHRcdFx0dGhpcy5wYXJhbGxheGVzLmZvckVhY2goKG5vZGUsIGkpID0+IHtcblx0XHRcdFx0Y29uc3QgcGFyYWxsYXggPSBub2RlLnBhcmFsbGF4IHx8IChub2RlLnBhcmFsbGF4ID0gcGFyc2VJbnQobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyYWxsYXgnKSkgfHwgNSkgKiAyO1xuXHRcdFx0XHRjb25zdCBkaXJlY3Rpb24gPSBpICUgMiA9PT0gMCA/IDEgOiAtMTtcblx0XHRcdFx0bGV0IGN1cnJlbnRZID0gbm9kZS5jdXJyZW50WSB8fCAwO1xuXHRcdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRcdHJlY3QgPSBuZXcgUmVjdCh7XG5cdFx0XHRcdFx0dG9wOiByZWN0LnRvcCxcblx0XHRcdFx0XHRsZWZ0OiByZWN0LmxlZnQsXG5cdFx0XHRcdFx0d2lkdGg6IHJlY3Qud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiByZWN0LmhlaWdodCxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRcdGlmIChpbnRlcnNlY3Rpb24ueSA+IDApIHtcblx0XHRcdFx0XHRjb25zdCB5ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoLTEsIGludGVyc2VjdGlvbi5jZW50ZXIueSkpO1xuXHRcdFx0XHRcdGNvbnN0IHMgPSAoMTAwICsgcGFyYWxsYXggKiAyKSAvIDEwMDtcblx0XHRcdFx0XHRjdXJyZW50WSA9ICgtNTAgKyB5ICogcGFyYWxsYXggKiBkaXJlY3Rpb24pLnRvRml4ZWQoMyk7XG5cdFx0XHRcdFx0aWYgKG5vZGUuY3VycmVudFkgIT09IGN1cnJlbnRZKSB7XG5cdFx0XHRcdFx0XHRub2RlLmN1cnJlbnRZID0gY3VycmVudFk7XG5cdFx0XHRcdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYmFja2dyb3VuZCcpKSB7XG5cdFx0XHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB0b3A6IDUwJTsgbGVmdDogNTAlOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgke2N1cnJlbnRZfSUpIHNjYWxlM2QoJHtzfSwke3N9LDEuMCk7YCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgdG9wOiA1MCU7IGxlZnQ6IDUwJTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpIHRyYW5zbGF0ZVkoJHtjdXJyZW50WX0lKTtgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBmb2xsb3dlclxuXHRcdFx0aWYgKHRoaXMuZm9sbG93ZXIuZW5hYmxlZCkge1xuXHRcdFx0XHR0aGlzLmZvbGxvd2VyLnJlbmRlcigpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gYXBwZWFyc1xuXHRcdGxldCBmaSA9IDA7XG5cdFx0dGhpcy5hcHBlYXJzLmZvckVhY2goKG5vZGUsIGkpID0+IHtcblx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRpZiAoaW50ZXJzZWN0aW9uLnkgPiAwKSB7XG5cdFx0XHRcdGZpID0gZmkgfHwgaTtcblx0XHRcdFx0Lypcblx0XHRcdFx0bGV0IG92ZXJsYXAgPSAnLT0wLjMnO1xuXHRcdFx0XHRpZiAoIXRoaXMudGltZWxpbmUuaXNBY3RpdmUoKSkge1xuXHRcdFx0XHRcdG92ZXJsYXAgPSAnKz0wJztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnRpbWVsaW5lLnRvKG5vZGUsIDAuNSwgeyBhdXRvQWxwaGE6IDEgfSwgb3ZlcmxhcCk7XG5cdFx0XHRcdCovXG5cdFx0XHRcdGlmICghbm9kZS50bykge1xuXHRcdFx0XHRcdG5vZGUudG8gPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZCgnYXBwZWFyZWQnKTtcblx0XHRcdFx0XHR9LCAxNTAgKiAoaSAtIGZpKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnYXBwZWFyZWQnKSkge1xuXHRcdFx0XHRcdG5vZGUudG8gPSBudWxsO1xuXHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYXBwZWFyZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH1cblxuXHRsb29wKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0aWYgKHRoaXMucGxheWluZykge1xuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXMubG9vcCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cGxheSgpIHtcblx0XHR0aGlzLnBsYXlpbmcgPSB0cnVlO1xuXHRcdHRoaXMubG9vcCgpO1xuXHR9XG5cblx0cGF1c2UoKSB7XG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cdH1cblxufVxuXG52YXIgYXBwID0gbmV3IEFwcCgpO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuXHRhcHAuaW5pdCgpO1xuXHRhcHAucGxheSgpO1xufTtcbiJdLCJmaWxlIjoiZG9jcy9qcy9hcHAuanMifQ==
