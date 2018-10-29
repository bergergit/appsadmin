angular.module('appsadmin.frontend')

.factory('navigationService', [ '$resource','$rootScope', function($resource, $rootScope) {
	return $resource('rest/applications/search/byUser', null,
			{'query': {method: 'GET', isArray: false}}
	);
}]);