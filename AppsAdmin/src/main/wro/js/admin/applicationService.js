angular.module('appsadmin.admin')

.factory('applicationService', [ '$resource','$rootScope', function($resource, $rootScope) {
	return $resource('rest/applications/:applicationId', null,
			{'query': {method: 'GET', isArray: false}}
	);
}]);