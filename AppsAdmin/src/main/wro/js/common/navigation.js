'use strict';

angular.module('appsadmin.navigation', [])

/** Controller that manages navigation actions, related to the navbar */
.controller('NavigationCtrl', ['$location','$routeParams','auth', function($location, $routeParams, auth) {
	var vm = this;
	//var authenticatedPaths = '/applications*|/users*';
	var authenticatedPaths = '.*';
	
	vm.showNavBar = function() {
		// show navbar if in administration screens
		if ($location.path().match(authenticatedPaths)) {
			return true;
		}
		return false;
	}
	
	vm.activeClass = function(page) {
		if ($location.path().match(page)) return 'active';
		return '';
	}
	
	vm.logout = function() {
		auth.clear();
	}

	vm.isAnonymous = auth.isAnonymous;
	vm.hasRole = auth.hasRole;
	vm.showFlash = auth.showFlash || $routeParams.session;
	
	//console.debug("auth.data", auth.data);
}]);