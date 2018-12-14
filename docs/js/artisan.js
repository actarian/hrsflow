/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan', ['ng', 'ngRoute', 'ngMessages']);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.directive('modalView', ['$parse', '$templateRequest', '$compile', '$controller', 'Dom', function($parse, $templateRequest, $compile, $controller, Dom) {

		function compileController(scope, element, html, data) {
			element.html(html);
			var link = $compile(element.contents());
			if (data.controller) {
				var $scope = scope.$new();
				angular.extend($scope, data);
				var controller = $controller(data.controller, {
					$scope: $scope
				});
				if (data.controllerAs) {
					scope[data.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
				element.children().data('$ngControllerController', controller);
				scope = $scope;
			}
			link(scope);
		}

		return {
			restrict: 'A',
			priority: -400,
			link: function(scope, element, attributes, model) {
				var modal = $parse(attributes.modalView);
				modal = modal(scope);
				modal.templateUrl = modal.templateUrl || 'artisan/components/modals/partial/modal';
				$templateRequest(modal.templateUrl).then(function(html) {
					compileController(scope, element, html, modal);
				});
			}
		};
    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.provider('$modal', [function $modalProvider() {

		var modals = [];
		var routes = {};

		this.modals = modals;
		this.routes = routes;
		this.when = when;

		function when(path, modal) {
			routes[path] = modal;
			return this;
		}

		var tp;

		this.$get = ['$q', '$timeout', function modalFactory($q, $timeout) {

			function popModal(modal) {
				// console.log('modalProvider.popModal', modal);
				var index = -1;
				angular.forEach(modals, function(m, i) {
					if (m === modal) {
						index = i;
					}
				});
				if (index !== -1) {
					if (tp) {
						$timeout.cancel(tp);
					}
					tp = $timeout(function() {
						modal.active = false;
						modals.splice(index, 1);
						if (modals.length) {
							modals[modals.length - 1].active = true;
						}
					}, 0);
				}
			}

			function closeModal(modal) {
				// console.log('modalProvider.closeModal', modal);
				var index = -1;
				angular.forEach(modals, function(m, i) {
					if (m === modal) {
						index = i;
					}
				});
				if (index !== -1) {
					modal.active = false;
					if (tp) {
						$timeout.cancel(tp);
					}
					tp = $timeout(function() {
						while (modals.length) {
							modals.splice(modals.length - 1, 1);
						}
					}, 0);
				}
			}

			function addModal(path, params) {
				// console.log('modalProvider.addModal', path, params);
				var deferred = $q.defer();
				params = params || null;
				var modal = {
					title: 'Untitled',
					controller: null,
					templateUrl: null,
					params: params,
				};
				var current = routes[path];
				if (current) {
					angular.extend(modal, current);
				}
				modal.deferred = deferred;
				modal.back = function(data) {
					popModal(this);
					modal.deferred.resolve(data, modal);
				};
				modal.resolve = function(data) {
					closeModal(this);
					modal.deferred.resolve(data, modal);
				};
				modal.reject = function() {
					closeModal(this);
					modal.deferred.reject(modal);
				};
				angular.forEach(modals, function(m, i) {
					m.active = false;
				});
				if (modals.length) {
					modals.push(modal);
					modal.active = true;
				} else {
					modals.push(modal);
					if (tp) {
						$timeout.cancel(tp);
					}
					tp = $timeout(function() {
						modal.active = true;
					}, 50);
				}
				return deferred.promise;
			}

			return {
				modals: modals,
				addModal: addModal,
			};
        }];

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.directive('nav', ['$parse', 'Nav', function($parse, Nav) {

		var directive = {
			restrict: 'A',
			templateUrl: function(element, attributes) {
				return attributes.template || 'artisan/components/nav/partial/nav';
			},
			scope: {
				items: '=nav',
			},
			link: NavLink,
		};

		return directive;

		function NavLink(scope, element, attributes, model) {
			scope.$watch('items', function(value) {
				// console.log(value instanceof Nav, value);
				if (value) {
					if (angular.isArray(value)) {
						var onPath = $parse(attributes.onPath)(scope.$parent);
						var onNav = $parse(attributes.onNav)(scope.$parent);
						var nav = new Nav({
							onPath: onPath,
							onNav: onNav
						});
						nav.setItems(value);
						scope.item = nav;

					} else if (value instanceof Nav) {
						scope.item = value;
					}
				}
			});
		}

    }]);

	app.directive('navItem', ['$timeout', 'Events', function($timeout, Events) {

		var directive = {
			restrict: 'A',
			templateUrl: function(element, attributes) {
				return attributes.template || 'artisan/components/nav/partial/nav-item';
			},
			scope: {
				item: '=navItem',
			},
			link: NavItemLink,
		};

		return directive;

		function NavItemLink(scope, element, attributes, model) {
			var navItem = angular.element(element[0].querySelector('.nav-link'));

			var output;

			function itemOpen(item, immediate) {
				var state = item.$nav.state;
				state.active = true;
				$timeout(function() {
					state.immediate = immediate;
					state.closed = state.closing = false;
					state.opening = true;
					$timeout(function() {
						state.opening = false;
						state.opened = true;
					});
				});
			}

			function itemClose(item, immediate) {
				var state = item.$nav.state;
				state.active = false;
				$timeout(function() {
					state.immediate = immediate;
					state.opened = state.opening = false;
					state.closing = true;
					$timeout(function() {
						state.closing = false;
						state.closed = true;
					});
				});
				if (item.items) {
					angular.forEach(item.items, function(o) {
						itemClose(o, true);
					});
				}
			}

			function itemToggle(item) {
				// console.log('itemToggle', item);
				var state = item.$nav.state;
				state.active = item.items ? !state.active : true;
				if (state.active) {
					if (item.$nav.parent) {
						angular.forEach(item.$nav.parent.items, function(o) {
							if (o !== item) {
								itemClose(o, true);
							}
						});
					}
					itemOpen(item);
				} else {
					itemClose(item);
				}
				// console.log(state);
			}

			function onDown(e) {
				var item = scope.item;
				// console.log('Item.onDown', item);
				var state = item.$nav.state;
				if (state.active) {
					output = false;
					trigger();
				} else if (item.$nav.onNav) {
					var promise = item.$nav.onNav(item, item.$nav);
					if (promise && typeof promise.then === 'function') {
						promise.then(function(resolved) {
							// go on
							trigger();
						}, function(rejected) {
							// do nothing
						});
						output = false;
					} else {
						output = promise;
						trigger();
					}
				}

				function trigger() {
					$timeout(function() {
						itemToggle(item);
					});
				}
				// preventDefault(e);
			}

			function onClick(e) {
				// console.log('Item.onClick', e);
				return preventDefault(e);
			}

			function preventDefault(e) {
				if (output === false) {
					// console.log('Item.preventDefault', e);
					e.stop();
					// e.preventDefault();
					// e.stopPropagation();
					return false;
				}
			}
			var events = new Events(navItem).add({
				down: onDown,
				click: onClick,
			}, scope);
		}

    }]);

	app.directive('navTo', ['$parse', '$timeout', 'Events', function($parse, $timeout, Events) {

		var directive = {
			restrict: 'A',
			link: NavToLink
		};

		return directive;

		function NavToLink(scope, element, attributes) {
			function onDown(e) {
				console.log('navTo.onDown', attributes.navTo);
				$timeout(function() {
					var callback = $parse(attributes.navTo);
					callback(scope);
				});
				e.preventDefault();
				return false;
			}
			var events = new Events(element).add({
				down: onDown,
			}, scope);
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Nav', ['Silent', function(Silent) {

		function Nav(options) {
			var nav = this;
			var defaults = {
				items: [],
			}
			angular.extend(nav, defaults);
			if (options) {
				angular.extend(nav, options);
			}
			nav.setNav(nav, null);
		}

		var statics = {
			silent: NavSilent,
			path: NavPath,
		};

		var publics = {
			addItem: addItem,
			addItems: addItems,
			getPath: getPath,
			setItems: setItems,
			setNav: setNav,
			setNavs: setNavs,
		};

		angular.extend(Nav, statics);
		angular.extend(Nav.prototype, publics);

		return Nav;

		// static methods

		function NavSilent(path) {
			Silent.silent(path);
		}

		function NavPath(path) {
			Silent.path(path);
		}

		// prototype methods

		function setItems(items) {
			var nav = this;
			nav.path = Silent.path();
			nav.items = items;
			nav.setNavs(items, nav);
		}

		function setNavs(items, parent) {
			var nav = this;
			if (items) {
				angular.forEach(items, function(item) {
					nav.setNav(item, parent);
					nav.setNavs(item.items, item);
				});
			}
		}

		function setNav(item, parent) {
			var nav = this;
			var $nav = {
				parent: parent || null,
				level: parent ? parent.$nav.level + 1 : 0,
				state: {},
				addItems: function(x) {
					nav.addItems(x, item);
				},
				onNav: nav.onNav,
			};
			item.$nav = $nav;
			$nav.path = nav.getPath(item);
			if ($nav.path === nav.path) {
				$nav.state.active = true;
				$nav.state.opened = true;
				while ($nav.parent) {
					$nav = $nav.parent.$nav;
					$nav.state.active = true;
					$nav.state.opened = true;
				}
			}
		}

		function addItems(itemOrItems, parent) {
			var nav = this;
			if (angular.isArray(itemOrItems)) {
				angular.forEach(itemOrItems, function(item) {
					nav.addItem(item, parent);
				});
			} else {
				nav.addItem(itemOrItems, parent);
			}
		}

		function addItem(item, parent) {
			var nav = this,
				onPath = nav.onPath,
				onNav = nav.onNav;
			nav.setNav(item, parent);
			if (parent) {
				parent.items = parent.items || [];
				parent.items.push(item);
			}
		}

		function getPath(item) {
			var path = null;
			if (this.onPath) {
				path = this.onPath(item, item.$nav);
			} else {
				path = item.path;
			}
			return path;
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Animate', [function() {

		function Animate(callback) {
			this.callback = callback;
			this.key = null;
			this.ticks = 0;
		}

		var statics = {};

		var publics = {
			pause: pause,
			play: play,
			toggle: toggle,
		};

		angular.extend(Animate, statics);
		angular.extend(Animate.prototype, publics);

		return Animate;

		// static methods

		// prototype methods

		function pause() {
			var animate = this;
			if (animate.key) {
				window.cancelAnimationFrame(animate.key);
				animate.key = null;
			}
		}

		function play() {
			var animate = this;

			function loop(time) {
				animate.ticks++;
				animate.callback(time, animate.ticks);
				animate.key = window.requestAnimationFrame(loop);
			}
			if (!animate.key) {
				loop();
			}
		}

		function toggle() {
			var animate = this;
			if (animate.key) {
				animate.pause();
			} else {
				animate.play();
			}
		}

    }]);

	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
				window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}());

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('DateTime', [function() {

		var service = this;

		var SECOND = 1000;
		var MINUTE = 60 * SECOND;
		var QUARTER = 15 * MINUTE;
		var HOUR = 60 * MINUTE;
		var DAY = 24 * HOUR;
		var WEEK = 7 * DAY;
		var FIRSTDAYOFWEEK = 1;

		var today = getFullDate();

		var statics = {
			getIndexLeft: getIndexLeft,
			getIndexRight: getIndexRight,
			//
			getDayLeft: getDayLeft,
			getDayRight: getDayRight,
			//
			getMonthLeft: getMonthLeft,
			getMonthRight: getMonthRight,
			//
			getWeekLeft: getWeekLeft,
			getWeekRight: getWeekRight,
			//
			getYearLeft: getYearLeft,
			getYearRight: getYearRight,
			//
			dateToKey: dateToKey,
			//
			dayDiff: dayDiff,
			dayLeft: dayLeft,
			dayRight: dayRight,
			//
			getDate: getDate,
			getFullDate: getFullDate,
			getDay: getDay,
			getFullDay: getFullDay,
			getWeek: getWeek,
			getDayByKey: getDayByKey,
			getDayByDate: getDayByDate,
			hourToTime: hourToTime,
			keyToDate: keyToDate,
			//
			monthDiff: monthDiff,
			monthLeft: monthLeft,
			monthRight: monthRight,
			//
			today: today,
			//
			weekDiff: weekDiff,
			weekLeft: weekLeft,
			weekRight: weekRight,
			//
			yearDiff: yearDiff,
			yearLeft: yearLeft,
			yearRight: yearRight,
			// conversion
			timeToHour: timeToHour,
			timeToQuarterHour: timeToQuarterHour,
			// units
			SECOND: SECOND,
			MINUTE: MINUTE,
			QUARTER: QUARTER,
			HOUR: HOUR,
			DAY: DAY,
			WEEK: WEEK,
			FIRSTDAYOFWEEK: FIRSTDAYOFWEEK,
		};

		angular.extend(service, statics);

		function datetime(date) {
			date = date ? new Date(date) : new Date();
			return date;
		}

		function components(date) {
			date = datetime(date);
			// console.log($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK);
			return {
				date: date,
				yyyy: date.getFullYear(),
				MM: date.getMonth(),
				dd: date.getDate(),
				// ee: (date.getDay() + $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK) % 7,
				ee: date.getDay(),
				HH: date.getHours(),
				mm: date.getMinutes(),
				ss: date.getSeconds(),
				sss: date.getMilliseconds(),
			};
		}

		function dateToKey(date) {
			date = dayLeft(datetime(date));
			var offset = date.getTimezoneOffset();
			return Math.floor((date.valueOf() - offset * MINUTE) / DAY);
		}

		function dayDiff(diff, date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd + diff, c.HH, c.mm, c.ss, c.sss);
		}

		function dayLeft(date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd, 0, 0, 0, 0);
		}

		function dayRight(date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd, 23, 59, 59, 999);
		}

		function getDate(date) {
			date = dayLeft(date);
			return getDayByDate(date);
		}

		function getFullDate(date) {
			return getFullDay(getDate(date));
		}

		function getDay(date, key) {
			return {
				date: date,
				key: key,
			};
		}

		function getDayByKey(key) {
			return getDay(keyToDate(key), key);
		}

		function getDayByDate(date) {
			return getDay(date, dateToKey(date));
		}

		function getFullDay(day) {
			var c = components(day.date);
			c.key = day.key;
			c.wKey = dateToKey(weekLeft(day.date));
			c.mKey = dateToKey(monthLeft(day.date));
			c.ww = getWeek(day.date, FIRSTDAYOFWEEK);
			return c;
		}

		function hourToTime(hour) {
			return hour * HOUR;
		}

		function keyToDate(key) {
			var date = new Date();
			var offset = date.getTimezoneOffset();
			return new Date(date.setTime(key * DAY + offset * MINUTE));
		}

		function monthDiff(diff, date, step) {
			step = step || 1;
			var c = components(date);
			var MM = Math.floor(c.MM / step) * step + diff * step;
			return new Date(c.yyyy, MM, 1, c.HH, c.mm, c.ss, c.sss);
		}

		function monthLeft(date, step) {
			step = step || 1;
			var c = components(date);
			var MM = Math.floor(c.MM / step) * step;
			return new Date(c.yyyy, MM, 1, 0, 0, 0, 0);
		}

		function monthRight(date, step) {
			step = step || 1;
			var c = components(date);
			var MM = Math.floor(c.MM / step) * step;
			return new Date(c.yyyy, MM + step, 0, 23, 59, 59, 999);
		}

		function timeToHour(time) {
			return time / HOUR;
		}

		function timeToQuarterHour(time) {
			return Math.floor(time / QUARTER) * QUARTER / HOUR;
		}

		function weekDiff(diff, date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd + diff * 7, c.HH, c.mm, c.ss, c.sss);
		}

		function weekLeft(date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd - c.ee + FIRSTDAYOFWEEK, 0, 0, 0, 0);
		}

		function weekRight(date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM, c.dd - c.ee + FIRSTDAYOFWEEK + 6, 23, 59, 59, 999);
		}

		function yearDiff(diff, date) {
			var c = components(date);
			return new Date(c.yyyy, c.MM + diff * 12, c.dd, c.HH, c.mm, c.ss, c.sss);
		}

		function yearLeft(date) {
			var c = components(date);
			return new Date(c.yyyy, 0, 1, 0, 0, 0, 0);
		}

		function yearRight(date) {
			var c = components(date);
			return new Date(c.yyyy, 12, 0, 23, 59, 59, 999);
		}

		function getIndexLeft(diff, size, step) {
			diff = diff || 0;
			size = size || 1;
			step = step || 1;
			var index = diff * step;
			return index;
		}

		function getIndexRight(diff, size, step) {
			size = size || 1;
			step = step || 1;
			var index = getIndexLeft(diff, size, step);
			index += (size * step) - 1;
			return index;
		}

		function getYearLeft(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var yyyy = Math.floor(c.yyyy / step) * step;
			yyyy += getIndexLeft(diff, size, step);
			date = new Date(yyyy, c.MM, c.dd, c.HH, c.mm, c.ss, c.sss);
			return yearLeft(date);
		}

		function getYearRight(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var yyyy = Math.floor(c.yyyy / step) * step;
			yyyy += getIndexRight(diff, size, step);
			date = new Date(yyyy, c.MM, c.dd, c.HH, c.mm, c.ss, c.sss);
			return yearRight(date);
		}

		function getMonthLeft(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var MM = Math.floor(c.MM / step) * step;
			MM += getIndexLeft(diff, size, step);
			date = new Date(c.yyyy, MM, c.dd, c.HH, c.mm, c.ss, c.sss);
			return monthLeft(date);
		}

		function getMonthRight(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var MM = Math.floor(c.MM / step) * step;
			MM += getIndexRight(diff, size, step);
			date = new Date(c.yyyy, MM, c.dd, c.HH, c.mm, c.ss, c.sss);
			return monthRight(date);
		}

		function getWeekLeft(date, diff, size, step) {
			var c = components(date);
			var dd = c.dd + getIndexLeft(diff, size, step) * 7;
			date = new Date(c.yyyy, c.MM, dd, c.HH, c.mm, c.ss, c.sss);
			return weekLeft(date);
		}

		function getWeekRight(date, diff, size, step) {
			var c = components(date);
			var dd = c.dd + getIndexRight(diff, size, step) * 7;
			date = new Date(c.yyyy, c.MM, dd, c.HH, c.mm, c.ss, c.sss);
			return weekRight(date);
		}

		function getDayLeft(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var dd = Math.floor(c.dd / step) * step;
			dd += getIndexLeft(diff, size, step);
			date = new Date(c.yyyy, c.MM, dd, c.HH, c.mm, c.ss, c.sss);
			return dayLeft(date);
		}

		function getDayRight(date, diff, size, step) {
			step = step || 1;
			var c = components(date);
			var dd = Math.floor(c.dd / step) * step;
			dd += getIndexRight(diff, size, step);
			date = new Date(c.yyyy, c.MM, dd, c.HH, c.mm, c.ss, c.sss);
			return dayRight(date);
		}

		function getWeekDay(date, offsetDays) {
			offsetDays = offsetDays || 0; // default offsetDays to zero
			var ee = date.getDay();
			ee -= offsetDays;
			if (ee < 0) {
				ee += 7;
			}
			return ee;
		}

		function getWeek(date, offsetDays) {
			var startingDayOfWeek = 4; // first week of year with thursday;
			var now = getDayByDate(date);
			var first = getDayByDate(getYearLeft(date)); // diff, size, step
			var ee = getWeekDay(first.date, offsetDays);
			var num = now.key - first.key;
			var week = Math.floor((num + ee) / 7);
			if (ee < startingDayOfWeek) {
				week++;
				if (week > 52) {
					// next year
					ee = getWeekDay(getYearLeft(date, 1), offsetDays);
					// if the next year starts before the middle of the week, it is week #1 of that year
					week = ee < startingDayOfWeek ? 1 : 53;
				}
			}
			return week;
		}

    }]);

	app.filter('isoWeek', ['DateTime', function(DateTime) {
		return function(value, offsetDays) {
			if (value) {
				var week = DateTime.getWeek(value, offsetDays);
				return week < 10 ? '0' + week : week; // padded
			} else {
				return '-';
			}
		};
    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	var it_IT = {
		long: {
			RANGE: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			YEAR: 'Anno {from|date:yyyy}',
			SEMESTER: 'Semestre {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			TRIMESTER: 'Quadrimestre {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			QUARTER: 'Trimestre {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			MONTH: '{from|date:MMMM yyyy}',
			WEEK: 'Settimana {to|isoWeek:1}',
			DAY: '{from|date:EEEE dd MMM yyyy}',
		},
		short: {
			RANGE: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			YEAR: '{from|date:yyyy}',
			SEMESTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			TRIMESTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			QUARTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			MONTH: '{from|date:MMMM}',
			WEEK: 'W{to|isoWeek:1}',
			DAY: '{from|date:EEEE}',
		},
		week: 1,
	};

	var en_US = {
		long: {
			RANGE: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			YEAR: 'Year {from|date:yyyy}',
			SEMESTER: 'Semester {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			TRIMESTER: 'Trimester {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			QUARTER: 'Quarter {from|date:MMM yyyy} - {to|date:MMM yyyy}',
			MONTH: '{from|date:MMMM yyyy}',
			WEEK: 'Week {from|isoWeek:0}',
			DAY: '{from|date:EEEE MM/dd/yyyy}',
		},
		short: {
			RANGE: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			YEAR: '{from|date:yyyy}',
			SEMESTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			TRIMESTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			QUARTER: '{from|date:MMM yyyy} - {to|date:MMM yyyy}',
			MONTH: '{from|date:MMMM}',
			WEEK: 'W{from|isoWeek:0}',
			DAY: '{from|date:EEEE}',
		},
		week: 0,
	};

	var formats = it_IT;

	app.constant('RangeTypes', {
		RANGE: 10,
		YEAR: 11,
		SEMESTER: 12,
		TRIMESTER: 13,
		QUARTER: 14,
		MONTH: 15,
		WEEK: 16,
		DAY: 17,
	});

	app.factory('Range', ['$filter', 'DateTime', 'RangeTypes', function($filter, DateTime, RangeTypes) {

		function Range(options) {
			var range = this;
			range.from = DateTime.dayLeft();
			range.type = RangeTypes.QUARTER;
			if (options) {
				angular.extend(range, options);
			}
			range.setDiff();
		}

		var publics = {
			setYear: setYear,
			setSemester: setSemester,
			setTrimester: setTrimester,
			setQuarter: setQuarter,
			setMonth: setMonth,
			setWeek: setWeek,
			setDay: setDay,
			setKey: setKey,

			prev: prev,
			next: next,

			getDiff: getDiff,
			getParams: getParams,
			getDate: getDate,
			setDate: setDate,
			setDiff: setDiff,

			set: set,
			is: is,
			isInside: isInside,
			isOutside: isOutside,
			isCurrent: isCurrent,
			isBefore: isBefore,
			isAfter: isAfter,
			equals: equals,

			eachDay: eachDay,
			totalDays: totalDays,

			getName: getName,
			getShortName: getShortName,
			toString: toString,
		};

		var statics = {
			//
			copy: RangeCopy,
			expand: RangeExpand,
			getMonth: RangeGetMonth,
			addYear: RangeAddYear,
			types: RangeTypes,
			//
			Year: RangeYear,
			Semester: RangeSemester,
			Trimester: RangeTrimester,
			Quarter: RangeQuarter,
			Month: RangeMonth,
			Week: RangeWeek,
			Day: RangeDay,
			//
			getDate: DateTime.getDate,
			getFullDate: DateTime.getFullDate,
			dateToKey: DateTime.dateToKey,
			keyToDate: DateTime.keyToDate,
			getDay: DateTime.getDay,
			getFullDay: DateTime.getFullDay,
			getDayByKey: DateTime.getDayByKey,
			getDayByDate: DateTime.getDayByDate,
			today: DateTime.today,
			DateTime: DateTime,
		};

		angular.extend(Range.prototype, publics);
		angular.extend(Range, statics);

		return Range;

		// public methods
		function isInside(date) {
			var range = this;
			return !range.isOutside(date);
		}

		function isOutside(date) {
			date = date || new Date();
			var range = this;
			var outside = date < range.from || date > range.to;
			// console.log('isOutside', date, range.from, range.to);
			return outside;
		}

		function isCurrent(date) {
			date = date || new Date();
			var range = this;
			return !range.isOutside(date);
		}

		function isBefore(date) {
			date = date || new Date();
			var range = this;
			var before = range.to < date;
			// console.log('isBefore', before, range.to, date);
			return before;
		}

		function isAfter(date) {
			date = date || new Date();
			var range = this;
			var after = range.from > date;
			// console.log('isAfter', after);
			return after;
		}

		function setDate(date, diff) {
			var range = this;
			switch (range.type) {
				case RangeTypes.YEAR:
					range.setYear(date, diff);
					break;
				case RangeTypes.SEMESTER:
					range.setSemester(date, diff);
					break;
				case RangeTypes.TRIMESTER:
					range.setTrimester(date, diff);
					break;
				case RangeTypes.QUARTER:
					range.setQuarter(date, diff);
					break;
				case RangeTypes.MONTH:
					range.setMonth(date, diff);
					break;
				case RangeTypes.WEEK:
					range.setWeek(date, diff);
					break;
				case RangeTypes.DAY:
					range.setDay(date, diff);
					break;
			}
			return range;
		}

		function getDate(diff) {
			diff = diff || 0;
			var range = this;
			var date = new Date(range.from);
			switch (range.type) {
				case RangeTypes.YEAR:
					date = new Date(date.setFullYear(date.getFullYear() + diff));
					break;
				case RangeTypes.SEMESTER:
					date = new Date(date.setMonth(date.getMonth() + diff * 6));
					break;
				case RangeTypes.TRIMESTER:
					date = new Date(date.setMonth(date.getMonth() + diff * 4));
					break;
				case RangeTypes.QUARTER:
					date = new Date(date.setMonth(date.getMonth() + diff * 3));
					break;
				case RangeTypes.MONTH:
					date = new Date(date.setMonth(date.getMonth() + diff));
					break;
				case RangeTypes.WEEK:
					date = new Date(date.setDate(date.getDate() + diff * 7));
					break;
				case RangeTypes.DAY:
					date = new Date(date.setDate(date.getDate() + diff));
					break;
			}
			return date;
		}

		function getDiff(diff) {
			var range = this;
			return new Range({
				type: range.type,
			}).setDate(range.from).setDiff(diff);
		}

		function getParams() {
			return {
				dateFrom: new Date(this.from),
				dateTo: new Date(this.to),
			};
		}

		function setYear(date, diff, size, step) {
			var range = this;
			range.from = DateTime.getYearLeft(date, diff, size, step);
			range.to = DateTime.getYearRight(date, diff, size, step);
			return range;
		}

		function setSemester(date, diff, size) {
			return this.setMonth(date, diff, size, 6);
		}

		function setTrimester(date, diff, size) {
			return this.setMonth(date, diff, size, 4);
		}

		function setQuarter(date, diff, size) {
			return this.setMonth(date, diff, size, 3);
		}

		function setMonth(date, diff, size, step) {
			var range = this;
			range.from = DateTime.getMonthLeft(date, diff, size, step);
			range.to = DateTime.getMonthRight(date, diff, size, step);
			return range;
		}

		function setWeek(date, diff, size, step) {
			var range = this;
			range.from = DateTime.getWeekLeft(date, diff, size, step);
			range.to = DateTime.getWeekRight(date, diff, size, step);
			return range;
		}

		function setDay(date, diff, size, step) {
			var range = this;
			range.from = DateTime.getDayLeft(date, diff, size, step);
			range.to = DateTime.getDayRight(date, diff, size, step);
			return range;
		}

		function setKey(key, diff, size, step) {
			return this.setDay(DateTime.keyToDate(key), diff, size, step);
		}

		function prev() {
			return this.setDiff(-1);
		}

		function next() {
			return this.setDiff(1);
		}

		function setDiff(diff) {
			var range = this;
			switch (range.type) {
				case RangeTypes.YEAR:
					range.setYear(range.from, diff);
					break;
				case RangeTypes.SEMESTER:
					range.setSemester(range.from, diff);
					break;
				case RangeTypes.TRIMESTER:
					range.setTrimester(range.from, diff);
					break;
				case RangeTypes.QUARTER:
					range.setQuarter(range.from, diff);
					break;
				case RangeTypes.MONTH:
					range.setMonth(range.from, diff);
					break;
				case RangeTypes.WEEK:
					range.setWeek(range.from, diff);
					break;
				case RangeTypes.DAY:
					range.setDay(range.from, diff);
					break;
			}
			return range;
		}

		function set(filters, source) {
			var range = this;
			filters.dateFrom = range.from;
			filters.dateTo = range.to;
			if (source) {
				source.setDates(filters.dateFrom, filters.dateTo);
			}
			return range;
		}

		function is(filters) {
			var range = this,
				flag = false;
			if (filters.dateFrom && filters.dateTo) {
				flag = filters.dateFrom.getTime() == range.from.getTime() && filters.dateTo.getTime() == range.to.getTime();
			}
			return flag;
		}

		function equals(r) {
			var range = this;
			return r && DateTime.dateToKey(r.from) === DateTime.dateToKey(range.from) && DateTime.dateToKey(r.to) === DateTime.dateToKey(range.to);
		}

		function eachDay(callback) {
			var range = this;
			if (typeof callback !== 'function') {
				return range;
			}
			var fromKey = DateTime.dateToKey(range.from);
			var toKey = DateTime.dateToKey(range.to);
			while (fromKey <= toKey) {
				callback(DateTime.getDayByKey(fromKey, formats.week));
				fromKey++;
			}
			return range;
		}

		function totalDays() {
			var range = this;
			var fromKey = DateTime.dateToKey(range.from);
			var toKey = DateTime.dateToKey(range.to);
			return toKey - fromKey + 1;
		}

		function getName() {
			var range = this;
			var key = RangeExtract(RangeTypes, range.type);
			return RangeFormat(range, formats.long[key]);
		}

		function getShortName() {
			var range = this;
			var key = RangeExtract(RangeTypes, range.type);
			return RangeFormat(range, formats.short[key]);
		}

		function toString() {
			var range = this;
			return '[' +
				$filter('date')(range.from, 'MMM dd yyyy HH:mm:ss.sss') + ', ' +
				$filter('date')(range.to, 'MMM dd yyyy HH:mm:ss.sss') +
				'] \'' + range.getName() + '\'';
		}

		// static methods
		function RangeCopy($range) {
			var range = new Range($range);
			range.from = new Date($range.from);
			range.to = new Date($range.to);
			return range;
		}

		function RangeExpand(range, time) {
			range = RangeCopy(range);
			range.from = new Date(range.from.getTime() - time);
			range.to = new Date(range.to.getTime() + time);
			// console.log('RangeExpand', range.toString());
			return range;
		}

		function RangeGetMonth(date) {
			if (!date) {
				return null;
			}
			date = new Date(date);
			date.setDate(1);
			date.setHours(0, 0, 0, 0);
			return date.getTime();
		}

		function RangeAddYear(date, years) {
			if (!date) {
				return null;
			}
			date = new Date(date);
			return new Date(date.setFullYear(date.getFullYear() + years));
		}

		function RangeYear() {
			return new Range({
				type: RangeTypes.YEAR
			});
		}

		function RangeSemester() {
			return new Range({
				type: RangeTypes.SEMESTER
			});
		}

		function RangeTrimester() {
			return new Range({
				type: RangeTypes.TRIMESTER
			});
		}

		function RangeQuarter() {
			return new Range({
				type: RangeTypes.QUARTER
			});
		}

		function RangeMonth() {
			return new Range({
				type: RangeTypes.MONTH
			});
		}

		function RangeWeek() {
			return new Range({
				type: RangeTypes.WEEK
			});
		}

		function RangeDay() {
			return new Range({
				type: RangeTypes.DAY
			});
		}

		function RangeFormat(range, format) {
			var name = format;
			name = name.replace(/{(.*?)}/g, function(replaced, token) {
				var a = token.split('|');
				var p = a.shift();
				var f = a.join(''),
					j;
				if (f.indexOf(':') !== -1) {
					f = f.split(':');
					j = f.length ? f.pop() : null;
					f = f.join('');
				}
				// console.log(token, f, p, j);
				return f.length ? $filter(f)(range[p], j) : range[p];
			});
			// console.log(name);
			return name;
		}

		function RangeExtract(obj, value) {
			return Object.keys(obj)[Object.values(obj).indexOf(value)];
		}

    }]);

	(function() {
		// POLYFILL Object.values
		if (typeof Object.values !== 'function') {
			Object.defineProperty(Object, 'values', {
				value: function(obj) {
					var vals = [];
					for (var key in obj) {
						if (has(obj, key) && isEnumerable(obj, key)) {
							vals.push(obj[key]);
						}
					}
					return vals;
				}
			});
		}
	}());

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	/*
	app.value('now', null);
	*/

	app.value('$formats', {
		just_now: 'just now',
		seconds_ago: '{{num}} seconds ago',
		a_minute_ago: 'a minute ago',
		minutes_ago: '{{num}} minutes ago',
		an_hour_ago: 'an hour ago',
		hours_ago: '{{num}} hours ago',
		a_day_ago: 'yesterday',
		days_ago: '{{num}} days ago',
		a_week_ago: 'a week ago',
		weeks_ago: '{{num}} weeks ago',
		a_month_ago: 'a month ago',
		months_ago: '{{num}} months ago',
		a_year_ago: 'a year ago',
		years_ago: '{{num}} years ago',
		over_a_year_ago: 'over a year ago',
		seconds_from_now: '{{num}} seconds from now',
		a_minute_from_now: 'a minute from now',
		minutes_from_now: '{{num}} minutes from now',
		an_hour_from_now: 'an hour from now',
		hours_from_now: '{{num}} hours from now',
		a_day_from_now: 'tomorrow',
		days_from_now: '{{num}} days from now',
		a_week_from_now: 'a week from now',
		weeks_from_now: '{{num}} weeks from now',
		a_month_from_now: 'a month from now',
		months_from_now: '{{num}} months from now',
		a_year_from_now: 'a year from now',
		years_from_now: '{{num}} years from now',
		over_a_year_from_now: 'over a year from now'
	});

	app.filter('dateRelative', ['$rootScope', '$interval', '$injector', '$formats', function($rootScope, $interval, $injector, $formats) {

		var minute = 60;
		var hour = minute * 60;
		var day = hour * 24;
		var week = day * 7;
		var month = day * 30;
		var year = day * 365;

		var $format = getFormat();

		function getFormat() {
			if ($injector.has('$format')) {
				return $injector.get('$format');
			} else {
				return {
					instant: function(id, params) {
						return $formats[id].replace('{{num}}', params.num);
					}
				};
			}
		}

		function getDelta(now, date) {
			return Math.round(Math.abs(now - date) / 1000);
		}
		/*
        $interval(function () {
            $rootScope.$now = new Date();
            console.log($rootScope.$now);
        }, 3 * 1000);
		*/
		return function(date) {
			if (!(date instanceof Date)) {
				date = new Date(date);
			}

			// now = now || new Date();
			var now = new Date();

			var delta = getDelta(now, date);

			if (delta > day && delta < week) {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
				delta = getDelta(now, date);
			}

			var suffix = now >= date ? '_ago' : '_from_now';

			function format(key, num) {
				return $format.instant(key + (delta > 30 ? suffix : ''), {
					num: num
				});
			}

			console.log('delta', delta, now, date);

			if (delta < 30) {
				return format('just_now');

			} else if (delta < minute) {
				return format('seconds', delta);

			} else if (delta < 2 * minute) {
				return format('a_minute');

			} else if (delta < hour) {
				return format('minutes', Math.floor(delta / minute));

			} else if (delta < hour * 2) {
				return format('an_hour');

			} else if (delta < day) {
				return format('hours', Math.floor(delta / hour));

			} else if (delta < day * 2) {
				return format('a_day');

			} else if (delta < week) {
				return format('days', Math.floor(delta / day));

			} else if (Math.floor(delta / week) !== 1) {
				return format('a_week');

			} else if (delta < month) {
				return format('weeks', Math.floor(delta / week));

			} else if (Math.floor(delta / month) !== 1) {
				return format('a_month');

			} else if (delta < year) {
				return format('months', Math.floor(delta / month));

			} else if (Math.floor(delta / year) !== 1) {
				return format('a_year');

			} else {
				return format('over_a_year');

			}

		};
    }]);

	app.directive('dateRelative', ['$parse', '$filter', '$interval', function($parse, $filter, $interval) {
		return {
			priority: 1001,
			restrict: 'A',
			link: function(scope, element, attributes, model) {

				function setDate() {
					var date = $parse(attributes.dateRelative)(scope);
					var relative = $filter('dateRelative')(date);
					element[0].innerHTML = relative;
					// console.log('dateRelative.setDate', relative);
				}

				setDate();

				var i = setInterval(setDate, 60 * 1000);

				scope.$on('$destroy', function() {
					cancelInterval(i);
				});

			}
		};
	}]);

	// directive dateRelative -> apply filter every timeout

	/*
	myApp.config(function ($translateProvider) {
	    $translateProvider.translations('en', {
	        just_now: 'just now',
	        seconds_ago: '{{time}} seconds ago',
	    });

	    $translateProvider.translations('de', {
	        just_now: 'soeben',
	        seconds_ago: 'vor {{time}} stunden',
	    });

	    $translateProvider.preferredLanguage('en');
	});
	*/

}());

/*
// handle transition on resizing
var resizingTimeout;
$(window).on('resize', function () {
    clearTimeout(resizingTimeout);
    $('body').addClass('resizing');
    resizingTimeout = setTimeout(function () {
        $('body').removeClass('resizing');
    }, 100);
})
*/

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Dom', ['Point', 'Rect', function(Point, Rect) {

		var service = this;

		var statics = {
			getBoundRect: getBoundRect,
			getClosest: getClosest,
			getClosestNode: getClosestNode,
			getDelta: getDelta,
			getDocumentNode: getDocumentNode,
			getElement: getElement,
			getNode: getNode,
			getNodeOffset: getNodeOffset,
			getPageScroll: getPageScroll,
			getParents: getParents,
			getView: getView,
			getPointInView: getPointInView,
			compileController: compileController,
			downloadFile: downloadFile,
			ua: getUA(),
		};

		angular.extend(service, statics);

		// return node element BoundingClientRect
		function getBoundRect(node) {
			node = getNode(node);
			if (node === window) {
				node = getDocumentNode();
			}
			var rect = node.getBoundingClientRect();
			return rect;
		}

		// return closest parent node that match a selector
		function getClosest(node, selector) {
			var matchesFn, parent;
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
				if (typeof document.body[fn] == 'function') {
					matchesFn = fn;
					return true;
				}
				return false;
			});
			if (node[matchesFn](selector)) {
				return node;
			}
			while (node !== null) {
				parent = node.parentElement;
				if (parent !== null && parent[matchesFn](selector)) {
					return parent;
				}
				node = parent;
			}
			return null;
		}

		// return closest parent node that math a target node
		function getClosestNode(node, target) {
			var parent = null;
			if (node === target) {
				return node;
			}
			while (node !== null) {
				parent = node.parentElement;
				if (parent !== null && parent === target) {
					return parent;
				}
				node = parent;
			}
			return null;
		}

		// return wheel delta
		function getDelta(event) {
			var original = event.originalEvent ? event.originalEvent : event;
			var type = original.type;
			var delta = null;
			if (type === 'wheel' || type === 'mousewheel' || type === 'DOMMouseScroll') {
				var deltaX = original.deltaX || original.wheelDeltaX;
				var deltaY = original.deltaY || original.wheelDeltaY;
				delta = new Point(deltaX, deltaY);
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					delta.dir = deltaX < 0 ? 1 : -1;
				} else {
					delta.dir = deltaY < 0 ? 1 : -1;
				}
			}
			return delta;
		}

		// return document element node
		function getDocumentNode() {
			var documentNode = (document.documentElement || document.body.parentNode || document.body);
			return documentNode;
		}

		// return an angular element
		function getElement(element) {
			return angular.isArray(element) ? element : angular.element(element);
		}

		// return a native html node
		function getNode(element) {
			return angular.isArray(element) ? element[0] : element;
		}

		// return a node offset point
		function getNodeOffset(node) {
			var offset = new Point();
			node = getNode(node);
			if (node && node.nodeType === 1) {
				offset.x = node.offsetLeft;
				offset.y = node.offsetTop;
			}
			return offset;
		}

		// return the current page scroll
		function getPageScroll() {
			var scroll = new Point();
			var documentNode = getDocumentNode();
			scroll.x = window.pageXOffset || documentNode.scrollLeft;
			scroll.y = window.pageYOffset || documentNode.scrollTop;
			return scroll;
		}

		// return an array of node parants
		function getParents(node, topParentNode) {
			// if no topParentNode defined will bubble up all the way to *document*
			topParentNode = topParentNode || getDocumentNode();
			var parents = [];
			if (node) {
				parents.push(node);
				var parentNode = node.parentNode;
				while (parentNode && parentNode !== topParentNode) {
					parents.push(parentNode);
					parentNode = parentNode.parentNode;
				}
				parents.push(topParentNode); // push that topParentNode you wanted to stop at
			}
			parents.each = function(callback) {
				this.filter(function(node) {
					if (callback) {
						callback(angular.element(node), node);
					}
				});
			}
			return parents;
		}

		// return the view rect
		function getView() {
			var view = new Rect();
			if (window.innerWidth !== undefined) {
				view.width = window.innerWidth;
				view.height = window.innerHeight;
			} else {
				var documentNode = getDocumentNode();
				view.width = documentNode.clientWidth;
				view.height = documentNode.clientHeight;
			}
			return view;
		}

		// add to constant
		var MOUSE_EVENTS = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'contextmenu'];
		var TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

		function getPointInView(event) {
			var original = event.originalEvent ? event.originalEvent : event;
			var type = original.type;
			var point = null;
			if (TOUCH_EVENTS.indexOf(type) !== -1) {
				var touch = null;
				var touches = original.touches.length ? original.touches : original.changedTouches;
				if (touches && touches.length) {
					touch = touches[0];
				}
				if (touch) {
					point = new Point();
					point.x = touch.pageX;
					point.y = touch.pageY;
				}
			} else if (MOUSE_EVENTS.indexOf(type) !== -1) {
				point = new Point();
				point.x = original.pageX;
				point.y = original.pageY;
			}
			return point;
		}

		function getUA() {
			var agent = window.navigator.userAgent.toLowerCase();
			var safari = agent.indexOf('safari') !== -1 && agent.indexOf('chrome') === -1;
			var msie = agent.indexOf('trident') !== -1 || agent.indexOf('edge') !== -1 || agent.indexOf('msie') !== -1;
			var chrome = !safari && !msie && agent.indexOf('chrome') !== -1;
			var mobile = agent.indexOf('mobile') !== -1;
			var mac = agent.indexOf('macintosh') !== -1;
			var ua = {
				agent: agent,
				safari: safari,
				msie: msie,
				chrome: chrome,
				mobile: mobile,
				mac: mac,
			};
			angular.forEach(ua, function(value, key) {
				if (value) {
					angular.element(document.getElementsByTagName('body')).addClass(key);
				}
			});
			return ua;
		}

		/*
    function mobilecheck() {
        var check = false;
        (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    // For those wishing to include tablets in this test (though arguably, you shouldn't), you can use the following function:
    function mobileAndTabletcheck() {
        var check = false;
        (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isMobile = mobilecheck();
    var isMobileAndTabled = mobileAndTabletcheck();
		*/

		function compileController(scope, element, html, data) {
			// console.log('Dom.compileController', element);
			element = getElement(element);
			element.html(html);
			var link = $compile(element.contents());
			if (data.controller) {
				var $scope = scope.$new();
				angular.extend($scope, data);
				var controller = $controller(data.controller, {
					$scope: $scope
				});
				if (data.controllerAs) {
					scope[data.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
				element.children().data('$ngControllerController', controller);
				scope = $scope;
			}
			link(scope);
		}

		function downloadFile(content, name, type) {
			type = type || 'application/octet-stream';
			var base64 = null;
			var blob = new Blob([content], {
				type: type
			});
			var reader = new window.FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function() {
				base64 = reader.result;
				download();
			};

			function download() {
				if (document.createEvent) {
					var anchor = document.createElement('a');
					anchor.href = base64;
					if (anchor.download !== undefined) {
						var downloadName = name || base64.substring(base64.lastIndexOf('/') + 1, base64.length);
						anchor.download = downloadName;
					}
					var event = document.createEvent('MouseEvents');
					event.initEvent('click', true, true);
					anchor.dispatchEvent(event);
					return true;
				}
				var query = '?download';
				window.open(base64.indexOf('?') > -1 ? base64 : base64 + query, '_self');
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Event', ['EventsService', 'Dom', 'Point', 'Rect', function(EventsService, Dom, Point, Rect) {

		function Event(event, element) {
			try {
				event = event || window.event;
				var type = event.type;
				var originalEvent = event.originalEvent ? event.originalEvent : event;
				var node = element[0]; // Dom.getNode(element);
				var offset = Dom.getNodeOffset(node);
				var rect = Dom.getBoundRect(node);
				var view = Dom.getView();
				var scroll = Dom.getPageScroll();
				var point = Dom.getPointInView(event);
				if (point) {
					var absolute = new Point(point.x - scroll.x, point.y - scroll.y);
					var relative = new Point(absolute.x - rect.left, absolute.y - rect.top);
					this.point = point;
					this.absolute = absolute;
					this.relative = relative;
				}
				var delta = Dom.getDelta(event);
				if (delta) {
					this.delta = delta;
					this.dir = delta.dir;
				}
				this.event = event;
				this.type = type;
				this.originalEvent = originalEvent;
				this.element = element;
				this.node = node;
				this.offset = offset;
				this.rect = rect;
				this.view = view;
				this.scroll = scroll;
				this.timestamp = new Date().getTime();
			} catch (error) {
				console.log('Event.error', error);
			}
		}

		var statics = {};

		var publics = {
			stop: stop,
		};

		angular.extend(Event, statics);
		angular.extend(Event.prototype, publics);
		return Event;

		// prototype methods

		function stop() {
			this.event.stopPropagation();
			this.event.preventDefault();
		}

	}]);

	app.factory('Events', ['EventsService', 'Event', 'Dom', function(EventsService, Event, Dom) {

		function Events(element) {
			var events = this;

			this.element = Dom.getElement(element);
			this.listeners = {};
			this.standardEvents = {
				click: {
					key: 'click',
					callback: onClick
				},
				down: {
					key: 'mousedown',
					callback: onMouseDown
				},
				move: {
					key: 'mousemove',
					callback: onMouseMove
				},
				up: {
					key: 'mouseup',
					callback: onMouseUp
				},
				resize: {
					key: 'resize',
					callback: onResize
				},
			};
			this.touchEvents = {
				down: {
					key: 'touchstart',
					callback: onTouchStart
				},
				move: {
					key: 'touchmove',
					callback: onTouchMove
				},
				up: {
					key: 'touchend',
					callback: onTouchEnd
				},
			};
			this.wheelEvents = {
				wheel: {
					key: 'mousewheel',
					callback: onMouseWheel
				},
			};
			this.scrollEvents = {
				wheel: {
					key: 'DOMMouseScroll',
					callback: onMouseScroll
				},
			};
			this.timestamp = new Date().getTime();
			this.setTimestamp = setTimestamp;

			function setTimestamp(event) {
				if (event) {
					event.interval = Math.min(250, event.timestamp - events.timestamp);
					// console.log(event.interval, event.timestamp, events.timestamp);
				}
				events.timestamp = new Date().getTime();
			}

			function onClick(e) {
				// console.log('onClick', e, events);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.click.apply(this, [event]);
			}

			function onMouseDown(e) {
				// console.log('onMouseDown', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.down.apply(this, [event]);
				events.removeTouchEvents();
			}

			function onMouseMove(e) {
				// console.log('onMouseMove', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.move.apply(this, [event]);
			}

			function onMouseUp(e) {
				// console.log('onMouseUp', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.up.apply(this, [event]);
			}

			function onMouseWheel(e) {
				// console.log('onMouseWheel', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.wheel.apply(this, [event]);
				events.removeScrollEvents();
			}

			function onMouseScroll(e) {
				// console.log('onMouseScroll', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.wheel.apply(this, [event]);
				events.removeWheelEvents();
			}

			function onResize(e) {
				// console.log('onResize', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.resize.apply(this, [event]);
			}

			function onTouchStart(e) {
				// console.log('onTouchStart', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.down.apply(this, [event]);
				events.removeStandardEvents();
			}

			function onTouchMove(e) {
				// console.log('onTouchMove', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.move.apply(this, [event]);
			}

			function onTouchEnd(e) {
				// console.log('onTouchEnd', e);
				var event = new Event(e, events.element);
				events.setTimestamp(event);
				events.listeners.up.apply(this, [event]);
			}
		}

		var statics = {
			getTouch: getTouch,
			getRelativeTouch: getRelativeTouch,
		};

		var publics = {
			add: add,
			remove: remove,
			removeStandardEvents: removeStandardEvents,
			removeTouchEvents: removeTouchEvents,
			removeWheelEvents: removeWheelEvents,
			removeScrollEvents: removeScrollEvents,
		};

		angular.extend(Events, statics);
		angular.extend(Events.prototype, publics);
		return Events;

		// prototype methods

		function add(listeners, scope) {
			var events = this,
				standard = this.standardEvents,
				touch = this.touchEvents,
				wheel = this.wheelEvents,
				scroll = this.scrollEvents;
			var element = this.element,
				windowElement = angular.element(window);

			angular.forEach(listeners, function(callback, key) {
				if (events.listeners[key]) {
					var listener = {};
					listener[key] = events.listeners[key];
					remove(listener);
				}
				events.listeners[key] = callback;
				if (standard[key]) {
					if (key === 'resize') {
						windowElement.on(standard[key].key, standard[key].callback);
					} else {
						element.on(standard[key].key, standard[key].callback);
					}
				}
				if (touch[key]) {
					element.on(touch[key].key, touch[key].callback);
				}
				if (wheel[key]) {
					element.on(wheel[key].key, wheel[key].callback);
				}
				if (scroll[key]) {
					element.on(scroll[key].key, scroll[key].callback);
				}
			});

			if (scope) {
				scope.$on('$destroy', function() {
					events.remove(listeners);
				});
			}

			return events;
		}

		function remove(listeners) {
			var events = this,
				standard = this.standardEvents,
				touch = this.touchEvents,
				wheel = this.wheelEvents,
				scroll = this.scrollEvents;
			var element = this.element,
				windowElement = angular.element(window);
			angular.forEach(listeners, function(callback, key) {
				if (standard[key]) {
					if (key === 'resize') {
						windowElement.off(standard[key].key, standard[key].callback);
					} else {
						element.off(standard[key].key, standard[key].callback);
					}
				}
				if (touch[key]) {
					element.off(touch[key].key, touch[key].callback);
				}
				if (wheel[key]) {
					element.off(wheel[key].key, wheel[key].callback);
				}
				if (scroll[key]) {
					element.off(scroll[key].key, scroll[key].callback);
				}
				events.listeners[key] = null;
			});
			return events;
		}

		function removeStandardEvents() {
			var events = this,
				standard = events.standardEvents,
				touch = events.touchEvents;
			var element = events.element;
			element.off('mousedown', standard.down.callback);
			element.off('mousemove', standard.move.callback);
			element.off('mouseup', standard.up.callback);
		}

		function removeTouchEvents() {
			var events = this,
				standard = events.standardEvents,
				touch = events.touchEvents;
			var element = events.element;
			element.off('touchstart', touch.down.callback);
			element.off('touchmove', touch.move.callback);
			element.off('touchend', touch.up.callback);
		}

		function removeWheelEvents() {
			var events = this;
			var element = events.element;
			element.off('mousewheel', events.mouseEvents.wheel.callback);
		}

		function removeScrollEvents() {
			var events = this;
			var element = events.element;
			element.off('DOMMouseScroll', events.scrollEvents.wheel.callback);
		}

		// statics methods

		function getTouch(e, previous) {
			var point = new Point();
			if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
				var touch = null;
				var event = e.originalEvent ? e.originalEvent : e;
				var touches = event.touches.length ? event.touches : event.changedTouches;
				if (touches && touches.length) {
					touch = touches[0];
				}
				if (touch) {
					point.x = touch.pageX;
					point.y = touch.pageY;
				}
			} else if (e.type === 'click' || e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave' || e.type === 'contextmenu') {
				point.x = e.pageX;
				point.y = e.pageY;
			}
			if (previous) {
				point.s = Point.difference(t, previous);
			}
			point.type = e.type;
			return point;
		}

		function getRelativeTouch(node, point) {
			node = angular.isArray(node) ? node[0] : node;
			return Point.difference(point, {
				x: node.offsetLeft,
				y: node.offsetTop
			});
		}

    }]);

	app.service('EventsService', ['Dom', function(Dom) {

		var service = this;

		var statics = {
			hasPassiveEvents: hasPassiveEvents,
			addEventListener: getAddEventListener(),
		};

		angular.extend(service, statics);

		// prevent history back on mac os

		preventHistoryNavigation();

		// static methods

		function hasPassiveEvents() {
			var supported = false;
			if (window.addEventListener) {
				try {
					var options = Object.defineProperty({}, 'passive', {
						get: function() {
							supported = true;
						},
					});
					window.addEventListener('test', null, options);
				} catch (e) {
					console.log('getAddEventListener.isSupprted', e);
				}
			}
			return supported;
		}

		function getAddEventListener() {
			var supported = hasPassiveEvents();
			if (!supported) {
				return;
			}

			var defaults = {
				passive: false,
				capture: false,
			};

			function getModifiedAddEventListener(original) {
				function addEventListener(type, listener, options) {
					if (typeof options !== 'object') {
						var capture = options === true;
						options = angular.copy(defaults);
						options.capture = capture;
					} else {
						options = angular.extend(angular.copy(defaults), options);
					}
					original.call(this, type, listener, options);
				}
				return addEventListener;
			}

			var original = EventTarget.prototype.addEventListener;
			var modified = getModifiedAddEventListener(original);
			EventTarget.prototype.addEventListener = modified;
			return modified;
		}

		function preventHistoryNavigation() {
			if (!Dom.ua.mac) {
				return;
			}
			if (Dom.ua.chrome || Dom.ua.safari || Dom.ua.firefox) {
				window.addEventListener('mousewheel', onScroll, {
					passive: false
				});
			}

			function onScroll(e) {
				if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
					return;
				}
				if (
					(e.deltaX < 0 && (Dom.getParents(e.target).filter(function(node) {
						return node.scrollLeft > 0;
					}).length === 0)) ||
					(e.deltaX > 0 && (Dom.getParents(e.target).filter(function(node) {
						return node.scrollWidth - node.scrollLeft > node.clientWidth;
					}).length === 0))
				) {
					e.preventDefault();
				}
			}
		}

    }]);

}());

