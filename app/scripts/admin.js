'use strict';

angular.module('admin', [])

.controller('AdminController',
		[ '$http', '$scope', '$rootScope', '$location', 'MainService', '$window', 
		  function($http, $scope, $rootScope, $location, $ms, $window ) {
			
			$scope.menu = {
					opt:{
						padding:10,
						maxchars:30
					},
					data:[{text:'Message Management'}, 
						  //{text:'Advanced'}
					]
				}
			
/*			$scope.menu = {
					data: [//{name:'User Management', val:'user'},
					       {name:'Message Management', val:'msg'}
					       //{name:'Picture Manangement', val:'img'}, 
					       //{name:'Traffic Tracking', val:'traffic'},
					       //{name:'Payment Management', val:'payment'}
					       ],
					opt: {
						textField:'name',
						valueField:'val',
						template:'<div>Hi, </div><div>{{name}}</div>'
					},
					selected:{
						'text':'User Management',
						'val':'User Management'
					}, 
					onSelect:function(item){
						$('.mgr-page').hide();
						$('#'+item.val +'-manager').show();
					}
				}*/
			
			$scope.userGrid = {
					data: [{username:'admin', email:'likzhang@gmail.com'}],
					opt:{
						fields: [{name:'username', text:'Username', width:'180px'}, 
							{name:'email', text:'Email', width:'250px'}]
					},
					selected:{username:'admin', email:'likzhang@gmail.com'}, 
					onSelect:function(item){
						
					}
				}
			
			$scope.msgGrid = {
					data: [],
					opt:{
						fields: [{name:'dt', text:'Time', width:'170px'},
						         {name:'from', text:'From', width:'160px'}, 
						         {name:'text', text:'Message', width:'320px'}]
					},
					selected:{dt:'', from:'', msg: ''}, 
					onSelect:function(item){
						$scope.item = item;
					}
				}
			
			getMessage({}, function(d){
				$scope.msgGrid.data = d.messages;
				if(d.messages){
					$scope.item = d.messages[0];
				}
				//setTimeout(function(){
				//	$scope.$apply();
				//},0);
			}, function(d){
				if(d && d.message){
					$location.path('/login');
					//alert(d.message);
				}
			});
			

			
			$scope.imgGrid = {
				data: [{ fname:'Calgray', fpath:'Alberta', updated:'2016-04-22:15:30:21'}],
				opt:{
					fields: [{name:'fname', text:'File Name', width:'180px'}, 
						{name:'fpath', text:'File Path', width:'250px'},
						{name:'updated', text:'Last Updated', width:'250px'}
						]
				},
				selected:{ fname:'Calgray', fpath:'Alberta', updated:'2016-04-22:15:30:21'}, 
				onSelect:function(item){
					
				}
			}
			
			function getMessage(query, successCb, failCb){
				var token = $ms.getSessionItem('token');
				
				// Get all messages
			    $http.post(cfg.apiUrl + '/getMessages', {'token': token, 'query': {}}).success(function (data) {
			    	if(data.success){
	                    if(successCb)
	                    	successCb(data);
			    	}else{
						if(failCb)
							failCb(data);
			    	}
				}).error(function(data, status, header, config){
					if(failCb)
						failCb(data);
				});
			}
			
			//init
			$('.mgr-page').hide();
			$('#' + $scope.menu.data[0].val + '-manager').show();

		}]);			

