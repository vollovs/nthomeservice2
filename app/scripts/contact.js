//------------------------------------------------------
// Author: zlkca
// Date: April 25 2016
// License: MIT
//------------------------------------------------------

'use strict';

angular.module('main')

.controller('ContactController',
		[ '$http', '$scope', '$rootScope', //'MapService', 
		  '$location', 'MainService',
		  function($http, $scope, $rootScope, //$map, 
				  $location,  $ms ) {

			//$ms.resize();
			
			$scope.init = function() {
		    	//MapService.drawMap({id: 'contact-map-canvas', marker:{title:'Westudents.ca', address:'1087 Foxcreek Rd, London, ON, Canada'}});
			}

			
			// var msg = { 'text': $scope.msg.text, 'dt': dt, 'from': '', 'to': 'admin' };
			function _postMessage(msg, successCb, failCb){
 
			    $http.post(cfg.apiUrl + '/saveMessage', msg).success(function () {
                    if(successCb)
                    	successCb();
				}).error(function(){
					if(failCb)
						failCb();
				});
			}
			
			//------------------------------------------------------------------------------------
			// submit, anonymouse can submit a message
			//------------------------------------------------------------------------------------
			$scope.postMsg = function () {
			    
				if($scope.msg.from!='' && $scope.msg.text!=''){
					var dt = new Date();
				    $scope.msg.dt = dt.toISOString();
				    $scope.msg.to = 'admin';
				    
					_postMessage($scope.msg, function(){
						//$scope.msg.from = '';
						//$scope.msg.text = '';
						alert('Post Feedback successful! \nThank you! We will read your message and write back soon.')
					})
				}else{
					alert('Email and message cannot be empty.')
				}
			}
			
			function validate(values){
				var rules = {
						'message':{ 
							'required' : {},
							'validChars' : {},
							'maxlength': {'params': 4096}
							}, //end of description
						'email':{
								'validChars' : {},
								'mustLeaveEmail': {
									'func': function(){
										return $scope.mb.email!='';
									},
									'message': 'You must provide email.'
								}
							}, //end of email
						'name':{
							'required' : {},
							'validChars' : {},
							'maxlength': {'params': 4096}
							}, //end of phone
						}
				
				//return ValidateService.validate(values, rules);
			}
			
			// Display error message from back end
			function errorsHandler(errors){
				var fields = Object.keys(errors);				
			}
			
		}]);