/* global angular, app, Autolinker */
(function() {

	"use strict";

	var app = angular.module('artisan');

	app.filter('notIn', ['$filter', function($filter) {
		return function(array, filters, element) {
			if (filters) {
				return $filter("filter")(array, function(item) {
					for (var i = 0; i < filters.length; i++) {
						if (filters[i][element] === item[element]) return false;
					}
					return true;
				});
			}
		};
    }]);

	app.filter('autolink', [function() {
		return function(value) {
			return Autolinker.link(value, {
				className: "a-link"
			});
		};
    }]);

	app.filter('shortName', ['$filter', function($filter) {
		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}
		return function(value) {
			if (!value) {
				return '';
			}
			if (value.indexOf(' .') === value.length - 2) {
				value = value.split(' .').join('');
			}
			/*
			var splitted;
			if (value.indexOf('.') !== -1) {
			    splitted = value.split('.');
			} else {
			    splitted = value.split(' ');
			}
			*/
			var splitted = value.split(' ');
			var firstName = splitted.shift();
			if (splitted.length) {
				var lastName = splitted.join(' ');
				return firstName.substr(0, 1).toUpperCase() + '.' + toTitleCase(lastName);
			} else {
				return firstName;
			}
		};
    }]);

	app.filter('customCurrency', ['$filter', function($filter) {
		var legacyFilter = $filter('currency');
		return function(cost, currency) {
			return legacyFilter(cost * currency.ratio, currency.formatting);
		};
    }]);

	app.filter('customSize', ['APP', function(APP) {
		return function(inches) {
			if (APP.unit === APP.units.IMPERIAL) {
				var feet = Math.floor(inches / 12);
				inches = inches % 12;
				inches = Math.round(inches * 10) / 10;
				return (feet ? feet + '\' ' : '') + (inches + '\'\'');
			} else {
				var meters = Math.floor(inches * APP.size.ratio);
				var cm = (inches * APP.size.ratio * 100) % 100;
				cm = Math.round(cm * 10) / 10;
				return (meters ? meters + 'm ' : '') + (cm + 'cm');
			}
		};
    }]);

	app.filter('customWeight', ['APP', function(APP) {
		return function(pounds) {
			if (APP.unit === APP.units.IMPERIAL) {
				if (pounds < 1) {
					var oz = pounds * 16;
					oz = Math.round(oz * 10) / 10;
					return (oz ? oz + 'oz ' : '');
				} else {
					pounds = Math.round(pounds * 100) / 100;
					return (pounds ? pounds + 'lb ' : '');
				}
			} else {
				var kg = Math.floor(pounds * APP.weight.ratio / 1000);
				var grams = (pounds * APP.weight.ratio) % 1000;
				grams = Math.round(grams * 10) / 10;
				return (kg ? kg + 'kg ' : '') + (grams + 'g');
			}
		};
    }]);

	app.filter('customNumber', ['$filter', function($filter) {
		return function(value, precision, unit) {
			unit = unit || '';
			// return ((value || value === 0) ? $filter('number')(value, precision) + unit : '-');
			if (value !== undefined) {
				if (Math.floor(value) === value) {
					precision = 0;
				}
				value = $filter('number')(value, precision) + unit;
			} else {
				value = '-';
			}
			return value;
		};
    }]);

	app.filter('reportNumber', ['$filter', function($filter) {
		return function(value, precision, unit) {
			unit = unit || '';
			if (value !== undefined) {
				value = $filter('number')(value, precision) + unit;
			} else {
				value = '-';
			}
			return value;
		};
    }]);

	app.filter('customHours', [function() {
		return function(value) {
			if (value !== undefined) {
				var hours = Math.floor(value);
				var minutes = Math.floor((value - hours) * 60);
				var label = hours ? hours + ' H' : '';
				label += minutes ? ' ' + minutes + ' m' : '';
				return label;
			} else {
				return '-';
			}
		};
    }]);

	app.filter('customTimer', [function() {
		var second = 1000;
		var minute = second * 60;
		var hour = minute * 60;
		return function(value) {
			if (value !== undefined) {
				var hours = Math.floor(value / hour);
				var minutes = Math.floor((value - hours * hour) / minute);
				var seconds = Math.floor((value - hours * hour - minutes * minute) / second);
				var label = hours ? hours + ' H' : '';
				label += minutes ? ' ' + minutes + ' m' : '';
				label += seconds ? ' ' + seconds + ' s' : '';
				return label;
			} else {
				return '-';
			}
		};
    }]);

	app.filter('customDigitalTimer', [function() {
		var second = 1000;
		var minute = second * 60;
		var hour = minute * 60;
		return function(value) {
			if (value !== undefined) {
				var hours = Math.floor(value / hour);
				var minutes = Math.floor((value - hours * hour) / minute);
				var seconds = Math.floor((value - hours * hour - minutes * minute) / second);
				// hours = hours % 24;
				return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
			} else {
				return '-';
			}
		};
    }]);

	app.filter('customDigitalTime', [function() {
		var second = 1000;
		var minute = second * 60;
		var hour = minute * 60;
		return function(value) {
			if (value !== undefined) {
				var hours = Math.floor(value / hour);
				var minutes = Math.floor((value - hours * hour) / minute);
				// hours = hours % 24;
				return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
			} else {
				return '-';
			}
		};
    }]);

	app.filter('customDate', ['$filter', function($filter) {
		var filter = $filter('date');
		return function(value, format, timezone) {
			return value ? filter(value, format, timezone) : '-';
		};
    }]);

	app.filter('customTime', ['$filter', function($filter) {
		return function(value, placeholder) {
			if (value) {
				return Utils.parseTime(value);
			} else {
				return (placeholder ? placeholder : '-');
			}
		};
    }]);

	app.filter('customDigital', ['$filter', function($filter) {
		return function(value, placeholder) {
			if (value) {
				return Utils.parseHour(value);
			} else {
				return (placeholder ? placeholder : '-');
			}
		};
    }]);

	app.filter('customString', ['$filter', function($filter) {
		return function(value, placeholder) {
			return value ? value : (placeholder ? placeholder : '-');
		};
    }]);

	app.filter('customEnum', function() {
		return function(val) {
			val = val + 1;
			return val < 10 ? '0' + val : val;
		};
	});

	app.filter('groupBy', ['$parse', 'filterWatcher', function($parse, filterWatcher) {
		function _groupBy(collection, getter) {
			var dict = {};
			var key;
			angular.forEach(collection, function(item) {
				key = getter(item);
				if (!dict[key]) {
					dict[key] = [];
				}
				dict[key].push(item);
			});
			return dict;
		}
		return function(collection, property) {
			if (!angular.isObject(collection) || angular.isUndefined(property)) {
				return collection;
			}
			return filterWatcher.isMemoized('groupBy', arguments) || filterWatcher.memoize('groupBy', arguments, this, _groupBy(collection, $parse(property)));
		};
    }]);

	app.filter('htmlToPlaintext', function() {
		function getStyle(n, p) {
			return n.currentStyle ? n.currentStyle[p] : window.getComputedStyle(n, null).getPropertyValue(p);
		}

		function toText(node) {
			var result = '';
			if (node.nodeType == document.TEXT_NODE) {
				var nodeValue = node.nodeValue;
				result = nodeValue;
				result = result ? String(result).replace(/</gm, '&lt;') : '';
				result = result ? String(result).replace(/>/gm, '&gt;') : '';
			} else if (node.nodeType == document.ELEMENT_NODE) {
				for (var i = 0, j = node.childNodes.length; i < j; i++) {
					result += toText(node.childNodes[i]);
				}
				var display = getStyle(node, 'display');
				if (display.match(/^block/) || display.match(/list/) || display.match(/row/) || node.tagName == 'BR' || node.tagName == 'HR') {
					result += '\n<br>';
				}
			}
			return result;
		}
		return function(html) {
			console.log(html);
			var div = document.createElement('div');
			div.innerHTML = html;
			return toText(div);
			// return html ? String(html).replace(/<[^>]+>/gm, '') : '';
		};
	});

}());

