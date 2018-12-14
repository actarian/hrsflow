/* global angular */

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.service('Calendar', ['DateTime', 'Hash', function(DateTime, Hash) {

		var service = this;

		var days = new Hash('key');
		var months = new Hash('mKey');

		var statics = {
			getDate: getDate,
			clearMonth: clearMonth,
			getMonthByDate: getMonthByDate,
			getWeekByDate: getWeekByDate,
			getMonths: getMonths,
			getMonth: getMonth,
			getDay: getDay,
			getKey: getKey,
			days: days,
			months: months,
		};

		angular.extend(service, statics);

		function getDate(day) {
			if (typeof day.date.getMonth === 'function') {
				return day.date;
			} else {
				return new Date(day.date);
			}
		}

		function clearMonth(month) {
			month.days.each(function(day) {
				if (day) {
					day.hours = 0;
					day.tasks = new Hash('id');
				}
			});
		}

		function getMonthByDate(date) {
			date = date || new Date();
			var yyyy = date.getFullYear();
			var MM = date.getMonth();
			var key = Math.ceil(date.getTime() / DateTime.DAY);
			var mKey = yyyy * 12 + MM;
			var month = months.get(mKey);
			if (!month) {
				var fromDay = new Date(yyyy, MM, 1).getDay() - 1;
				fromDay = fromDay < 0 ? 6 : fromDay;
				var monthDays = new Date(yyyy, MM + 1, 0).getDate();
				var weeks = 6; // Math.ceil((fromDay + monthDays) / 7);
				// console.log('month', MM, 'weeks', weeks);
				month = {
					date: date,
					mKey: mKey,
					month: MM,
					monthDays: monthDays,
					fromDay: fromDay,
					days: new Hash('key'),
				};
				month.weeks = new Array(weeks).fill().map(function(o, r) {
					var days = new Hash('key');
					new Array(7).fill().map(function(o, c) {
						var item = null;
						var d = r * 7 + c - fromDay;
						if (d >= 0 && d < monthDays) {
							var date = new Date(yyyy, MM, d + 1);
							var key = Math.ceil(date.getTime() / DateTime.DAY);
							item = {
								$today: key === DateTime.today.key,
								c: c,
								r: r,
								d: d + 1,
								date: date,
								key: key,
								hours: 0,
								tasks: new Hash('id'),
							};
							service.days.add(item);
							item = month.days.add(item);
							days.add(item);
						}
						return item;
					});
					return {
						r: r,
						date: new Date(yyyy, MM, r * 7 - fromDay + 1),
						days: days,
					};
				});
				month.getMonth = function(diff) {
					diff = diff || 0;
					return new Date(yyyy, MM + diff, 1);
				};
				month = months.add(month);
			}
			return month;
		}

		function getWeekByDate(date) {
			date = date || new Date();
			var key = Math.ceil(date.getTime() / DateTime.DAY);
			var month = service.getMonthByDate(date);
			var week = month.weeks.find(function(week) {
				return week.days.find(function(day) {
					return day.key === key;
				});
			});
			return week;
		}

		function getMonths(num) {
			days.removeAll();
			months.removeAll();
			var i = 0;
			while (i < num) {
				var date = new Date();
				date.setFullYear(DateTime.today.date.getFullYear());
				date.setMonth(DateTime.today.date.getMonth() + i);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				var month = getMonthByDate(date);
				// console.log('getMonths', month);
				i++;
			}
			// console.log('getMonths', months);
			return months;
		}

		function getMonth(day) {
			var date = getDate(day);
			var month = getMonthByDate(date);
			return month;
		}

		function getDay(days) {
			var date = new Date(DateTime.today.date);
			date.setDate(date.getDate() + days);
			return date;
		}

		function getKey(date) {
			return Math.ceil(date.getTime() / DateTime.DAY);
		}

    }]);

	app.factory('CalendarFactory', ['$filter', 'DateTime', 'Hash', function($filter, DateTime, Hash) {

		function Calendar() {
			this.days = new Hash('key');
			this.weeks = new Hash('wKey');
			this.months = new Hash('mKey');
		}

		var statics = {
			clearMonth: clearMonth,
			getDate: getDate,
			getDay: getDay,
			getKey: getKey,
		};

		var publics = {
			getWeeks: getWeeks,
			getWeek: getWeek,
			getWeekByDate: getWeekByDate,
			getMonths: getMonths,
			getMonth: getMonth,
			getMonthByDate: getMonthByDate,
		};

		angular.extend(Calendar, statics);
		angular.extend(Calendar.prototype, publics);

		return Calendar;

		// statics

		function clearMonth(month) {
			month.days.each(function(day) {
				if (day) {
					day.hours = 0;
					day.tasks = new Hash('id');
				}
			});
		}

		function getDate(day) {
			if (typeof day.date.getMonth === 'function') {
				return day.date;
			} else {
				return new Date(day.date);
			}
		}

		function getDay(days) {
			var date = new Date(DateTime.today.date);
			date.setDate(date.getDate() + days);
			return date;
		}

		function getKey(date) {
			return Math.ceil(date.getTime() / DateTime.DAY);
		}

		// publics

		function getWeeks(num) {
			var calendar = this;
			calendar.days.removeAll();
			calendar.weeks.removeAll();
			calendar.months.removeAll();
			var i = 0;
			while (i < num) {
				var date = new Date();
				date.setFullYear(DateTime.today.date.getFullYear());
				date.setMonth(DateTime.today.date.getMonth() + i);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				var week = calendar.getWeekByDate(date);
				// console.log('getWeeks', week);
				i++;
			}
			// console.log('getWeeks', calendar.weeks);
			return calendar.weeks;
		}

		function getWeek(day) {
			var calendar = this;
			var date = getDate(day);
			var week = calendar.getWeekByDate(date);
			return week;
		}

		function getWeekByDate(date) {
			date = date || new Date();
			var calendar = this;
			var yyyy = date.getFullYear();
			var MM = date.getMonth();
			var day = date.getDay();
			var diff = date.getDate() - day + (day === 0 ? -6 : 1);
			var weekDate = new Date(date.setDate(diff));
			var isoWeek = $filter('isoWeek')(date, 1);
			var dKey = Math.ceil(weekDate.getTime() / DateTime.DAY);
			var wKey = yyyy * 60 + isoWeek;
			var mKey = yyyy * 12 + MM;
			var week = calendar.weeks.get(wKey);
			if (!week) {
				var days = new Hash('key');
				new Array(7).fill().map(function(o, i) {
					var dayDate = new Date(weekDate);
					dayDate.setDate(weekDate.getDate() + i);
					var key = Math.ceil(dayDate.getTime() / DateTime.DAY);
					var item = {
						$today: key === DateTime.today.key,
						c: i,
						d: dayDate.getDate(),
						date: dayDate,
						key: key,
					};
					calendar.days.add(item);
					days.add(item);
					return item;
				});
				week = {
					isoWeek: isoWeek,
					key: dKey,
					wKey: wKey,
					mKey: mKey,
					date: weekDate,
					days: days,
				};
				week = calendar.weeks.add(week);
			}
			return week;
		}

		function getMonths(num) {
			var calendar = this;
			calendar.days.removeAll();
			calendar.months.removeAll();
			var i = 0;
			while (i < num) {
				var date = new Date();
				date.setFullYear(DateTime.today.date.getFullYear());
				date.setMonth(DateTime.today.date.getMonth() + i);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				var month = calendar.getMonthByDate(date);
				// console.log('getMonths', month);
				i++;
			}
			// console.log('getMonths', months);
			return calendar.months;
		}

		function getMonth(day) {
			var calendar = this;
			var date = getDate(day);
			var month = calendar.getMonthByDate(date);
			return month;
		}

		function getMonthByDate(date) {
			date = date || new Date();
			var calendar = this;
			var yyyy = date.getFullYear();
			var MM = date.getMonth();
			var key = Math.ceil(date.getTime() / DateTime.DAY);
			var mKey = yyyy * 12 + MM;
			var month = calendar.months.get(mKey);
			if (!month) {
				var fromDay = new Date(yyyy, MM, 1).getDay() - 1;
				fromDay = fromDay < 0 ? 6 : fromDay;
				var monthDays = new Date(yyyy, MM + 1, 0).getDate();
				var weeks = 6; // Math.ceil((fromDay + monthDays) / 7);
				// console.log('month', MM, 'weeks', weeks);
				month = {
					date: date,
					mKey: mKey,
					month: MM,
					monthDays: monthDays,
					fromDay: fromDay,
					days: new Hash('key'),
				};
				month.weeks = new Array(weeks).fill().map(function(o, r) {
					var days = new Hash('key');
					new Array(7).fill().map(function(o, c) {
						var item = null;
						var d = r * 7 + c - fromDay;
						if (d >= 0 && d < monthDays) {
							var date = new Date(yyyy, MM, d + 1);
							var key = Math.ceil(date.getTime() / DateTime.DAY);
							item = {
								$today: key === DateTime.today.key,
								c: c,
								r: r,
								d: d + 1,
								date: date,
								key: key,
								hours: 0,
								tasks: new Hash('id'),
							};
							calendar.days.add(item);
							item = month.days.add(item);
							days.add(item);
						}
						return item;
					});
					var date = new Date(yyyy, MM, r * 7 - fromDay + 1);
					var week = $filter('isoWeek')(date, 1);
					var wKey = yyyy * 60 + week;
					return {
						r: r,
						wKey: wKey,
						date: date,
						days: days,
					};
				});
				month.getMonth = function(diff) {
					diff = diff || 0;
					return new Date(yyyy, MM + diff, 1);
				};
				month = calendar.months.add(month);
			}
			return month;
		}

    }]);

}());
