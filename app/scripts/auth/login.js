'use strict';


var SESSION_TIMEOUT = 20 * 60 * 1000;

angular.module('auth',[])

.controller('LoginController',[
				'$scope',
				'$rootScope',
				'$http',
				'$location',
				'$timeout',
				'MainService',
				function($scope, $rootScope, $http, $location, $timeout, $ms) {
			
					var Error = {
							NONE:0,
							ACCOUNT_NOT_EXIST:1,
							PASSWORD_MISMATCH:2,
							ACCOUNT_EMPTY:3,
							EMAIL_EMPTY:4,
							INVALID_EMAIL:5,
							EMAIL_EXISTS:6,
							USERNAME_EMPTY:7,
							PASSWORD_EMPTY:8,
							PASSWORD_TOO_SIMPLE:9,
							ENCRYPT_PASSWORD_EXCEPTION:10,
							UPDATE_USER_EXCEPTION:11
					};
					
					$ms.resize();
					
					$scope.login = {account:'', password:'', remember:true};
					$scope.error = {account:'', password:''};
					
					$scope.$watch("login.account", function(newVal, oldVal){
						if(newVal){
							$scope.error.account = "";
						}
					});
					
					$scope.$watch("login.password", function(newVal, oldVal){
						if(newVal){
							$scope.error.password = "";
						}
					});
					
					
					$scope.submit = function() {
						cleanErrorMessage();
						var crypt = $ms.getCrypt();
						var param = {
							'account': $scope.login.account, 
							'password': crypt.encrypt($scope.login.password),
							'remember': $scope.login.remember
						}
						$http.post(cfg.apiUrl + '/login', param).success(
								function(data, status) {
									if(data.errors && data.errors.length > 0){
										$rootScope.$broadcast("OnUpdateHeader");
										setErrorMessage(data.errors);
									}else{
										if(data.token == ''){
											setErrorMessage(data.errors);
											$location.path('/login');
										}else{
											loginSuccessHdlr(data);
										}										
									}
								}).error(
									function(data, status, headers, config) {
										setErrorMessage(data.errors);
										$rootScope.$broadcast("OnUpdateHeader");
										$location.path('/login');
								});
					}// End of submit()
				

					
				  $scope.$on("onCountDownLogoutDialog", function(event,args){
						/*$timeout(function(){
							$scope.openLogoutDialog();
						}, SESSION_TIMEOUT);*/
				  });
				  //-----------------------------------------------------------
				  // size: lg, sm
				  //-----------------------------------------------------------
				  /*
				  $scope.openLogoutDialog = function (size) {
					    var modalInstance = $modal.open({
					    	templateUrl: 'scripts/components/dialog/dialog.html',//'logoutModalContent.html',
					    	controller: 'logoutDlgController',
					    	backdrop: 'static',
					    	size: size
					    });

					    modalInstance.result.then(
						    function () {
						    	// ok promise
						    	$rootScope.$broadcast('onLogout');
						    	
						    }, function () {
						    	// dismiss promise
						    	$scope.$broadcast('onCountDownLogoutDialog');
						    	//$log.info('Modal dismissed at: ' + new Date());
						    });
					    
				  };
				  */
				  
				  	//---------------------------------------------------------------------------
					// Private methods
					//---------------------------------------------------------------------------
				  	function loginSuccessHdlr(data){
						$ms.setSessionItem('token', data.token);
						$ms.setSessionItem('user', data.decoded);
						$rootScope.$broadcast("OnUpdateHeader");
						//startTokenRefreshTask();
						
						if(data.decoded.username == 'admin'){
							$location.path('/admin');
						}else{
							$location.path('/');
						}
				  	}
				  
					function cleanErrorMessage(){
						$scope.error.account = "";
						$scope.error.password = "";
					}
					
					function setErrorMessage(errors){

						if(errors.indexOf(Error.ACCOUNT_EMPTY) != -1){
							$scope.error.account = "Please enter the username or email you signed up.";
						}else{
							if(errors.indexOf(Error.ACCOUNT_NOT_EXIST) != -1){
								$scope.error.account = "Username or email does not exist, please try another.";
							}else{
								$scope.error.account = "";
							}
						}
						
						if(errors.indexOf(Error.PASSWORD_MISMATCH) != -1){
							$scope.error.password = "The password is incorrect.";
						}else{
							$scope.error.password = "";
						}
					}
					
					function startTokenRefreshTask(){
						var t = $ms.getSessionItem('token');
						
						if(t){
							var tokenInterval = setInterval(function(){
								var token = $ms.getSessionItem('token');
								$ms.renewToken(token, function(newToken, errMsg){
									if(newToken){
										$ms.setSessionItem('token', newToken);
									}else{
										var tokenInterval = $ms.getSessionItem('tokenInterval');
										clearInterval(tokenInterval);
										
										//if(loggedIn)
											//alert(errMsg);
									}
								})
							}, 4*60000);
						
							$ms.setSessionItem('tokenInterval', tokenInterval);
						}
					}
					
				} ])	
/*
.controller('logoutDlgController', [ '$scope', '$modalInstance', function ($scope, $modalInstance) {
	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);
*/