/* global angular, firebase */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Point', [function() {

		function Point(x, y) {
			this.x = x || 0;
			this.y = y || 0;
		}

		var statics = {
			difference: PointDifference,
			multiply: PointMultiply,
		};

		var publics = {
			clone: clone,
			copy: copy,
			difference: difference,
			mult: mult,
			offset: offset,
			setPos: setPos,
			setX: setX,
			setY: setY,
			toString: toString,
		};

		angular.extend(Point, statics);
		angular.extend(Point.prototype, publics);

		return Point;

		// static methods

		function PointDifference(a, b) {
			return new Point(a.x - b.x, a.y - b.y);
		}

		function PointMultiply(point, value) {
			point.x *= value;
			point.y *= value;
			return point;
		}

		// prototype methods

		function clone() {
			return new Point(this.x, this.y);
		}

		function copy(point) {
			this.x = point.x;
			this.y = point.y;
			return this;
		}

		function difference(b) {
			return PointDifference(this, b);
		}

		function mult(value) {
			return PointMultiply(this, value);
		}

		function offset(x, y) {
			this.x += x;
			this.y += y;
			return this;
		}

		function setPos(x, y) {
			this.x = x;
			this.y = y;
			return this;
		}

		function setX(x) {
			this.x = x;
			return this;
		}

		function setY(y) {
			this.y = y;
			return this;
		}

		function toString() {
			return '{' + this.x + ',' + this.y + '}';
		}

    }]);

}());

