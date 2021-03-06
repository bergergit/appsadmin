'use strict';

angular.module('appsadmin', [
  'ngRoute',
  'pascalprecht.translate',
  'googleplus',
  'facebook',
  'bmauth.main',
  'appsadmin.navigation',
  'appsadmin.admin',
  'appsadmin.frontend'
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
                auth.showFlash = true;
                auth.clear();
            }
            return $q.reject(rejection);
        }
    }
}])

.config(['$routeProvider', '$translateProvider', '$locationProvider', '$httpProvider','$compileProvider',
         function($routeProvider, $translateProvider, $locationProvider, $httpProvider, $compileProvider) {
	$compileProvider.debugInfoEnabled(false);
	// routes configuration
	$routeProvider.when('/', { 
		  templateUrl: 'fragments/home/home.html',
		  controller: 'HomeCtrl',
		  controllerAs: 'vm'
	}).when('/login', { 
		  templateUrl: 'fragments/home/login.html',
		  controller: 'HomeCtrl',
		  controllerAs: 'vm'
	}).when('/users', { 
		  templateUrl: 'fragments/admin/users.html',
		  controller: 'UsersCtrl',
		  controllerAs: 'vm'
	}).when('/admin', { 
		  templateUrl: 'fragments/admin/admin.html',
		  controller: 'AdminCtrl',
		  controllerAs: 'vm'
	}).when('/types', { 
		  templateUrl: 'fragments/admin/types.html',
		  controller: 'TypesCtrl',
		  controllerAs: 'vm'
	}).when('/edit/:applicationId', { 
		  templateUrl: 'fragments/frontend/content.html',
		  controller: 'FrontendCtrl',
		  controllerAs: 'vm'
	}).when('/reset/:token/:userid', { 
		  templateUrl: 'fragments/home/resetPassword.html',
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

.run(['$translate','$rootScope','auth', function($translate, $rootScope, auth) {
    $rootScope.authContext='bmauth/';	// for reverse proxy
    $rootScope.appname = 'appsadmin';
    
    auth.init('/', 'bmauth/user', 'bmauth/logout');
}]);  

