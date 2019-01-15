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
        newTop += (scrollTop - newTop) / 3;

        if (Math.abs(scrollTop - newTop < 0.15)) {
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

        if (intersection.y > 0) {
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
          var parallax = node.parallax || (node.parallax = parseInt(node.getAttribute('data-parallax')) || 5);
          var direction = i % 2 === 0 ? 1 : -1;
          var currentY = node.currentY || 0;

          var rect = _rect.default.fromNode(node);

          rect = new _rect.default({
            top: rect.top - currentY,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          var intersection = rect.intersection(_this.windowRect);

          if (intersection.y > 0) {
            var y = Math.min(1, Math.max(-1, intersection.center.y));
            var s = (100 + parallax * 2) / 100;
            currentY = (y * parallax * direction).toFixed(3);

            if (node.currentY !== currentY) {
              node.currentY = currentY;

              if (node.parentNode.classList.contains('background')) {
                node.setAttribute('style', "left: 50%; transform: translateX(-50%) translateY(".concat(currentY, "%) scale3d(").concat(s, ",").concat(s, ",1.0);"));
              } else {
                node.setAttribute('style', "left: 50%; transform: translateX(-50%) translateY(".concat(currentY, "%);"));
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
        this.div2.setAttribute('style', "opacity: 1; left:".concat(this.x2, "px; top:").concat(this.y2, "px;")); // this.div1.setAttribute('style', `opacity: ${this.o}; transform: translateX(${this.x + this.w / 2 - 50}px) translateY(${this.y + this.h / 2 - 50}px) scale3d(${this.s},${this.s},1.0);`);
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
  }

  _createClass(Video, [{
    key: "appear",
    value: function appear() {
      if (!this.visible) {
        this.visible = true;
        this.node.play();
      }
    }
  }, {
    key: "disappear",
    value: function disappear() {
      if (this.visible) {
        this.visible = false;
        this.node.pause();
      }
    }
  }]);

  return Video;
}();

exports.default = Video;

},{}]},{},[1]);

//# sourceMappingURL=app.js.map
