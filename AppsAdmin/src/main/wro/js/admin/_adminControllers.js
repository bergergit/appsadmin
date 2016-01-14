angular.module('appsadmin.admin', ['datatables', 'datatables.bootstrap', 'ngResource','ui.bootstrap'])

/**
 * Controller for Appsadmin Administration Screen
 */
.controller('AdminCtrl', [ '$rootScope', function($rootScope) {
	
	var vm = this;
	
}])

.controller('UsersCtrl', [ '$rootScope', '$timeout', 'userService', 'applicationService','applicationUserService', 
                           function($rootScope, $timeout, userService, applicationService, applicationUserService) {
	
	var vm = this;
	var applications;
	vm.saved = false, vm.error = false;
	
	vm.users = userService.query({ appname: $rootScope.appname });
	var queryApplications = function() {
		var applications = applicationService.query(function() {
			vm.applications = new applicationService(applications._embedded['applications']);
		});
	}
	queryApplications();
	
	
	
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
				if (vm.applications[k].applicationUserIds[j]) {
					var lineObj = {};
					lineObj.userId = parseInt(j);
					lineObj.application = {applicationId: vm.applications[k].applicationId};
					//lineObj.application_applicationId = vm.applications[k].applicationId;
					applicationUsers.push(lineObj);
				}
			}
		}
		
		console.debug('applicationUsers', applicationUsers)

		/**
		 * Save the entries
		 */
		applicationUserService.save(applicationUsers[0],
			function(response) {
				// display flash message and hides it after all 
				vm.saved = true;
				vm.error = false;
				$timeout(function() {
					vm.saved = false;
				}, 5000);
				queryApplications();
			 }, function(error) {
				vm.error = true;
				console.debug("Error on save", error);
			 }
		);
	}
	
}]);