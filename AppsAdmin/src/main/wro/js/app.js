'use strict';

angular.module('appsadmin', [
  'ngRoute',
  'pascalprecht.translate',
  'googleplus',
  'facebook',
  'bmauth.authentication',
  'bmauth.main',
  'bmauth.users',
  'bmauth.common',
  'appsadmin.navigation'
 ])

.config(['$routeProvider', '$translateProvider', '$locationProvider', '$httpProvider',
         function($routeProvider, $translateProvider, $locationProvider, $httpProvider) {
	// routes configuration
	$routeProvider.when('/', { 
		  templateUrl: 'fragments/home/home.html',
		  //controller: 'HomeCtrl',
		  controllerAs: 'vm'
	}).when('/home', { 
		  templateUrl: 'fragments/home/signedin.html',
		  //controller: 'ApplicationsListCtrl',
		  controllerAs: 'vm'
	})
	.otherwise({redirectTo: '/'});
	
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	// translation configuration
	// translation configuration
	//$translateProvider.useSanitizeValueStrategy('escape');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.translations('en', bmauth_translations.en);

	$translateProvider.preferredLanguage('en');
	$translateProvider.fallbackLanguage('en');
	
	// support natural routes
	$locationProvider.html5Mode(true);
}])
  
.run(['DTDefaultOptions','$translate','$rootScope','auth', function(DTDefaultOptions, $translate, $rootScope, auth) {
    //DTDefaultOptions.setLanguageSource('fragments/lang/dtlang-' + $translate.use() + '.json');
    $rootScope.authContext='bmauth/';	// for reverse proxy
    auth.init('/', 'bmauth/user', 'bmauth/logout');
}]);  

