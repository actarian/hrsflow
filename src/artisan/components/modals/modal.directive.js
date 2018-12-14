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
