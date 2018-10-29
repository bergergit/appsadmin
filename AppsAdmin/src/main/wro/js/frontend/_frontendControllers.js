angular.module('appsadmin.frontend', ['ngResource','ui.bootstrap','appsadmin.frontendjs'])

/**
 * Controller for Appsadmin Frontend Screen
 */
.controller('FrontendCtrl', ['frontendjs', function(frontendjs) {
	var vm = this;
		
	frontendjs();
}])

.controller('HomeCtrl', ['$location','$routeParams','auth', function($location, $routeParams, auth) {
	var vm = this;
	
	if ($routeParams.reset) {
		auth.clear(true);
		$location.search('reset', null);
	}
	
	vm.showFlash = auth.showFlash || $routeParams.session;
	vm.isAnonymous = auth.isAnonymous;
}]);
