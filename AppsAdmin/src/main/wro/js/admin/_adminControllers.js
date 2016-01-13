angular.module('appsadmin.admin', ['datatables', 'datatables.bootstrap', 'ngResource','ui.bootstrap'])

/**
 * Controller for Appsadmin Administration Screen
 */
.controller('AdminCtrl', [ '$rootScope', function($rootScope) {
	
	var vm = this;
	
}])

.controller('UsersCtrl', [ '$rootScope', 'userService', 'applicationService','applicationUserService', function($rootScope, userService, applicationService, applicationUserService) {
	
	var vm = this;
	
	vm.saved = false;
	
	vm.users = userService.query({ appname: $rootScope.appname });
	var applications = applicationService.query(function() {
		vm.applications = new applicationService(applications._embedded['applications']);
	});
	
	/**
	 * Associates users with the applications
	 */
	vm.saveApplicationUsers = function() {
		console.debug("Saving application users");
		console.debug('vm.applications', vm.applications);
		
		// building a list of userId + aplicationId pairs
		var applicationUsers = [];
		for (var k in vm.applications) {
			for (var j in vm.applications[k].applicationUserIds) {
				var lineObj = {};
				lineObj.userId = parseInt(j);
				lineObj.application = {applicationId: vm.applications[k].applicationId};
				//lineObj.application_applicationId = vm.applications[k].applicationId;
				applicationUsers.push(lineObj);
			}
		}
		
		console.debug('applicationUsers', applicationUsers)

		applicationUserService.save(applicationUsers[0],
			function(response) {
				vm.saved = true;
			 }, function(error) {
				console.debug("Error on save", error);
			 }
		);
	}
	
}]);