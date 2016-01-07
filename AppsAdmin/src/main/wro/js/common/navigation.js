'use strict';

angular.module('appsadmin.navigation', [])

/** Controller that manages navigation actions, related to the navbar */
.controller('NavigationCtrl', ['$location', function($location) {
	var vm = this;
	var authenticatedPaths = '/applications*|/users*;'
	
	vm.showNavBar = function() {
		// show navbar if in administration screens
		if ($location.path().match(authenticatedPaths)) {
			return true;
		}
		return false;
	}
	
	vm.logout = function() {
		auth.clear();
	}
}]);