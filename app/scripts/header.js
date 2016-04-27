'use strict';

angular.module('main')

.controller('HeaderController', [ '$scope', '$rootScope', '$http', '$location', 'MainService',
		  function( $scope, $rootScope, $http, $location, $ms) {

			//----------------------------------------------------------------------------------
			// Public methods
			//----------------------------------------------------------------------------------
			$scope.redirectTo = function(a){
				$location.path(a);
			}
						
			//--------------------------------------------------------------------
			// When navigate to the home page, init() will be called to 
			// 1. load filter from the cookie
			// 2. send http request to get the item list and save
			//--------------------------------------------------------------------
			function init(){
	            $scope.user = $ms.getSessionItem('user');
	            
	        	$scope.header = {
	        			data: [{ text:'Home', val:'home', active:true, click:function(){
	        						$location.path('/');
	        					}},
	        			       { text:'Admin', val:'home', active:false, click:function(){
	        			    	   $location.path('/admin');
	        			       }},
	        			       { text:'Login', val:'login', active:true, click:function(){
	        			    	   $location.path('/login');
	        			       }},
	        			       { text:'Logout', val:'logout', active:true, click:function(){
	        						var tokenInterval = $ms.getSessionItem('tokenInterval');
	        						$ms.setSessionItem('token', '');
	        						$ms.setSessionItem('user', '');
	        						
	        						var ti = $ms.getSessionItem('tokenInterval');
	        						clearInterval(ti);
	        						$ms.setSessionItem('tokenInterval','');
	        						
	        						//updateHeader();
	        						$location.path('/');
	        			       }},
	        			       ],
	        			opt:{
	        				title:'angularZ',
	        				home:function(){
	        					$location.path('/');
	        				}
	        			}
	        		}	
	            
			}
			
			init();
			
		} ])