/* global angular, firebase */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Rect', [function() {

		function Rect(x, y, w, h) {
			this.x = x || 0;
			this.y = y || 0;
			this.w = w || 0;
			this.h = h || 0;
		}

		var statics = {
			mult: RectMultiply,
		};

		var publics = {
			bottom: bottom,
			bottomLeft: bottomLeft,
			bottomRight: bottomRight,
			center: center,
			clone: clone,
			copy: copy,
			expand: expand,
			expandRect: expandRect,
			intersect: intersect,
			left: left,
			mult: mult,
			offset: offset,
			reduce: reduce,
			reduceRect: reduceRect,
			right: right,
			setH: setH,
			setPos: setPos,
			setSize: setSize,
			setX: setX,
			setY: setY,
			setW: setW,
			top: top,
			topLeft: topLeft,
			topRight: topRight,
			toString: toString,
		};

		angular.extend(Rect, statics);
		angular.extend(Rect.prototype, publics);

		return Rect;

		// static methods

		function RectMultiply(rect, value) {
			rect.x *= value;
			rect.y *= value;
			rect.w *= value;
			rect.h *= value;
			return rect;
		}

		// prototype methods

		function bottom() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w / 2,
				y: y + h
			};
		}

		function bottomLeft() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x,
				y: y + h
			};
		}

		function bottomRight() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w,
				y: y + h
			};
		}

		function center() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w / 2,
				y: y + h / 2
			};
		}

		function clone() {
			return new Rect(this.x, this.y, this.w, this.h);
		}

		function copy(rect) {
			this.x = rect.x;
			this.y = rect.y;
			this.w = rect.w;
			this.h = rect.h;
			return this;
		}

		function expand(size) {
			return this.expandRect({
				x: size,
				y: size,
				w: size * 2,
				h: size * 2
			});
		}

		function expandRect(rect) {
			this.x -= rect.x || 0;
			this.y -= rect.y || 0;
			this.w += rect.w || 0;
			this.h += rect.h || 0;
			return this;
		}

		function intersect(rect) {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return !(rect.x > x + w || rect.x + rect.w < x || rect.y > y + h || rect.y + rect.h < y);
		}

		function left() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x,
				y: y + h / 2
			};
		}

		function mult(value) {
			return RectMultiply(this, value);
		}

		function offset(x, y) {
			this.x += x;
			this.y += y;
			return this;
		}

		function reduce(size) {
			return this.offset(-size);
		}

		function reduceRect(rect) {
			return this.offsetRect(RectMultiply(rect, -1));
		}

		function right() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w,
				y: y + h / 2
			};
		}

		function setH(h) {
			this.h = h;
			return this;
		}

		function setPos(x, y) {
			this.x = x;
			this.y = y;
			return this;
		}

		function setSize(w, h) {
			this.w = w;
			this.h = h;
			return this;
		}

		function setX(x) {
			this.x = x;
			return this;
		}

		function setY(y) {
			this.y = y;
			return this;
		}

		function setW(w) {
			this.w = w;
			return this;
		}

		function top() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w / 2,
				y: y
			};
		}

		function topLeft() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x,
				y: y
			};
		}

		function topRight() {
			var x = this.x,
				y = this.y,
				w = this.w,
				h = this.h;
			return {
				x: x + w,
				y: y
			};
		}

		function toString() {
			return '{' + this.x + ',' + this.y + ',' + this.w + ',' + this.h + '}';
		}

    }]);

}());

