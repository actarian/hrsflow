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
var menuStyle = 1;

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
      menuStyle = body.classList.contains('fixed') ? 0 : 1;
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
      var swiperMedia = new Swiper('.swiper-container--media', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        simulateTouch: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        on: {
          init: function init() {
            this.el.classList.add('ready');
          }
        }
      });
      var swipers = [swiperHero, swiperHilights, swiperGallery, swiperMedia].filter(function (swiper) {
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
      appears.forEach(function (node) {
        // node.appearingIndex = [].slice.call(node.parentNode.childNodes).filter(x => x.nodeType === 1 && x.hasAttribute('data-appear')).indexOf(node);
        var section = node.parentNode;
        var p = node;

        while (p) {
          p = p.parentNode;

          if (p && p.classList && p.classList.contains('section')) {
            section = p;
            p = null;
          }
        }

        node.appearingIndex = [].slice.call(section.querySelectorAll('[data-appear]')).indexOf(node);
      });
      var follower = new _follower.default(document.querySelector('.follower'));
      var hrefs = [].slice.call(document.querySelectorAll('[href="#"]'));
      var links = [].slice.call(document.querySelectorAll('.btn, .nav:not(.nav--service)>li>a'));
      var togglers = [].slice.call(document.querySelectorAll('[toggle]'));
      var stickys = [].slice.call(document.querySelectorAll('[sticky]'));
      stickys.forEach(function (x) {
        return x.content = x.querySelector('[sticky-content]');
      });
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
      this.stickys = stickys;
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
      window.addEventListener('wheel', function (e) {
        app.onWheel(e);
      });
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
    value: function onScroll(e) {
      var scrollTop = _dom.default.scrollTop(); // fastscroll mobile


      if (_dom.default.fastscroll) {
        var newTop = Math.round(scrollTop * 10) / 10;

        if (this.page.previousTop !== newTop) {
          this.page.previousTop = newTop;
          _dom.default.scrolling = true;

          if (newTop > this.page.previousTop) {
            this.body.classList.add('scroll-up');
            this.body.classList.remove('scroll-down');
          } else {
            this.body.classList.remove('scroll-up');
            this.body.classList.add('scroll-down');
          }
        } else {
          _dom.default.scrolling = false;
        }
      }

      if (scrollTop > 80) {
        this.body.classList.add('fixed');
      } else if (menuStyle === 1) {
        this.body.classList.remove('fixed');
      } // !!! this.appears = [].slice.call(document.querySelectorAll('[data-appear]'));
      // this.follower.follow(this.links.map(x => Rect.fromNode(x)));

    }
  }, {
    key: "onWheel",
    value: function onWheel(e) {
      if (e.deltaY > 0) {
        this.body.classList.add('scroll-up');
        this.body.classList.remove('scroll-down');
      } else {
        this.body.classList.remove('scroll-up');
        this.body.classList.add('scroll-down');
      }
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
      // let firstVisibleIndex = 0;


      this.appears.forEach(function (node, i) {
        var rect = _rect.default.fromNode(node);

        var intersection = rect.intersection(_this.windowRect);

        if (intersection.y > 0) {
          // 	firstVisibleIndex = firstVisibleIndex || i;

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
            }, 150 * node.appearingIndex); // (i - firstVisibleIndex));
          }
        } else {
          if (node.classList.contains('appeared')) {
            node.to = null;
            node.classList.remove('appeared');
          }
        }
      });
      this.stickys.forEach(function (node, i) {
        var top = parseInt(node.getAttribute('sticky')) || 0;

        var rect = _rect.default.fromNode(node);

        var maxtop = node.offsetHeight - node.content.offsetHeight;

        if (rect.left > 30) {
          top = Math.max(0, Math.min(maxtop, top - rect.top));
          node.content.setAttribute('style', "transform: translateY(".concat(top, "px);"));
        } else {
          node.content.setAttribute('style', "transform: none;");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzcmMvYXBwL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgU3dpcGVyLCBUd2Vlbk1heCwgVGltZWxpbmVNYXggKi9cblxuaW1wb3J0IERvbSBmcm9tICcuL3NoYXJlZC9kb20nO1xuaW1wb3J0IEZvbGxvd2VyIGZyb20gJy4vc2hhcmVkL2ZvbGxvd2VyJztcbmltcG9ydCBSZWN0IGZyb20gJy4vc2hhcmVkL3JlY3QnO1xuaW1wb3J0IFRyaWFuZ2xlcyBmcm9tICcuL3NoYXJlZC90cmlhbmdsZXMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vc2hhcmVkL3V0aWxzJztcbmltcG9ydCBWaWRlbyBmcm9tICcuL3NoYXJlZC92aWRlbyc7XG5cbmNvbnN0IHNoYWRvd3NFbmFibGVkID0gZmFsc2U7XG5sZXQgbWVudVN0eWxlID0gMTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcblxuXHRjb25zdHJ1Y3RvcigpIHt9XG5cblx0aW5pdCgpIHtcblx0XHRjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXHRcdG1lbnVTdHlsZSA9IGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpID8gMCA6IDE7XG5cdFx0Y29uc3QgcGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlJyk7XG5cdFx0RG9tLmRldGVjdChib2R5KTtcblx0XHRjb25zdCBzd2lwZXJIZXJvID0gbmV3IFN3aXBlcignLnN3aXBlci1jb250YWluZXItLWhvbWUtaGVybycsIHtcblx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHQvLyBlZmZlY3Q6ICdmYWRlJyxcblx0XHRcdC8vIGZvbGxvd0ZpbmdlcjogdHJ1ZSxcblx0XHRcdHBhcmFsbGF4OiB0cnVlLFxuXHRcdFx0c3BhY2VCZXR3ZWVuOiAwLFxuXHRcdFx0c3BlZWQ6IDYwMCxcblx0XHRcdGF1dG9wbGF5OiB7XG5cdFx0XHRcdGRlbGF5OiA1MDAwLFxuXHRcdFx0XHRkaXNhYmxlT25JbnRlcmFjdGlvbjogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0XHRvbjoge1xuXHRcdFx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3JlYWR5Jyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3NsaWRlQ2hhbmdlJywgdGhpcy5zbGlkZXMubGVuZ3RoLCB0aGlzLmFjdGl2ZUluZGV4KTtcblx0XHRcdFx0XHRjb25zdCBzbGlkZSA9IHRoaXMuc2xpZGVzW3RoaXMuYWN0aXZlSW5kZXhdO1xuXHRcdFx0XHRcdGlmIChzbGlkZSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdmlkZW8gPSBzbGlkZS5xdWVyeVNlbGVjdG9yKCd2aWRlbycpO1xuXHRcdFx0XHRcdFx0aWYgKHZpZGVvKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHZpZGVvLnBsYXkoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0Lypcblx0XHRcdHBhZ2luYXRpb246IHtcblx0XHRcdFx0ZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxuXHRcdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdGR5bmFtaWNCdWxsZXRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdCovXG5cdFx0fSk7XG5cdFx0Y29uc3Qgc3dpcGVySGlsaWdodHMgPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lci0taGlsaWdodHMnLCB7XG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdC8qXG5cdFx0XHRtb3VzZXdoZWVsOiB7XG5cdFx0XHRcdGludmVydDogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0XHQqL1xuXHRcdFx0cGFyYWxsYXg6IHRydWUsXG5cdFx0XHRzcGFjZUJldHdlZW46IDMwMCxcblx0XHRcdHNwZWVkOiA2MDAsXG5cdFx0XHRwYWdpbmF0aW9uOiB7XG5cdFx0XHRcdGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcblx0XHRcdFx0Y2xpY2thYmxlOiB0cnVlLFxuXHRcdFx0XHRkeW5hbWljQnVsbGV0czogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0XHRvbjoge1xuXHRcdFx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3JlYWR5Jyk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3Qgc3dpcGVyR2FsbGVyeSA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyLS1nYWxsZXJ5Jywge1xuXHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRzbGlkZXNQZXJWaWV3OiAnYXV0bycsXG5cdFx0XHRzcGFjZUJldHdlZW46IDQ1LFxuXHRcdFx0c3BlZWQ6IDYwMCxcblx0XHRcdHBhZ2luYXRpb246IHtcblx0XHRcdFx0ZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxuXHRcdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdGR5bmFtaWNCdWxsZXRzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdG9uOiB7XG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0XHRcdFx0fSxcblx0XHRcdH1cblx0XHR9KTtcblx0XHRjb25zdCBzd2lwZXJNZWRpYSA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyLS1tZWRpYScsIHtcblx0XHRcdGxvb3A6IHRydWUsXG5cdFx0XHRzbGlkZXNQZXJWaWV3OiAxLFxuXHRcdFx0c3BhY2VCZXR3ZWVuOiAwLFxuXHRcdFx0c3BlZWQ6IDYwMCxcblx0XHRcdHNpbXVsYXRlVG91Y2g6IGZhbHNlLFxuXHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG5cdFx0XHRcdGNsaWNrYWJsZTogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0XHRvbjoge1xuXHRcdFx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ3JlYWR5Jyk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29uc3Qgc3dpcGVycyA9IFtzd2lwZXJIZXJvLCBzd2lwZXJIaWxpZ2h0cywgc3dpcGVyR2FsbGVyeSwgc3dpcGVyTWVkaWFdLmZpbHRlcihzd2lwZXIgPT4gc3dpcGVyLmVsICE9PSB1bmRlZmluZWQpO1xuXHRcdGNvbnN0IHZpZGVvcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndmlkZW9bcGxheXNpbmxpbmVdJykpLm1hcCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0Y29uc3QgdmlkZW8gPSBuZXcgVmlkZW8obm9kZSk7XG5cdFx0XHR2aWRlby5pID0gaTtcblx0XHRcdHJldHVybiB2aWRlbztcblx0XHR9KTtcblx0XHRjb25zdCB0cmlhbmdsZXMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmlhbmdsZXMnKSkubWFwKChub2RlLCBpKSA9PiB7XG5cdFx0XHRjb25zdCB0cmlhbmdsZXMgPSBuZXcgVHJpYW5nbGVzKG5vZGUpO1xuXHRcdFx0dHJpYW5nbGVzLmkgPSBpO1xuXHRcdFx0cmV0dXJuIHRyaWFuZ2xlcztcblx0XHR9KTtcblx0XHRjb25zdCBwYXJhbGxheGVzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1wYXJhbGxheF0nKSk7XG5cdFx0Y29uc3Qgc2hhZG93cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2hhZG93XScpKTtcblx0XHRjb25zdCBhcHBlYXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hcHBlYXJdJykpO1xuXHRcdGFwcGVhcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0Ly8gbm9kZS5hcHBlYXJpbmdJbmRleCA9IFtdLnNsaWNlLmNhbGwobm9kZS5wYXJlbnROb2RlLmNoaWxkTm9kZXMpLmZpbHRlcih4ID0+IHgubm9kZVR5cGUgPT09IDEgJiYgeC5oYXNBdHRyaWJ1dGUoJ2RhdGEtYXBwZWFyJykpLmluZGV4T2Yobm9kZSk7XG5cdFx0XHRsZXQgc2VjdGlvbiA9IG5vZGUucGFyZW50Tm9kZTtcblx0XHRcdGxldCBwID0gbm9kZTtcblx0XHRcdHdoaWxlIChwKSB7XG5cdFx0XHRcdHAgPSBwLnBhcmVudE5vZGU7XG5cdFx0XHRcdGlmIChwICYmIHAuY2xhc3NMaXN0ICYmIHAuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWN0aW9uJykpIHtcblx0XHRcdFx0XHRzZWN0aW9uID0gcDtcblx0XHRcdFx0XHRwID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bm9kZS5hcHBlYXJpbmdJbmRleCA9IFtdLnNsaWNlLmNhbGwoc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hcHBlYXJdJykpLmluZGV4T2Yobm9kZSk7XG5cdFx0fSk7XG5cdFx0Y29uc3QgZm9sbG93ZXIgPSBuZXcgRm9sbG93ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvbGxvd2VyJykpO1xuXHRcdGNvbnN0IGhyZWZzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZj1cIiNcIl0nKSk7XG5cdFx0Y29uc3QgbGlua3MgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4sIC5uYXY6bm90KC5uYXYtLXNlcnZpY2UpPmxpPmEnKSk7XG5cdFx0Y29uc3QgdG9nZ2xlcnMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0b2dnbGVdJykpO1xuXHRcdGNvbnN0IHN0aWNreXMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tzdGlja3ldJykpO1xuXHRcdHN0aWNreXMuZm9yRWFjaCh4ID0+IHguY29udGVudCA9IHgucXVlcnlTZWxlY3RvcignW3N0aWNreS1jb250ZW50XScpKTtcblx0XHRjb25zdCBtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXHRcdGNvbnN0IHRpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KCk7XG5cdFx0aWYgKGZvbGxvd2VyLmVuYWJsZWQpIHtcblx0XHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgnZm9sbG93ZXItZW5hYmxlZCcpO1xuXHRcdH1cblx0XHR0aGlzLmJvZHkgPSBib2R5O1xuXHRcdHRoaXMucGFnZSA9IHBhZ2U7XG5cdFx0dGhpcy5zd2lwZXJIZXJvID0gc3dpcGVySGVybztcblx0XHR0aGlzLnN3aXBlckhpbGlnaHRzID0gc3dpcGVySGlsaWdodHM7XG5cdFx0dGhpcy5zd2lwZXJzID0gc3dpcGVycztcblx0XHR0aGlzLnZpZGVvcyA9IHZpZGVvcztcblx0XHR0aGlzLnRyaWFuZ2xlcyA9IHRyaWFuZ2xlcztcblx0XHR0aGlzLnBhcmFsbGF4ZXMgPSBwYXJhbGxheGVzO1xuXHRcdHRoaXMuc2hhZG93cyA9IHNoYWRvd3M7XG5cdFx0dGhpcy5hcHBlYXJzID0gYXBwZWFycztcblx0XHR0aGlzLnN0aWNreXMgPSBzdGlja3lzO1xuXHRcdHRoaXMuZm9sbG93ZXIgPSBmb2xsb3dlcjtcblx0XHR0aGlzLmhyZWZzID0gaHJlZnM7XG5cdFx0dGhpcy5saW5rcyA9IGxpbmtzO1xuXHRcdHRoaXMudG9nZ2xlcnMgPSB0b2dnbGVycztcblx0XHR0aGlzLm1vdXNlID0gbW91c2U7XG5cdFx0dGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuXHRcdHRoaXMub25SZXNpemUoKTtcblx0XHR0aGlzLmFkZExpc3RlbmVycygpO1xuXHRcdGJvZHkuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblx0fVxuXG5cdGFkZExpc3RlbmVycygpIHtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHRhcHAub25SZXNpemUoKTtcblx0XHR9KTtcblxuXHRcdC8qXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIFV0aWxzLmRlYm91bmNlKCgpID0+IHtcblx0XHRcdGFwcC5vblNjcm9sbCgpO1xuXHRcdH0pKTtcblx0XHQqL1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIFV0aWxzLnRocm90dGxlKCgpID0+IHtcblx0XHRcdGFwcC5vblNjcm9sbCgpO1xuXHRcdH0sIDEwMDAgLyAyNSkpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGUpID0+IHtcblx0XHRcdGFwcC5vbldoZWVsKGUpO1xuXHRcdH0pO1xuXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcblx0XHRcdGFwcC5vbk1vdXNlTW92ZShlKTtcblx0XHR9KTtcblxuXHRcdC8qXG5cdFx0Ly8gaW50ZXJzZWN0aW9uIG9ic2VydmVyXG5cdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gbmV3IEludGVyc2VjdGlvblNlcnZpY2UoKTtcblx0XHRwYXJhbGxheGVzLmZvckVhY2goKG5vZGUsIGkpID0+IGludGVyc2VjdGlvbi5vYnNlcnZlKG5vZGUsIChlbnRyeSwgZWkpID0+IHtcblx0XHRcdGxldCBwb3cgPSAxICsgMC4xICogaTtcblx0XHRcdHBvdyA9IChwb3cgKiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyk7XG5cdFx0XHRub2RlLnBvdyA9IHBvdztcblx0XHR9KSk7XG5cdFx0Ki9cblxuXHRcdC8vIGhyZWY9XCIjXCIgbm9vcFxuXHRcdHRoaXMuaHJlZnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy50b2dnbGVycy5mb3JFYWNoKChub2RlKSA9PiB7XG5cdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0bGV0IHRhcmdldCA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0b2dnbGUnKTtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0ID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpIDogbm9kZTtcblx0XHRcdFx0Y29uc3QgdG9nZ2xlID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ3RvZ2dsZS1jbGFzcycpIHx8ICdhY3RpdmUnO1xuXHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0b2dnbGUpKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodG9nZ2xlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCh0b2dnbGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRvbk1vdXNlTW92ZShlKSB7XG5cdFx0dGhpcy5tb3VzZS54ID0gZS5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGggLSAwLjU7XG5cdFx0dGhpcy5tb3VzZS55ID0gZS5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0IC0gMC41O1xuXHRcdGlmICh0aGlzLmZvbGxvd2VyLmVuYWJsZWQpIHtcblx0XHRcdHRoaXMuZm9sbG93ZXIuZm9sbG93KHRoaXMubGlua3MubWFwKHggPT4gUmVjdC5mcm9tTm9kZSh4KSkpO1xuXHRcdFx0dGhpcy5mb2xsb3dlci5tb3ZlKHtcblx0XHRcdFx0eDogZS5jbGllbnRYLFxuXHRcdFx0XHR5OiBlLmNsaWVudFlcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdG9uUmVzaXplKCkge1xuXHRcdHRoaXMud2luZG93UmVjdCA9IG5ldyBSZWN0KHtcblx0XHRcdHRvcDogMCxcblx0XHRcdGxlZnQ6IDAsXG5cdFx0XHR3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG5cdFx0XHRoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcblx0XHR9KTtcblx0XHR0aGlzLnRyaWFuZ2xlcy5mb3JFYWNoKChhbmltYXRpb24pID0+IHtcblx0XHRcdGFuaW1hdGlvbi5yZXNpemUoKTtcblx0XHR9KTtcblx0XHQvLyB0aGlzLmZvbGxvd2VyLmZvbGxvdyh0aGlzLmxpbmtzLm1hcCh4ID0+IFJlY3QuZnJvbU5vZGUoeCkpKTtcblx0fVxuXG5cdG9uU2Nyb2xsKGUpIHtcblx0XHRjb25zdCBzY3JvbGxUb3AgPSBEb20uc2Nyb2xsVG9wKCk7XG5cdFx0Ly8gZmFzdHNjcm9sbCBtb2JpbGVcblx0XHRpZiAoRG9tLmZhc3RzY3JvbGwpIHtcblx0XHRcdGNvbnN0IG5ld1RvcCA9IE1hdGgucm91bmQoc2Nyb2xsVG9wICogMTApIC8gMTA7XG5cdFx0XHRpZiAodGhpcy5wYWdlLnByZXZpb3VzVG9wICE9PSBuZXdUb3ApIHtcblx0XHRcdFx0dGhpcy5wYWdlLnByZXZpb3VzVG9wID0gbmV3VG9wO1xuXHRcdFx0XHREb20uc2Nyb2xsaW5nID0gdHJ1ZTtcblx0XHRcdFx0aWYgKG5ld1RvcCA+IHRoaXMucGFnZS5wcmV2aW91c1RvcCkge1xuXHRcdFx0XHRcdHRoaXMuYm9keS5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtdXAnKTtcblx0XHRcdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWRvd24nKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLXVwJyk7XG5cdFx0XHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1kb3duJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdERvbS5zY3JvbGxpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHNjcm9sbFRvcCA+IDgwKSB7XG5cdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LmFkZCgnZml4ZWQnKTtcblx0XHR9IGVsc2UgaWYgKG1lbnVTdHlsZSA9PT0gMSkge1xuXHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XG5cdFx0fVxuXHRcdC8vICEhISB0aGlzLmFwcGVhcnMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFwcGVhcl0nKSk7XG5cdFx0Ly8gdGhpcy5mb2xsb3dlci5mb2xsb3codGhpcy5saW5rcy5tYXAoeCA9PiBSZWN0LmZyb21Ob2RlKHgpKSk7XG5cdH1cblxuXHRvbldoZWVsKGUpIHtcblx0XHRpZiAoZS5kZWx0YVkgPiAwKSB7XG5cdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsLXVwJyk7XG5cdFx0XHR0aGlzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWRvd24nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC11cCcpO1xuXHRcdFx0dGhpcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1kb3duJyk7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXG5cdFx0Ly8gc21vb3Roc2Nyb2xsIGRlc2t0b3Bcblx0XHQvLyBpZiAoIURvbS5vdmVyc2Nyb2xsICYmICFEb20udG91Y2gpIHtcblx0XHRpZiAoIURvbS5mYXN0c2Nyb2xsKSB7XG5cdFx0XHRpZiAodGhpcy5ib2R5Lm9mZnNldEhlaWdodCAhPT0gdGhpcy5wYWdlLm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHR0aGlzLmJvZHkuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBoZWlnaHQ6ICR7dGhpcy5wYWdlLm9mZnNldEhlaWdodH1weDtgKTtcblx0XHRcdFx0Lypcblx0XHRcdFx0VHdlZW5NYXguc2V0KHRoaXMuYm9keSwge1xuXHRcdFx0XHRcdGhlaWdodDogdGhpcy5wYWdlLm9mZnNldEhlaWdodCxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCovXG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzY3JvbGxUb3AgPSBEb20uc2Nyb2xsVG9wKCk7XG5cdFx0XHRsZXQgbmV3VG9wID0gdGhpcy5wYWdlLnByZXZpb3VzVG9wIHx8IDA7XG5cdFx0XHRuZXdUb3AgKz0gKHNjcm9sbFRvcCAtIG5ld1RvcCkgLyA1O1xuXHRcdFx0aWYgKE1hdGguYWJzKHNjcm9sbFRvcCAtIG5ld1RvcCkgPCAwLjE1KSB7XG5cdFx0XHRcdG5ld1RvcCA9IHNjcm9sbFRvcDtcblx0XHRcdH1cblx0XHRcdGlmIChuZXdUb3AgIT09IHVuZGVmaW5lZCAmJiAhTnVtYmVyLmlzTmFOKG5ld1RvcCkgJiYgdGhpcy5wYWdlLnByZXZpb3VzVG9wICE9PSBuZXdUb3ApIHtcblx0XHRcdFx0dGhpcy5wYWdlLnByZXZpb3VzVG9wID0gbmV3VG9wO1xuXHRcdFx0XHQvLyB0aGlzLnBhZ2Uuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB0b3A6ICR7LW5ld1RvcH1weDtgKTtcblx0XHRcdFx0dGhpcy5wYWdlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7LW5ld1RvcH1weCk7YCk7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdFR3ZWVuTWF4LnNldCh0aGlzLnBhZ2UsIHtcblx0XHRcdFx0XHR5OiAtbmV3VG9wLFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ki9cblx0XHRcdFx0RG9tLnNjcm9sbGluZyA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHREb20uc2Nyb2xsaW5nID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0aGlzLmJvZHkuaGFzQXR0cmlidXRlKCdzdHlsZScpKSB7XG5cdFx0XHR0aGlzLmJvZHkucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXHRcdFx0dGhpcy5wYWdlLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblx0XHR9XG5cblx0XHRpZiAoc2hhZG93c0VuYWJsZWQgJiYgIURvbS5zY3JvbGxpbmcpIHtcblx0XHRcdC8vIHNoYWRvd3Ncblx0XHRcdHRoaXMuc2hhZG93cy5mb3JFYWNoKChub2RlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHh5ID0gbm9kZS54eSB8fCB7IHg6IDAsIHk6IDAgfTtcblx0XHRcdFx0Y29uc3QgZHggPSB0aGlzLm1vdXNlLnggLSB4eS54O1xuXHRcdFx0XHRjb25zdCBkeSA9IHRoaXMubW91c2UueSAtIHh5Lnk7XG5cdFx0XHRcdHh5LnggKz0gZHggLyA4O1xuXHRcdFx0XHR4eS55ICs9IGR5IC8gODtcblx0XHRcdFx0Y29uc3Qgc2hhZG93ID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hhZG93JykgfHwgOTA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gKDAuMiArIDAuMyAqIChNYXRoLmFicyh4eS54KSArIE1hdGguYWJzKHh5LnkpKSAvIDIpLnRvRml4ZWQoMyk7XG5cdFx0XHRcdGNvbnN0IHggPSAoeHkueCAqIC0xMDApLnRvRml4ZWQoMik7XG5cdFx0XHRcdGNvbnN0IHkgPSAoeHkueSAqIC01MCkudG9GaXhlZCgyKTtcblx0XHRcdFx0Y29uc3QgYm94U2hhZG93ID0gYCR7eH1weCAke3l9cHggJHtzaGFkb3d9cHggLTEwcHggcmdiYSgwLCAwLCAwLCAke2FscGhhfSlgO1xuXHRcdFx0XHQvLyBpZiAobm9kZS5ib3hTaGFkb3cgIT09IGJveFNoYWRvdykge1xuXHRcdFx0XHQvLyBcdG5vZGUuYm94U2hhZG93ID0gYm94U2hhZG93O1xuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgYm94LXNoYWRvdzogJHtib3hTaGFkb3d9YCk7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdFR3ZWVuTWF4LnNldChub2RlLCB7XG5cdFx0XHRcdFx0Ym94U2hhZG93OiBib3hTaGFkb3csXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQqL1xuXHRcdFx0XHQvLyB9XG5cdFx0XHRcdG5vZGUueHkgPSB4eTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIHN3aXBlcnNcblx0XHR0aGlzLnN3aXBlcnMuZm9yRWFjaCgoc3dpcGVyLCBpKSA9PiB7XG5cdFx0XHRpZiAoc3dpcGVyLnBhcmFtcy5hdXRvcGxheS5lbmFibGVkICYmICFzd2lwZXIucGFyYW1zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IG5vZGUgPSBzd2lwZXIuZWw7XG5cdFx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdFx0aWYgKGludGVyc2VjdGlvbi55ID4gMCkge1xuXHRcdFx0XHRcdGlmICghc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHtcblx0XHRcdFx0XHRcdHN3aXBlci5hdXRvcGxheS5zdGFydCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoc3dpcGVyLmF1dG9wbGF5LnJ1bm5pbmcpIHtcblx0XHRcdFx0XHRcdHN3aXBlci5hdXRvcGxheS5zdG9wKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyB2aWRlb3Ncblx0XHR0aGlzLnZpZGVvcy5mb3JFYWNoKCh2aWRlbywgaSkgPT4ge1xuXHRcdFx0Y29uc3Qgbm9kZSA9IHZpZGVvLm5vZGU7XG5cdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSByZWN0LmludGVyc2VjdGlvbih0aGlzLndpbmRvd1JlY3QpO1xuXHRcdFx0aWYgKGludGVyc2VjdGlvbi55ID4gMCAmJiBpbnRlcnNlY3Rpb24ueCA+IDApIHtcblx0XHRcdFx0dmlkZW8uYXBwZWFyKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2aWRlby5kaXNhcHBlYXIoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghRG9tLm1vYmlsZSkge1xuXG5cdFx0XHQvLyB0cmlhbmdsZXNcblx0XHRcdHRoaXMudHJpYW5nbGVzLmZvckVhY2goKHRyaWFuZ2xlLCBpKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG5vZGUgPSB0cmlhbmdsZS5ub2RlO1xuXHRcdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHJlY3QuaW50ZXJzZWN0aW9uKHRoaXMud2luZG93UmVjdCk7XG5cdFx0XHRcdGlmIChpbnRlcnNlY3Rpb24ueSA+IDApIHtcblx0XHRcdFx0XHR0cmlhbmdsZS5hcHBlYXIoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0cmlhbmdsZS5kaXNhcHBlYXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHBhcmFsbGF4XG5cdFx0XHQvKlxuXHRcdFx0dGhpcy5wYXJhbGxheGVzLmZvckVhY2goKG5vZGUsIGkpID0+IHtcblx0XHRcdFx0bGV0IGN1cnJlbnRZID0gbm9kZS5jdXJyZW50WSB8fCAwO1xuXHRcdFx0XHRsZXQgcmVjdCA9IFJlY3QuZnJvbU5vZGUobm9kZSk7XG5cdFx0XHRcdHJlY3QgPSBuZXcgUmVjdCh7XG5cdFx0XHRcdFx0dG9wOiByZWN0LnRvcCAtIGN1cnJlbnRZLFxuXHRcdFx0XHRcdGxlZnQ6IHJlY3QubGVmdCxcblx0XHRcdFx0XHR3aWR0aDogcmVjdC53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdFx0Y3VycmVudFkgPSBpbnRlcnNlY3Rpb24uY2VudGVyLnkgKiBwYXJzZUludChub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXJhbGxheCcpKTtcblx0XHRcdFx0aWYgKG5vZGUuY3VycmVudFkgIT09IGN1cnJlbnRZKSB7XG5cdFx0XHRcdFx0bm9kZS5jdXJyZW50WSA9IGN1cnJlbnRZO1xuXHRcdFx0XHRcdFR3ZWVuTWF4LnNldChub2RlLCB7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKCcgKyBjdXJyZW50WSArICdweCknLFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCovXG5cdFx0XHR0aGlzLnBhcmFsbGF4ZXMuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0XHRjb25zdCBwYXJhbGxheCA9IG5vZGUucGFyYWxsYXggfHwgKG5vZGUucGFyYWxsYXggPSBwYXJzZUludChub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXJhbGxheCcpKSB8fCA1KSAqIDI7XG5cdFx0XHRcdGNvbnN0IGRpcmVjdGlvbiA9IGkgJSAyID09PSAwID8gMSA6IC0xO1xuXHRcdFx0XHRsZXQgY3VycmVudFkgPSBub2RlLmN1cnJlbnRZIHx8IDA7XG5cdFx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdFx0cmVjdCA9IG5ldyBSZWN0KHtcblx0XHRcdFx0XHR0b3A6IHJlY3QudG9wLFxuXHRcdFx0XHRcdGxlZnQ6IHJlY3QubGVmdCxcblx0XHRcdFx0XHR3aWR0aDogcmVjdC53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdFx0aWYgKGludGVyc2VjdGlvbi55ID4gMCkge1xuXHRcdFx0XHRcdGNvbnN0IHkgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgtMSwgaW50ZXJzZWN0aW9uLmNlbnRlci55KSk7XG5cdFx0XHRcdFx0Y29uc3QgcyA9ICgxMDAgKyBwYXJhbGxheCAqIDIpIC8gMTAwO1xuXHRcdFx0XHRcdGN1cnJlbnRZID0gKC01MCArIHkgKiBwYXJhbGxheCAqIGRpcmVjdGlvbikudG9GaXhlZCgzKTtcblx0XHRcdFx0XHRpZiAobm9kZS5jdXJyZW50WSAhPT0gY3VycmVudFkpIHtcblx0XHRcdFx0XHRcdG5vZGUuY3VycmVudFkgPSBjdXJyZW50WTtcblx0XHRcdFx0XHRcdGlmIChub2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdiYWNrZ3JvdW5kJykpIHtcblx0XHRcdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHRvcDogNTAlOyBsZWZ0OiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKCR7Y3VycmVudFl9JSkgc2NhbGUzZCgke3N9LCR7c30sMS4wKTtgKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB0b3A6IDUwJTsgbGVmdDogNTAlOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgke2N1cnJlbnRZfSUpO2ApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGZvbGxvd2VyXG5cdFx0XHRpZiAodGhpcy5mb2xsb3dlci5lbmFibGVkKSB7XG5cdFx0XHRcdHRoaXMuZm9sbG93ZXIucmVuZGVyKCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBhcHBlYXJzXG5cdFx0Ly8gbGV0IGZpcnN0VmlzaWJsZUluZGV4ID0gMDtcblx0XHR0aGlzLmFwcGVhcnMuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0bGV0IHJlY3QgPSBSZWN0LmZyb21Ob2RlKG5vZGUpO1xuXHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uID0gcmVjdC5pbnRlcnNlY3Rpb24odGhpcy53aW5kb3dSZWN0KTtcblx0XHRcdGlmIChpbnRlcnNlY3Rpb24ueSA+IDApIHtcblx0XHRcdFx0Ly8gXHRmaXJzdFZpc2libGVJbmRleCA9IGZpcnN0VmlzaWJsZUluZGV4IHx8IGk7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGxldCBvdmVybGFwID0gJy09MC4zJztcblx0XHRcdFx0aWYgKCF0aGlzLnRpbWVsaW5lLmlzQWN0aXZlKCkpIHtcblx0XHRcdFx0XHRvdmVybGFwID0gJys9MCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy50aW1lbGluZS50byhub2RlLCAwLjUsIHsgYXV0b0FscGhhOiAxIH0sIG92ZXJsYXApO1xuXHRcdFx0XHQqL1xuXHRcdFx0XHRpZiAoIW5vZGUudG8pIHtcblx0XHRcdFx0XHRub2RlLnRvID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoJ2FwcGVhcmVkJyk7XG5cdFx0XHRcdFx0fSwgMTUwICogbm9kZS5hcHBlYXJpbmdJbmRleCk7IC8vIChpIC0gZmlyc3RWaXNpYmxlSW5kZXgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhcHBlYXJlZCcpKSB7XG5cdFx0XHRcdFx0bm9kZS50byA9IG51bGw7XG5cdFx0XHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhcHBlYXJlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnN0aWNreXMuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuXHRcdFx0bGV0IHRvcCA9IHBhcnNlSW50KG5vZGUuZ2V0QXR0cmlidXRlKCdzdGlja3knKSkgfHwgMDtcblx0XHRcdGxldCByZWN0ID0gUmVjdC5mcm9tTm9kZShub2RlKTtcblx0XHRcdGNvbnN0IG1heHRvcCA9IG5vZGUub2Zmc2V0SGVpZ2h0IC0gbm9kZS5jb250ZW50Lm9mZnNldEhlaWdodDtcblx0XHRcdGlmIChyZWN0LmxlZnQgPiAzMCkge1xuXHRcdFx0XHR0b3AgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXh0b3AsIHRvcCAtIHJlY3QudG9wKSk7XG5cdFx0XHRcdG5vZGUuY29udGVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3RvcH1weCk7YCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlLmNvbnRlbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIGB0cmFuc2Zvcm06IG5vbmU7YCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxuXG5cdGxvb3AoKSB7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0XHRpZiAodGhpcy5wbGF5aW5nKSB7XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0dGhpcy5sb29wKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdHRoaXMucGxheWluZyA9IHRydWU7XG5cdFx0dGhpcy5sb29wKCk7XG5cdH1cblxuXHRwYXVzZSgpIHtcblx0XHR0aGlzLnBsYXlpbmcgPSBmYWxzZTtcblx0fVxuXG59XG5cbnZhciBhcHAgPSBuZXcgQXBwKCk7XG5cbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG5cdGFwcC5pbml0KCk7XG5cdGFwcC5wbGF5KCk7XG59O1xuIl0sImZpbGUiOiJkb2NzL2pzL2FwcC5qcyJ9
