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
 
 /**
 * This will intercept ajax calls for unauthenticated users in case of 401
 */
.factory('authHttpResponseInterceptor',['$q','$injector',function($q, $injector){
    return {
        response: function(response){
            if (response.status === 401 || response.status === 403) {
                //console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                //console.log("Response Error 401",rejection);
                var auth = $injector.get('auth');
                auth.clear();
                auth.showFlash = true;
            }
            return $q.reject(rejection);
        }
    }
}])

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
	$httpProvider.interceptors.push('authHttpResponseInterceptor');
	
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