/* global angular, firebase */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Vector', function() {
		function Vector(x, y) {
			this.x = x || 0;
			this.y = y || 0;
		}

		var statics = {
			cross: VectorCross,
			difference: VectorDifference,
			distance: VectorDistance,
			incidence: VectorIncidence,
			make: VectorMake,
			normalize: VectorNormalize,
			power: VectorPower,
			size: VectorSize,
		};

		var publics = {
			add: add,
			copy: copy,
			cross: cross,
			difference: difference,
			distance: distance,
			friction: friction,
			incidence: incidence,
			normalize: normalize,
			power: power,
			size: size,
			towards: towards,
			toString: toString,
		};

		angular.extend(Vector, statics);
		angular.extend(Vector.prototype, publics);

		return Vector;

		// statics methods

		function VectorCross(a, b) {
			return (a.x * b.y) - (a.y * b.x);
		}

		function VectorDifference(a, b) {
			return new Vector(a.x - b.x, a.y - b.y);
		}

		function VectorDistance(a, b) {
			return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
		}

		function VectorIncidence(a, b) {
			var angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
			return angle;
		}

		function VectorMake(a, b) {
			return new Vector(b.x - a.x, b.y - a.y);
		}

		function VectorNormalize(a) {
			var l = Vector.size(a);
			a.x /= l;
			a.y /= l;
			return a;
		}

		function VectorPower(a, b) {
			var x = Math.abs(b.x - a.x);
			var y = Math.abs(b.y - a.y);
			return (x + y) / 2;
		}

		function VectorSize(a) {
			return Math.sqrt(a.x * a.x + a.y * a.y);
		}

		// prototype methods

		function add(b) {
			this.x += b.x;
			this.y += b.y;
			return this;
		}

		function copy(b) {
			return new Vector(this.x, this.y);
		}

		function cross(b) {
			return VectorCross(this, b);
		}

		function difference(b) {
			return VectorDifference(this, b);
		}

		function distance(b) {
			return VectorDistance(this, b);
		}

		function friction(b) {
			this.x *= b;
			this.y *= b;
			return this;
		}

		function incidence(b) {
			return VectorIncidence(this, b);
		}

		function normalize() {
			return VectorNormalize(this);
		}

		function power() {
			return (Math.abs(this.x) + Math.abs(this.y)) / 2;
		}

		function size() {
			return VectorSize(this);
		}

		function towards(b, friction) {
			friction = friction || 0.125;
			this.x += (b.x - this.x) * friction;
			this.y += (b.y - this.y) * friction;
			return this;
		}

		function toString() {
			return '{' + this.x + ',' + this.y + '}';
		}

	});

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Hash', [function() {
		var pools = {};

		function Hash(key, pool) {
			key = key || 'id';
			pool = pool ? HashGet(pool) : {};
			Object.defineProperties(this, {
				key: {
					value: key,
					enumerable: false,
					writable: false
				},
				pool: {
					value: pool,
					enumerable: false,
					writable: false
				},
				length: {
					value: 0,
					enumerable: false,
					writable: true
				}
			});
		}

		var publics = {
			has: has,
			get: get,
			getItem: getItem,
			set: set,
			add: add,
			once: once,
			remove: remove,
			each: each,
			addMany: addMany,
			removeMany: removeMany,
			removeAll: removeAll,
			forward: forward,
			backward: backward,
			differs: differs,
			updatePool: updatePool,
		};

		var statics = {
			get: HashGet,
		};

		Hash.prototype = new Array;
		angular.extend(Hash.prototype, publics);
		angular.extend(Hash, statics);

		return Hash;

		// publics
		function has(id) {
			return this.pool[id] !== undefined;
		}

		function get(id) {
			return this.pool[id];
		}

		function getItem(item) {
			var hash = this,
				key = this.key;
			return item ? hash.get(item[key]) : null;
		}

		function set(item) {
			var hash = this,
				pool = this.pool,
				key = this.key;
			pool[item[key]] = item;
			hash.push(item);
			return item;
		}

		function add(newItem) {
			var hash = this;
			var item = hash.getItem(newItem);
			if (item) {
				for (var i = 0, keys = Object.keys(newItem), p; i < keys.length; i++) {
					p = keys[i];
					item[p] = newItem[p];
				}
			} else {
				item = hash.set(newItem);
			}
			return item;
		}

		function once(newItem, callback) {
			var hash = this;
			var item = hash.getItem(newItem);
			if (!item) {
				item = hash.set(newItem);
			}
			if (typeof callback == 'function') {
				callback(item);
			}
			return item;
		}

		function remove(oldItem) {
			var hash = this,
				pool = this.pool,
				key = this.key;
			var item = hash.getItem(oldItem);
			if (item) {
				var index = hash.indexOf(item);
				if (index !== -1) {
					hash.splice(index, 1);
				}
				delete pool[item[key]];
			}
			return hash;
		}

		function addMany(items) {
			var hash = this;
			if (!items) {
				return hash;
			}
			var i = 0;
			while (i < items.length) {
				hash.add(items[i]);
				i++;
			}
			return hash;
		}

		function removeMany(items) {
			var hash = this;
			if (!items) {
				return hash;
			}
			var i = 0;
			while (i < items.length) {
				hash.remove(items[i]);
				i++;
			}
			return hash;
		}

		function removeAll() {
			var hash = this,
				key = hash.key,
				pool = hash.pool;
			var i = 0,
				t = hash.length,
				item;
			while (hash.length) {
				item = hash.shift();
				delete pool[item[key]];
				i++;
			}
			return hash;
		}

		function each(callback) {
			var hash = this;
			if (callback) {
				var i = 0;
				while (i < hash.length) {
					callback(hash[i], i);
					i++;
				}
			}
			return hash;
		}

		function forward(key, reverse) {
			var hash = this,
				key = (key || this.key);
			hash.sort(function(c, d) {
				var a = reverse ? d : c;
				var b = reverse ? c : d;
				return a[key] - b[key];
			});
			return hash;
		}

		function backward(key) {
			return this.forward(key, true);
		}

		function differs(hash) {
			if (hash.key !== this.key || hash.length !== this.length) {
				return true;
			} else {
				var differs = false,
					i = 0,
					t = this.length,
					key = this.key;
				while (differs && i < t) {
					differs = this[i][key] !== hash[i][key];
					i++;
				}
			}
		}

		function updatePool() {
			var hash = this,
				pool = this.pool,
				key = this.key;
			Object.keys(pool).forEach(function(key) {
				delete pool[key];
			});
			angular.forEach(hash, function(item) {
				pool[item[key]] = item;
			});
		}

		// statics
		function HashGet(pool) {
			return pools[pool] = (pools[pool] || {});
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('$promise', ['$q', function($q) {

		function $promise(callback) {
			if (typeof callback !== 'function') {
				throw ('promise resolve callback missing');
			}
			var deferred = $q.defer();
			callback(deferred);
			return deferred.promise;
		}

		var statics = {
			all: $promiseAll,
		};

		var publics = {};

		angular.extend($promise, statics);
		angular.extend($promise.prototype, publics);

		return $promise;

		function $promiseAll(promises) {
			return $q.all(promises);
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('State', ['$timeout', '$rootScope', function($timeout, $rootScope) {

		function State() {
			this.idle();
		}

		var DELAY = 2000;

		var statics = {};

		var publics = {
			busy: busy,
			classes: classes,
			enabled: enabled,
			error: error,
			errorMessage: errorMessage,
			errors: [],
			idle: idle,
			labels: labels,
			ready: ready,
			submitClass: submitClass,
			success: success,
		};

		angular.extend(State, statics);
		angular.extend(State.prototype, publics);

		return State;

		// static methods

		// publics methods

		function busy() {
			var state = this;
			if (!state.isBusy) {
				state.isBusy = true;
				state.isError = false;
				state.isErroring = false;
				state.isSuccess = false;
				state.isSuccessing = false;
				state.errors = [];
				return true;
			} else {
				return false;
			}
		}

		function classes(addons) {
			var state = this,
				classes = null;
			classes = {
				ready: state.isReady,
				busy: state.isBusy,
				successing: state.isSuccessing,
				success: state.isSuccess,
				errorring: state.isErroring,
				error: state.isError,
			};
			if (addons) {
				angular.forEach(addons, function(value, key) {
					classes[value] = classes[key];
				});
			}
			return classes;
		}

		function enabled() {
			var state = this;
			return !state.isBusy && !state.isErroring && !state.isSuccessing;
		}

		function error(error) {
			console.log('State.error', error);
			var state = this;
			state.isBusy = false;
			state.isError = true;
			state.isErroring = true;
			state.isSuccess = false;
			state.isSuccessing = false;
			state.errors.push(error);
			$timeout(function() {
				state.isErroring = false;
			}, DELAY);
		}

		function errorMessage() {
			var state = this;
			return state.isError ? state.errors[state.errors.length - 1] : null;
		}

		function idle() {
			var state = this;
			state.isBusy = false;
			state.isError = false;
			state.isErroring = false;
			state.isSuccess = false;
			state.isSuccessing = false;
			state.button = null;
			state.errors = [];
		}

		function labels(addons) {
			var state = this;
			var defaults = {
				ready: 'submit',
				busy: 'sending',
				error: 'error',
				success: 'success',
			};
			if (addons) {
				angular.extend(defaults, addons);
			}
			var label = defaults.ready;
			if (state.isBusy) {
				label = defaults.busy;
			} else if (state.isSuccess) {
				label = defaults.success;
			} else if (state.isError) {
				label = defaults.error;
			}
			return label;
		}

		function ready() {
			var state = this;
			state.idle();
			state.isReady = true;
			$rootScope.$broadcast('$stateReady', state);
		}

		function submitClass() {
			var state = this;
			return {
				busy: state.isBusy,
				ready: state.isReady,
				successing: state.isSuccessing,
				success: state.isSuccess,
				errorring: state.isErroring,
				error: state.isError,
			};
		}

		function success() {
			var state = this;
			state.isBusy = false;
			state.isError = false;
			state.isErroring = false;
			state.isSuccess = true;
			state.isSuccessing = true;
			state.errors = [];
			$timeout(function() {
				state.isSuccessing = false;
			}, DELAY);
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var transformProperty = detectTransformProperty();

	var app = angular.module('artisan');

	app.factory('Style', [function() {

		function Style() {
			this.props = {
				scale: 1,
				hoverScale: 1,
				currentScale: 1,
			};
		}

		var statics = {};

		var publics = {
			set: set,
			transform: transform,
			transformOrigin: transformOrigin,
		};

		angular.extend(Style, statics);
		angular.extend(Style.prototype, publics);

		return Style;

		// static methods

		// prototype methods

		function set(element) {
			var styles = [];
			for (var key in this) {
				if (key !== 'props') {
					styles.push(key + ':' + this[key]);
				}
			}
			element.style.cssText = styles.join(';') + ';';
		}

		function transform(transform) {
			this[transformProperty] = transform;
		}

		function transformOrigin(x, y) {
			this[transformProperty + '-origin-x'] = (Math.round(x * 1000) / 1000) + '%';
			this[transformProperty + '-origin-y'] = (Math.round(y * 1000) / 1000) + '%';
		}

    }]);

	function detectTransformProperty() {
		var transformProperty = 'transform',
			safariPropertyHack = 'webkitTransform';
		var div = document.createElement("DIV");
		if (typeof div.style[transformProperty] !== 'undefined') {
            ['webkit', 'moz', 'o', 'ms'].every(function(prefix) {
				var e = '-' + prefix + '-transform';
				if (typeof div.style[e] !== 'undefined') {
					transformProperty = e;
					return false;
				}
				return true;
			});
		} else if (typeof div.style[safariPropertyHack] !== 'undefined') {
			transformProperty = '-webkit-transform';
		} else {
			transformProperty = undefined;
		}
		return transformProperty;
	}

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Utils', ['$compile', '$controller', 'Vector', function($compile, $controller, Vector) {

		var service = this;

		var statics = {
			compileController: compileController,
			extract: extract,
			format: format,
			indexOf: indexOf,
			reducer: reducer,
			reducerAdder: reducerAdder,
			reducerSetter: reducerSetter,
			removeValue: removeValue,
			reverseSortOn: reverseSortOn,
			throttle: throttle,
			toMd5: toMd5,
			where: where,
		};

		angular.extend(service, statics);

		var getNow = Date.now || function() {
			return new Date().getTime();
		};

		function compileController(scope, element, html, data) {
			// console.log('Utils.compileController', element);
			element.html(html);
			var link = $compile(element.contents());
			if (data.controller) {
				var $scope = scope.$new();
				angular.extend($scope, data);
				var controller = $controller(data.controller, {
					$scope: $scope
				});
				if (data.controllerAs) {
					scope[data.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
				element.children().data('$ngControllerController', controller);
				scope = $scope;
			}
			link(scope);
		}

		function extract(obj, value) {
			return Object.keys(obj)[Object.values(obj).indexOf(value)];
		}

		function format(string, prepend, expression) {
			string = string || '';
			prepend = prepend || '';
			var splitted = string.split(',');
			if (splitted.length > 1) {
				var formatted = splitted.shift();
				angular.forEach(splitted, function(value, index) {
					if (expression) {
						formatted = formatted.split('{' + index + '}').join('\' + ' + prepend + value + ' + \'');
					} else {
						formatted = formatted.split('{' + index + '}').join(prepend + value);
					}
				});
				if (expression) {
					return '\'' + formatted + '\'';
				} else {
					return formatted;
				}
			} else {
				return prepend + string;
			}
		}

		function indexOf(array, object, key) {
			key = key || 'id';
			var index = -1;
			if (array) {
				var i = 0,
					t = array.length;
				while (i < t) {
					if (array[i] && array[i][key] === object[key]) {
						index = i;
						break;
					}
					i++;
				}
			}
			return index;
		}

		function reducer(o, key) {
			return o[key];
		}

		function reducerAdder(o, key, value) {
			if (typeof key == 'string') {
				return reducerAdder(o, key.split('.'), value);
			} else if (key.length == 1 && value !== undefined) {
				return (o[key[0]] += value);
			} else if (key.length === 0) {
				return o;
			} else {
				return reducerAdder(o[key[0]], key.slice(1), value);
			}
		}

		function reducerSetter(o, key, value) {
			if (typeof key == 'string') {
				return reducerSetter(o, key.split('.'), value);
			} else if (key.length == 1 && value !== undefined) {
				return (o[key[0]] = value);
			} else if (key.length === 0) {
				return o;
			} else {
				return reducerSetter(o[key[0]], key.slice(1), value);
			}
		}

		function removeValue(array, value) {
			var index = -1;
			if (array) {
				var i = 0,
					t = array.length;
				while (i < t) {
					if (array[i] === value) {
						index = i;
						break;
					}
					i++;
				}
			}
			if (index !== -1) {
				array.splice(index, 1);
				return value;
			} else {
				return null;
			}
		}

		function reverseSortOn(key) {
			return function(a, b) {
				if (a[key] < b[key]) {
					return 1;
				}
				if (a[key] > b[key]) {
					return -1;
				}
				// a must be equal to b
				return 0;
			};
		}

		function throttle(func, wait, options) {
			// Returns a function, that, when invoked, will only be triggered at most once
			// during a given window of time. Normally, the throttled function will run
			// as much as it can, without ever going more than once per `wait` duration;
			// but if you'd like to disable the execution on the leading edge, pass
			// `{leading: false}`. To disable execution on the trailing edge, ditto.
			var context, args, result;
			var timeout = null;
			var previous = 0;
			if (!options) options = {};
			var later = function() {
				previous = options.leading === false ? 0 : getNow();
				timeout = null;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			};
			return function() {
				var now = getNow();
				if (!previous && options.leading === false) previous = now;
				var remaining = wait - (now - previous);
				context = this;
				args = arguments;
				if (remaining <= 0 || remaining > wait) {
					if (timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					previous = now;
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}
				return result;
			};
		}

		function toMd5(string) {
			// return Md5.encode(string);
		}

		function where(array, query) {
			var found = null;
			if (array) {
				angular.forEach(array, function(item) {
					var has = true;
					angular.forEach(query, function(value, key) {
						has = has && item[key] === value;
					});
					if (has) {
						found = item;
					}
				});
			}
			return found;
		}

    }]);

	(function() {
		// POLYFILL Array.prototype.reduce
		// Production steps of ECMA-262, Edition 5, 15.4.4.21
		// Reference: http://es5.github.io/#x15.4.4.21
		// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
		if (typeof Array.prototype.reduce !== 'function') {
			Object.defineProperty(Array.prototype, 'reduce', {
				value: function(callback) { // , initialvalue
					if (this === null) {
						throw new TypeError('Array.prototype.reduce called on null or undefined');
					}
					if (typeof callback !== 'function') {
						throw new TypeError(callback + ' is not a function');
					}
					var o = Object(this);
					var len = o.length >>> 0;
					var k = 0;
					var value;
					if (arguments.length == 2) {
						value = arguments[1];
					} else {
						while (k < len && !(k in o)) {
							k++;
						}
						if (k >= len) {
							throw new TypeError('Reduce of empty array with no initial value');
						}
						value = o[k++];
					}
					while (k < len) {
						if (k in o) {
							value = callback(value, o[k], k, o);
						}
						k++;
					}
					return value;
				}
			});
		}
	}());

	(function() {
		// POLYFILL Object.values
		if (typeof Object.values !== 'function') {
			Object.defineProperty(Object, 'values', {
				value: function(obj) {
					var vals = [];
					for (var key in obj) {
						if (has(obj, key) && isEnumerable(obj, key)) {
							vals.push(obj[key]);
						}
					}
					return vals;
				}
			});
		}
	}());

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.provider('environment', ['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {

		var provider = this;

		var statics = {
			add: EnvironmentAdd,
			use: EnvironmentUse,
		};

		angular.extend(provider, statics);

		var defaults = {
			plugins: {
				facebook: {
					fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
					scope: 'public_profile, email', // publish_stream
					version: 'v2.10',
				},
				google: {},
				googlemaps: {
					clusterer: true,
					styles: '/googlemaps/applemapesque.json',
					options: {
						center: {
							lat: 43.9023386,
							lng: 12.8505094
						},
						disableDefaultUI: true,
						mapTypeId: 'roadmap', // "hybrid", "roadmap", "satellite", "terrain"
						scrollwheel: true,
						// tilt: 0, // 45
						zoom: 4.0,
					},
				},
				mapbox: {
					clusterer: true,
					options: {
						bearing: 0.0,
						center: [
                            12.8505094,
                            43.9023386
                        ],
						curve: 1,
						pitch: 0.0,
						speed: 1.5,
						zoom: 4.0,
					},
					version: 'v0.42.0',
				}
			},
			http: {
				interceptors: [], // ['AuthService'],
				withCredentials: false,
			},
			language: {
				code: 'en',
				culture: 'en_US',
				iso: 'ENU',
				name: 'English',
			},
			location: {
				hash: '!',
				html5: false,
			},
			paths: {},
		};

		var global = {};

		if (window.environment) {
			angular.merge(global, window.environment);
		}

		var config = {};

		var environment = angular.copy(defaults);
		angular.merge(environment, global);

		function EnvironmentSetHttp() {
			$httpProvider.defaults.headers.common["Accept-Language"] = environment.language.code;
			$httpProvider.defaults.withCredentials = environment.http.withCredentials;
			$httpProvider.interceptors.push.apply($httpProvider.interceptors, environment.http.interceptors);
		}

		function EnvironmentSetLocation() {
			$locationProvider.html5Mode(environment.location.html5);
			$locationProvider.hashPrefix(environment.location.hash);
		}

		function EnvironmentAdd(key, data) {
			config[key] = config[key] ? angular.merge(config[key], data) : data;
			EnvironmentSet();
		}

		function EnvironmentSet() {
			environment = angular.copy(defaults);
			if (config.environment) {
				angular.merge(environment, config.environment);
			}
			var value = EnvironmentGet();
			if (value) {
				angular.merge(environment, value);
			}
			angular.merge(environment, global);
			EnvironmentSetHttp();
			EnvironmentSetLocation();
		}

		function EnvironmentUse(key) {
			if (config[key]) {
				environment = angular.copy(defaults);
				angular.merge(environment, config[key]);
				angular.merge(environment, global);
				EnvironmentSetHttp();
				EnvironmentSetLocation();
			}
		}

		function EnvironmentGet() {
			for (var key in config) {
				var value = config[key];
				if (value.paths && window.location.href.indexOf(value.paths.app) !== -1) {
					return value;
				}
			}
		}

		provider.$get = function() {
			return environment;
		};

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Doc', ['Api', '$promise', function(Api, $promise) {

		function Doc(item) {
			if (item) {
				angular.extend(this, item);
			}
		}

		var statics = {};

		var publics = {};

		angular.extend(Doc, statics);
		angular.extend(Doc.prototype, publics);

		return Doc;

		// static methods

		// prototype methods

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Route', ['$promise', '$location', '$route', '$routeParams', 'Router', function($promise, $location, $route, $routeParams, Router) {

		function Route(current) {

			var route = {
				controller: current.$$route.controller,
				params: current.params,
				path: $location.path(),
				pathParams: current.pathParams,
				originalPath: current.$$route.originalPath,
				templateUrl: current.loadedTemplateUrl,
			};
			angular.extend(this, route);
		}

		var statics = {
			current: RouteCurrent,
		};

		var publics = {};

		angular.extend(Route, statics);
		angular.extend(Route.prototype, publics);

		return Route;

		// static methods

		function RouteCurrent() {
			return new Route($route.current);
		}

		// prototype methods

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('View', ['Api', '$promise', 'environment', 'Doc', 'Route', function(Api, $promise, environment, Doc, Route) {

		function View(doc, route) {
			var view = {
				doc: doc,
				environment: environment,
				route: route,
			};
			angular.extend(this, view);
		}

		var statics = {
			current: ViewCurrent, // ViewCurrentSimple
		};

		var publics = {};

		angular.extend(View, statics);
		angular.extend(View.prototype, publics);

		return View;

		// static methods

		function ViewCurrent() {
			return $promise(function(promise) {
				var route = Route.current();
				var path = route.path;
				console.log('ViewCurrent', path);
				Api.docs.path(path).then(function(response) {
					var doc = new Doc(response);
					var view = new View(doc, route);
					promise.resolve(view);

				}, function(error) {
					promise.reject(error);

				});
			});
		}

		function ViewCurrentSimple() {
			return $promise(function(promise) {
				console.log('ViewCurrentSimple');
				var route = Route.current();
				var path = route.path;
				Api.navs.main().then(function(items) {
					var doc = null,
						view = null,
						path = path,
						pool = ViewPool(items);
					var item = pool[path];
					if (item) {
						doc = new Doc(item);
						view = new View(doc, route);
					}
					promise.resolve(view);

				}, function(error) {
					promise.reject(error);

				});
			});
		}

		function ViewPool(items) {
			var pool = {};

			function _getPool(items) {
				if (items) {
					angular.forEach(items, function(item) {
						pool[item.path] = item;
						_getPool(item.items);
					});
				}
			}
			_getPool(items);
			return pool;
		}

		// prototype methods

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	// todo

	app.service('AuthService', ['$q', '$rootScope', '$location', 'LocalStorage', 'environment', function($q, $rootScope, $location, LocalStorage, environment) {

		var service = this;

		var statics = {
			isAuthorizedOrGoTo: isAuthorizedOrGoTo,
			isAuthorized: isAuthorized,
			request: request,
			response: response,
			responseError: responseError,
			signOut: signOut,
		};

		angular.extend(service, statics);

		/* * * * * * * * * * * * * * * * *
		 *  detect current auth storage  *
		 * * * * * * * * * * * * * * * * */

		console.log(environment.plugins);

		// statics methods

		function isAuthorizedOrGoTo(redirect) {
			var deferred = $q.defer();
			var auth = LocalStorage.get('authorization');
			if (auth && auth.created_at + auth.expires_in < new Date().getTime()) {
				deferred.resolve(auth);
			} else {
				deferred.reject({
					status: 'unauthorized'
				});
				$location.path(redirect);
			}
			return deferred.promise;
		}

		function isAuthorized() {
			var auth = LocalStorage.get('authorization');
			return (auth && auth.created_at + auth.expires_in < new Date().getTime());
		}

		function request(config) {
			var auth = LocalStorage.get('authorization');
			if (auth && auth.created_at + auth.expires_in < new Date().getTime()) {
				config.headers = config.headers || {};
				config.headers.Authorization = 'Bearer ' + auth.access_token; // add your token from your service or whatever
			}
			return config;
		}

		function response(response) {
			return response || $q.when(response);
		}

		function responseError(error) {
			console.log('AuthService.responseError', error);
			// your error handler
			switch (error.status) {
				case 400:
					var errors = [];
					if (error.data) {
						errors.push(error.data.Message);
						for (var key in error.data.ModelState) {
							for (var i = 0; i < error.data.ModelState[key].length; i++) {
								errors.push(error.data.ModelState[key][i]);
							}
						}
					} else {
						errors.push('Server error');
					}
					error.Message = errors.join(' ');
					// warning !!
					$rootScope.httpError = error;
					$rootScope.$broadcast('onHttpInterceptorError', error);
					break;
				case 404:
					error.Message = "Not found";
					$rootScope.httpError = error;
					$rootScope.$broadcast('onHttpInterceptorError', error);
					break;
				case 500:
					// console.log('500',error);
					$rootScope.httpError = error;
					$rootScope.$broadcast('onHttpInterceptorError', error);
					break;
				case 401:
					LocalStorage.delete('authorization');
					LocalStorage.delete('user');
					$location.path('/signin');
					break;
				case -1:
					window.open(error.config.path, '_blank');
					// status == 0 you lost connection
			}
			return $q.reject(error);
		}

		function signOut() {
			LocalStorage.delete('authorization');
			LocalStorage.delete('user');
			LocalStorage.delete('CampagnoloToken');
			LocalStorage.delete('GoogleToken');
			LocalStorage.delete('StravaToken');
			LocalStorage.delete('FacebookToken');
			LocalStorage.delete('GarminToken');
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Bearer', ['$http', '$promise', 'SessionStorage', 'LocalStorage', 'environment', function($http, $promise, SessionStorage, LocalStorage, environment) {

		var service = this;

		var statics = {
			'delete': BearerDelete,
			exist: BearerExists,
			get: BearerGet,
			set: BearerSet,
		};

		angular.extend(service, statics);

		// statics methods

		function BearerDelete(accessToken, remember) {
			SessionStorage.delete('accessToken');
			LocalStorage.delete('accessToken');
			delete $http.defaults.headers.common['Authorization'];
		}

		function BearerExists(accessToken, remember) {
			return SessionStorage.exist('accessToken') || LocalStorage.exist('accessToken');
		}

		function BearerGet(accessToken, remember) {
			var accessToken = null;
			if (SessionStorage.exist('accessToken')) {
				accessToken = SessionStorage.get('accessToken');
				BearerSet(accessToken);
			} else if (LocalStorage.exist('accessToken')) {
				accessToken = LocalStorage.get('accessToken');
				BearerSet(accessToken);
			}
			return accessToken;
		}

		function BearerSet(accessToken, remember) {
			var header = 'Bearer ' + accessToken;
			delete $http.defaults.headers.common['Authorization'];
			$http.defaults.headers.common['Authorization'] = header;
			SessionStorage.set('accessToken', accessToken);
			if (remember) {
				LocalStorage.set('accessToken', accessToken);
			}
			return header;
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Http', ['$http', '$promise', '$timeout', 'environment', function($http, $promise, $timeout, environment) {

		var service = this;

		var statics = {
			get: HttpGet,
			post: HttpPost,
			put: HttpPut,
			patch: HttpPatch,
			'delete': HttpDelete,
			'static': HttpStatic,
			fake: HttpFake,
		};

		angular.extend(service, statics);

		// statics methods

		function HttpPath(path) {
			return environment.paths.api + path;
		}

		function HttpPromise(method, path, data) {
			return $promise(function(promise) {
				$http[method](path, data).then(function(response) {
					promise.resolve(response.data);

				}, function(e, status) {
					var error = (e && e.data) ? e.data : {};
					error.status = e.status;
					promise.reject(error);

				});
			});
		}

		function HttpGet(path) {
			return HttpPromise('get', HttpPath(path));
		}

		function HttpPost(path, data) {
			return HttpPromise('post', HttpPath(path), data);
		}

		function HttpPut(path, data) {
			return HttpPromise('put', HttpPath(path), data);
		}

		function HttpPatch(path, data) {
			return HttpPromise('patch', HttpPath(path), data);
		}

		function HttpDelete(path) {
			return HttpPromise('delete', HttpPath(path));
		}

		function HttpStatic(path) {
			return HttpPromise('get', path);
		}

		function HttpFake(data, msec) {
			msec = msec || 1000;
			return $promise(function(promise) {
				$timeout(function() {
					promise.resolve({
						data: data
					});
				}, msec);
			});
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.factory('Preload', ['$promise', function($promise) {

		function Preload(path) {
			var preload = this;
			preload.path = path;
			preload.loaded = 0;
			preload.total = 0;
			preload.progress = 0;
		}

		var statics = {
			all: PreloadAll,
		};

		var publics = {
			start: PreloadStart,
			image: PreloadImage,
		};

		angular.extend(Preload, statics);
		angular.extend(Preload.prototype, publics);

		return Preload;

		// statics methods

		function PreloadAll(paths, callback) {
			return $promise(function(promise) {
				var preloads = paths.map(function(path) {
					return new Preload(path);
				});
				var progress = {
					loaded: 0,
					total: 0,
					progress: 0,
					preloads: preloads
				};
				var i = setInterval(update, 1000 / 10);
				$promise.all(
					preloads.map(function(preload) {
						return preload.start();
					})
				).then(function() {
					clearInterval(i);
					update();
					promise.resolve(preloads.slice());
					// destroy();
				}, function(error) {
					promise.reject(error);
					// destroy();
				});

				function update() {
					progress.loaded = 0;
					progress.total = 0;
					angular.forEach(preloads, function(preload) {
						progress.loaded += preload.loaded;
						progress.total += preload.total;
					});
					var percent = progress.total ? progress.loaded / progress.total : 0;
					if (percent > progress.progress) {
						progress.progress = percent;
						if (callback) {
							callback(progress);
						}
					}
				}

				function destroy() {
					angular.forEach(preloads, function(preload) {
						preload.buffer = null;
						preload.xhr = null;
					});
				}
			});
		}

		// instance methods

		function PreloadStart() {
			var preload = this;
			return $promise(function(promise) {
				var xhr = new XMLHttpRequest();
				xhr.open("GET", preload.path, true);
				xhr.responseType = "arraybuffer"; // should be after open for ie11
				xhr.onloadstart = function(e) {
					/*
					preload.loaded = 0;
					preload.total = 1;
					preload.progress = 0;
					*/
				};
				xhr.onprogress = function(e) {
					preload.loaded = e.loaded;
					preload.total = e.total;
					preload.progress = e.total ? e.loaded / e.total : 0;
				};
				xhr.onloadend = function(e) {
					preload.loaded = preload.total;
					preload.progress = 1;
				};
				xhr.onload = function() {
					preload.buffer = xhr.response;
					promise.resolve(preload);
				};
				xhr.onerror = function(error) {
					console.log('Preload.xhr.onerror', error);
					preload.loaded = preload.total;
					preload.progress = 1;
					promise.reject(error);
				};
				xhr.send();
				preload.xhr = xhr;
			});
		}

		function PreloadImage() {
			var preload = this;
			var blob = new Blob([preload.buffer]);
			var image = new Image();
			image.src = window.URL.createObjectURL(blob);
			return image;
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('$once', ['$promise', function($promise) {

		var service = this;

		var statics = {
			load: OnceLoad,
			script: OnceScript,
			link: OnceLink,
		};

		angular.extend(service, statics);

		var paths = {},
			uid = 0;

		function OnceLoad(path, callback) {
			if (path.indexOf('.js')) {
				return OnceScript(path, callback);

			} else if (path.indexOf('.css')) {
				return OnceLink(path);

			}
		}

		function OnceScript(path, callback) {
			return $promise(function(promise) {
				try {
					var id = (paths[path] = paths[path] || ++uid);
					id = 'OnceScript' + id;
					if (document.getElementById(id)) {
						promise.reject();
					} else {
						var scripts = document.getElementsByTagName('script');
						var script = scripts[scripts.length - 1];
						var node = document.createElement('script');
						node.id = id;
						if (callback) {
							if (callback === true) {
								callback = id;
								path = path.split('{{callback}}').join(callback);
							}
							window[callback] = function(data) {
								promise.resolve(data);
							};
						} else {
							node.addEventListener('load', promise.resolve);
						}
						node.addEventListener('error', promise.reject);
						node.src = path;
						script.parentNode.insertBefore(node, script.nextSibling);
					}
				} catch (error) {
					promise.reject(error);
				}
			});
		}

		function OnceLink(path) {
			return $promise(function(promise) {
				try {
					var id = (paths[path] = paths[path] || ++uid);
					id = 'OnceStyle' + id;
					if (document.getElementById(id)) {
						promise.resolve();
					} else {
						var links = document.getElementsByTagName('link');
						var link = links[links.length - 1];
						var node = document.createElement('link');
						node.id = id;
						node.rel = 'stylesheet';
						node.href = path;
						node.addEventListener('load', promise.resolve);
						node.addEventListener('error', promise.reject);
						link.parentNode.insertBefore(node, link.nextSibling);
					}
				} catch (error) {
					promise.reject(error);
				}
			});
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Router', ['$rootScope', '$location', '$route', '$timeout', function($rootScope, $location, $route, $timeout) {

		var service = this;

		var statics = {
			isController: RouterIsController,
			redirect: RouterRedirect,
			path: RouterPath,
			apply: RouterApply,
		};

		angular.extend(service, statics);

		$rootScope.$on('$routeChangeStart', RouterOnChangeStart);
		$rootScope.$on('$routeChangeSuccess', RouterOnChangeSuccess);
		$rootScope.$on('$routeChangeError', RouterOnChangeError);
		$rootScope.$on('$routeUpdate', RouterOnUpdate);
		$rootScope.$on('$stateReady', RouterOnStateReady);

		var $previous, $current, $next;
		var $previousController, $currentController, $nextController;

		function RouterSetControllers() {
			$previousController = $previous ? $previous.controller : null;
			$currentController = $current ? $current.controller : null;
			$nextController = $next ? $next.controller : null;
		}

		/*
		$routeChangeStart
		Broadcasted before a route change. At this point the route services starts resolving all of the dependencies needed for the route change to occur. Typically this involves fetching the view template as well as any dependencies defined in resolve route property. Once all of the dependencies are resolved $routeChangeSuccess is fired.
		The route change (and the $location change that triggered it) can be prevented by calling preventDefault method of the event. See $rootScope.Scope for more details about event object.
		*/
		function RouterOnChangeStart(event, next, current) {
			$previous = null;
			$current = current ? current.$$route : null;
			$next = next ? next.$$route : null;
			RouterSetControllers();
			// console.log('Router.RouterOnChangeStart', '$previous', $previous, '$current', $current, '$next', $next);
			service.loading = true;
		}

		/*
		$routeChangeSuccess
		Broadcasted after a route change has happened successfully. The resolve dependencies are now available in the current.locals property.
		*/
		function RouterOnChangeSuccess(event, current, previous) {
			$previous = previous ? previous.$$route : null;
			$current = current ? current.$$route : null;
			$next = null;
			RouterSetControllers();
			// console.log('Router.RouterOnChangeSuccess', '$previous', $previous, '$current', $current, '$next', $next);
		}

		/*
		$routeChangeError
		Broadcasted if a redirection function fails or any redirection or resolve promises are rejected.
		*/
		function RouterOnChangeError(event, current, previous, rejection) {
			$previous = null;
			$current = previous.$$route || null;
			$next = null;
			RouterSetControllers();
			// console.log('Router.RouterOnChangeError', '$previous', $previous, '$current', $current, '$next', $next);
		}

		/*
		$routeUpdate
		The reloadOnSearch property has been set to false, and we are reusing the same instance of the Controller.
		*/
		function RouterOnUpdate(event, current) {
			$previous = current ? current.$$route : null;
			$current = current ? current.$$route : null;
			$next = null;
			RouterSetControllers();
			// console.log('Router.RouterOnUpdate', '$previous', $previous, '$current', $current, '$next', $next);
		}

		function RouterOnStateReady(scope, state) {
			$timeout(function() {
				service.loading = false;
			}, 1000);
		}

		function RouterIsController(controller) {
			return $currentController === controller;
		}

		// navigation

		function RouterRedirectTo(path) {
			$location.$$lastRequestedPath = $location.path();
			$location.path(path);
		}

		function RouterRetryLastRequestedPath(path) {
			path = $location.$$lastRequestedPath || path;
			$location.$$lastRequestedPath = null;
			$location.path(path);
		}

		function RouterRedirect(path, msecs) {
			if (msecs) {
				$timeout(function() {
					RouterRedirectTo(path);
				}, msecs);
			} else {
				RouterRedirectTo(path);
			}
		}

		function RouterPath(path, msecs) {
			if (msecs) {
				$timeout(function() {
					RouterRetryLastRequestedPath(path);
				}, msecs);
			} else {
				RouterRetryLastRequestedPath(path);
			}
		}

		function RouterApply(path, msecs) {
			if (msecs) {
				$timeout(function() {
					$location.path(path);
				}, msecs);
			} else {
				$timeout(function() {
					$location.path(path);
				});
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Silent', ['$rootScope', '$location', function($rootScope, $location) {

		var service = this;

		var statics = {
			silent: SilentSilent,
			path: SilentPath,
		};

		angular.extend(service, statics);

		$rootScope.$$listeners.$locationChangeSuccess.unshift(SilentListener);
		// console.log('$rootScope.$$listeners.$locationChangeSuccess', $rootScope.$$listeners.$locationChangeSuccess);

		// private vars

		var $path;

		// static methods

		function SilentGetDomain() {
			var currentDomain = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
			return currentDomain;
		}

		function SilentUnlink() {
			var listeners = $rootScope.$$listeners.$locationChangeSuccess;
			angular.forEach(listeners, function(value, name) {
				if (value === listener) {
					return;
				}

				function relink() {
					listeners[name] = value;
				}
				listeners[name] = relink; // temporary unlinking
			});
		}

		function SilentListener(e) {
			// console.log('onLocationChangeSuccess', e);
			if ($path === $location.path()) {
				SilentUnlink();
			}
			$path = null;
		}

		function SilentSilent(path, replace) {
			// this.prev = $location.path(); ???
			var location = $location.url(path);
			if (replace) {
				location.replace();
			}
			$path = $location.path();
		}

		function SilentPath(path) {
			return $location.path(path);
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	var TIMEOUT = 5 * 60 * 1000; // five minutes

	app.service('Cookie', ['$promise', function($promise) {

		var service = {
			TIMEOUT: TIMEOUT,
			'delete': CookieDelete,
			exist: CookieExists,
			get: CookieGet,
			on: CookieOn,
			set: CookieSet,
		};

		angular.extend(this, service);

		function CookieDelete(name) {
			CookieSetter(name, "", -1);
		}

		function CookieExists(name) {
			return document.cookie.indexOf(';' + name + '=') !== -1 || document.cookie.indexOf(name + '=') === 0;
		}

		function CookieGet(name) {
			var cookieName = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(cookieName) === 0) {
					var value = c.substring(cookieName.length, c.length);
					var model = null;
					try {
						model = JSON.parse(decodeURIComponent(atob(value)));
					} catch (e) {
						console.log('Cookie.get.error parsing', key, e);
					}
					return model;
				}
			}
			return null;
		}

		function CookieOn(name) {
			return $promise(function(promise) {
				var i, interval = 1000,
					elapsed = 0,
					timeout = Cookie.TIMEOUT;

				function checkCookie() {
					if (elapsed > timeout) {
						promise.reject('timeout');
					} else {
						var c = CookieGet(name);
						if (c) {
							promise.resolve(c);
						} else {
							elapsed += interval;
							i = setTimeout(checkCookie, interval);
						}
					}
				}
				checkCookie();
			});
		}

		function CookieSet(name, value, days) {
			try {
				var cache = [];
				var json = JSON.stringify(value, function(key, value) {
					if (key === 'pool') {
						return;
					}
					if (typeof value === 'object' && value !== null) {
						if (cache.indexOf(value) !== -1) {
							// Circular reference found, discard key
							return;
						}
						cache.push(value);
					}
					return value;
				});
				cache = null;
				CookieSetter(name, btoa(encodeURIComponent(json)), days);
			} catch (e) {
				console.log('CookieSet.error serializing', name, value, e);
			}
		}

		function CookieSetter(name, value, days) {
			var expires;
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toGMTString();
			} else {
				expires = '';
			}
			document.cookie = name + '=' + value + expires + '; path=/';
		}

    }]);

	app.service('LocalStorage', ['$promise', 'Cookie', function($promise, Cookie) {

		var service = {
			TIMEOUT: TIMEOUT,
			'delete': LocalDelete,
			exist: LocalExists,
			get: LocalGet,
			on: LocalOn,
			set: LocalSet,
		};

		var supported = LocalSupported();

		if (supported) {
			angular.extend(this, service);
		} else {
			angular.extend(this, Cookie);
		}

		this.supported = supported;

		function LocalSupported() {
			var supported = false;
			try {
				supported = 'localStorage' in window && window.localStorage !== null;
				if (supported) {
					window.localStorage.setItem('test', '1');
					window.localStorage.removeItem('test');
				} else {
					supported = false;
				}
			} catch (e) {
				supported = false;
			}
			return supported;
		}

		function LocalExists(name) {
			return window.localStorage[name] !== undefined;
		}

		function LocalGet(name) {
			var value = null;
			if (window.localStorage[name] !== undefined) {
				try {
					value = JSON.parse(window.localStorage[name]);
				} catch (e) {
					console.log('LocalStorage.get.error parsing', name, e);
				}
			}
			return value;
		}

		function LocalSet(name, value) {
			try {
				var cache = [];
				var json = JSON.stringify(value, function(key, value) {
					if (key === 'pool') {
						return;
					}
					if (typeof value === 'object' && value !== null) {
						if (cache.indexOf(value) !== -1) {
							// Circular reference found, discard key
							return;
						}
						cache.push(value);
					}
					return value;
				});
				cache = null;
				window.localStorage.setItem(name, json);
			} catch (e) {
				console.log('LocalStorage.set.error serializing', name, value, e);
			}
		}

		function LocalDelete(name) {
			window.localStorage.removeItem(name);
		}

		function LocalOn(name) {
			return $promise(function(promise) {
				var i, timeout = Cookie.TIMEOUT;

				function storageEvent(e) {
					// console.log('LocalStorage.on', name, e);
					if (i) {
						clearTimeout(i);
					}
					if (e.originalEvent.key == name) {
						try {
							var value = JSON.parse(e.originalEvent.newValue); // , e.originalEvent.oldValue
							promise.resolve(value);
						} catch (error) {
							console.log('LocalStorage.on.error parsing', name, error);
							promise.reject('error parsing ' + name);
						}
					}
				}
				angular.element(window).on('storage', storageEvent);
				i = setTimeout(function() {
					promise.reject('timeout');
				}, timeout);
			});
		}

    }]);

	app.service('SessionStorage', ['$promise', 'Cookie', function($promise, Cookie) {

		var service = {
			TIMEOUT: TIMEOUT,
			'delete': SessionDelete,
			exist: SessionExists,
			get: SessionGet,
			on: SessionOn,
			set: SessionSet,
		};

		var supported = SessionSupported();

		if (supported) {
			angular.extend(this, service);
		} else {
			angular.extend(this, Cookie);
		}

		this.supported = supported;

		function SessionSupported() {
			var supported = false;
			try {
				supported = 'sessionStorage' in window && window.sessionStorage !== undefined;
				if (supported) {
					window.sessionStorage.setItem('test', '1');
					window.sessionStorage.removeItem('test');
				} else {
					supported = false;
				}
			} catch (e) {
				supported = false;
			}
			return supported;
		}

		function SessionExists(name) {
			return window.sessionStorage[name] !== undefined;
		}

		function SessionGet(name) {
			var value = null;
			if (window.sessionStorage[name] !== undefined) {
				try {
					value = JSON.parse(window.sessionStorage[name]);
				} catch (e) {
					console.log('SessionStorage.get.error parsing', name, e);
				}
			}
			return value;
		}

		function SessionSet(name, value) {
			try {
				var cache = [];
				var json = JSON.stringify(value, function(key, value) {
					if (key === 'pool') {
						return;
					}
					if (typeof value === 'object' && value !== null) {
						if (cache.indexOf(value) !== -1) {
							// Circular reference found, discard key
							return;
						}
						cache.push(value);
					}
					return value;
				});
				cache = null;
				window.sessionStorage.setItem(name, json);
			} catch (e) {
				console.log('SessionStorage.set.error serializing', name, value, e);
			}
		}

		function SessionDelete(name) {
			window.sessionStorage.removeItem(name);
		}

		function SessionOn(name) {
			return $promise(function(promise) {
				var i, timeout = Cookie.TIMEOUT;

				function storageEvent(e) {
					// console.log('SessionStorage.on', name, e);
					if (i) {
						clearTimeout(i);
					}
					if (e.originalEvent.key === name) {
						try {
							var value = JSON.parse(e.originalEvent.newValue); // , e.originalEvent.oldValue
							promise.resolve(value);
						} catch (error) {
							console.log('SessionStorage.on.error parsing', name, error);
							promise.reject('error parsing ' + name);
						}
					}
				}
				angular.element(window).on('storage', storageEvent);
				i = setTimeout(function() {
					promise.reject('timeout');
				}, timeout);
			});
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Trust', ['$sce', function($sce) {

		var service = this;

		var statics = {
			html: TrustHtml,
			resource: TrustResource,
			url: TrustUrl,
		};

		angular.extend(service, statics);

		// private vars

		var values = [],
			trustedValues = [];

		function TrustGetValue(value) {
			var index = values.indexOf(value);
			if (index !== -1) {
				return trustedValues[index];
			} else {
				return null;
			}
		}

		function TrustSetValue(value, trustedValue) {
			values.push(value);
			values.push(trustedValue);
		}

		function TrustGetOrSet(value, callback) {
			var trustedValue = TrustGetValue(value);
			if (!trustedValue) {
				trustedValue = callback();
				TrustSetValue(value, trustedValue);
			}
			return trustedValue;
		}

		function TrustHtml(value) {
			return TrustGetOrSet(value, function() {
				return $sce.trustAsHtml(value);
			});
		}

		function TrustResource(value) {
			return TrustGetOrSet(value, function() {
				return $sce.trustAsResourceUrl(value);
			});
		}

		function TrustUrl(value) {
			return TrustGetOrSet(value, function() {
				return 'url(\'' + value + '\')';
			});
		}

    }]);

}());
