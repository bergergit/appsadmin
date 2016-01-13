angular.module('appsadmin.admin', ['datatables', 'datatables.bootstrap', 'ngResource','ui.bootstrap'])

/**
 * Controller for Appsadmin Administration Screen
 */
.controller('AdminCtrl', [ '$rootScope', function($rootScope) {
	
	var vm = this;
	
}])

.controller('UsersCtrl', [ '$rootScope', 'userService', 'applicationService', function($rootScope, userService, applicationService) {
	
	var vm = this;
	vm.users = userService.query({ appname: $rootScope.appname });
	var applications = applicationService.query(null, function() {
		vm.applications = applications._embedded['applications'];
	});
	
	/**
	 * Associates users with the applications
	 */
	vm.saveApplicationUsers = function() {
		console.debug("Saving application users");
		console.debug('vm.applications', vm.applications)
		console.debug('vm.users', vm.users)
	}
	
}]);