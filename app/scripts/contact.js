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
			
				$scope.cityDropdown = {
						data: [{name:'Branptom'},{name:'Kitchener'},{name:'Waterloo'}, {name:'Toronto'} ],
						opt:{
							placeholder:'Please Select ...',
							textField: 'name',
							valueField: 'name'
						},
						selected:{
							'text':'Please Select ...',
							'val':''
						}
					}
				
				$scope.types = [{
					    opt: { title: 'AC', enabled: true },
					    checked: true,
					    onAfter: function (bChecked) {
					        //alert(bChecked ? 'Checked' : 'Unchecked');
					    }
					}];
			
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
			
			// s - "2016-04-28T19:43:50.415Z"
			function getCurrDTStr(){
				var dt = new Date();
			    var s = dt.toISOString();
				return s.split('.')[0].replace(/T/g, ' ');
			}
			
			//------------------------------------------------------------------------------------
			// submit, anonymouse can submit a message
			//------------------------------------------------------------------------------------
			$scope.postMsg = function () {
			    
				if($scope.msg.from!='' && $scope.msg.text!=''){
				    $scope.msg.dt = getCurrDTStr();
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
			
			$scope.init();
		}]);