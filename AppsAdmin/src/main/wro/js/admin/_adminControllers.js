angular.module('appsadmin.admin', ['ngResource','ui.bootstrap','appsadmin.adminjs','appsadmin.typesjs'])

/**
 * Controller for Appsadmin Administration Screen
 */
.controller('AdminCtrl', ['adminjs','supportedLocales', function(adminjs, supportedLocales) {
	var vm = this;
	vm.supportedLocales = supportedLocales;
	
	adminjs();
}])
 
/**
 * Controller for Appsadmin Types Screen
 */
.controller('TypesCtrl', ['typesjs', function(typesjs) {
	var vm = this;
	
	typesjs();
}])

.controller('UsersCtrl', [ '$rootScope', '$timeout', 'userService', 'applicationService','applicationUserService', 
                           function($rootScope, $timeout, userService, applicationService, applicationUserService) {
	
	var vm = this;
	var applications;
	vm.saved = false, vm.error = false;
	
	vm.users = userService.query({ appname: $rootScope.appname });
	var queryApplications = function() {
		var applications = applicationService.query(function() {
			vm.applications = new applicationService(applications._embedded ? applications._embedded['applications'] : {});
		});
	}
	queryApplications();
	
	/**
	 * Associates users with the applications
	 */
	vm.saveApplicationUsers = function() {
		console.debug("Saving application users");

		// building a list of userId + aplicationId pairs
		var applicationUsers = [];
		for (var k in vm.applications) {
			for (var j in vm.applications[k].applicationUserIds) {
				if (vm.applications[k].applicationUserIds[j]) {
					var lineObj = {};
					lineObj.userId = parseInt(j);
					lineObj.application = {applicationId: vm.applications[k].applicationId};
					applicationUsers.push(lineObj);
				}
			}
		}

		/**
		 * Save the entries
		 */
		applicationUserService.save(applicationUsers,
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