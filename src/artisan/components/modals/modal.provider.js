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
