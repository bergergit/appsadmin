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
  'appsadmin.navigation',
  'appsadmin.admin'
 ])

.config(['$routeProvider', '$translateProvider', '$locationProvider', '$httpProvider',
         function($routeProvider, $translateProvider, $locationProvider, $httpProvider) {
	// routes configuration
	$routeProvider.when('/', { 
		  templateUrl: 'fragments/home/home.html',
		  controller: 'NavigationCtrl',
		  controllerAs: 'vm'
	}).when('/login', { 
		  templateUrl: 'fragments/home/login.html',
		  controllerAs: 'vm'
	}).when('/users', { 
		  templateUrl: 'fragments/admin/users.html',
		  controller: 'UsersCtrl',
		  controllerAs: 'vm'
	}).when('/admin', { 
		  templateUrl: 'fragments/admin/admin.html',
		  controller: 'AdminCtrl',
		  controllerAs: 'vm'
	})
	.otherwise({redirectTo: '/'});
	
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	// translation configuration
	//$translateProvider.useSanitizeValueStrategy('escape');
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.translations('en', bmauth_translations.en);
    $translateProvider.translations('en', appsadmin_translations.en);

	$translateProvider.preferredLanguage('en');
	$translateProvider.fallbackLanguage('en');
	
	// support natural routes
	$locationProvider.html5Mode(true);
}])
  
.run(['DTDefaultOptions','$translate','$rootScope','auth', function(DTDefaultOptions, $translate, $rootScope, auth) {
    $rootScope.authContext='bmauth/';	// for reverse proxy
    $rootScope.appname = 'appsadmin';
    
    auth.init('/', 'bmauth/user', 'bmauth/logout');
}]);  

