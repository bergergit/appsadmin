'use strict';

angular.module('appsadmin.navigation', [])

/** Controller that manages navigation actions, related to the navbar */
.controller('NavigationCtrl', ['$rootScope','$location','$routeParams','auth','navigationService', function($rootScope, $location, $routeParams, auth, navigationService) {
	var vm = this;
	//var authenticatedPaths = '/applications*|/users*';
	var authenticatedPaths = '.*',
		fetchedApps = false
	
	// fetch applications belonging to this user. 
	$rootScope.$on('$routeChangeSuccess', function() {
		if (auth.authenticated && !fetchedApps) {
			//vm.applications = navigationService.query({ userId: auth.data.id });
			var applications = navigationService.query({userId: auth.data.id, projection: 'simple'}, function() {
				fetchedApps = true;
				vm.applications = new navigationService(applications._embedded ? applications._embedded['applications'] : {});
			});
		}
    });
	
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
		fetchedApps = false;
		vm.applications = {};
	}

	vm.isAnonymous = auth.isAnonymous;
	vm.hasRole = auth.hasRole;
	vm.showFlash = auth.showFlash || $routeParams.session;
	
	//console.debug("auth.data", auth.data);
}]);