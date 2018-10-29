angular.module('appsadmin.admin')

.factory('userService', [ '$resource','$rootScope', function($resource, $rootScope) {
	return $resource($rootScope.authContext + 'bmauth/users/appname/:appname');
}]);