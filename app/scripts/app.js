'use strict';
                      
/* create root module */
angular.module('myApp', ['ngResource', 'ngRoute', 'ngCookies', //'ngSanitize', 'ngTouch', 'ngAnimate',
                                 'pascalprecht.translate', 'main', 'auth', 'zui',  'admin'//,'wsui'
                           ])
//-------------------------------------------------------------------------------
// Get executed during the provider registrations and configuration phase. 
// Only providers and constants can be injected into configuration blocks.
//-------------------------------------------------------------------------------
.config(['$routeProvider', '$translateProvider' ,  function($routeProvider, $translateProvider){

    $routeProvider
	   //.when('/', {
	   //   templateUrl: '/views/home.html',
	   //})
	   .when('/login',{
		 templateUrl: '/views/login.html'
	   })
	   .when('/signup',{
		 templateUrl: '/views/signup.html'
	   })
	   .when('/admin',{
			 templateUrl: '/views/admin.html'
	   })
	  // .when('/forgetPassword',{
			// templateUrl: '/views/forget-password.html',
			// controller: 'ForgetPasswordController'		
	  // })
	  // .when('/resetPassword',{
			// templateUrl: '/views/reset-password.html',
			// controller: 'ResetPasswordController'		
	  // })
	  // .when('/passwordStatus',{
			// templateUrl: '/views/reset-password-status.html',
			// controller: 'PasswordStatusController'		
	  // })
	   .when('/', {
			templateUrl : '/views/public/home.html'
		}).when('/contacts', {
			templateUrl : '/views/public/contacts.html'
		}).when('/ac', {
			templateUrl : '/views/public/ac.html'
		}).when('/rebate', {
			templateUrl : '/views/public/rebate.html'
		}).when('/water-heater', {
			templateUrl : '/views/public/water-heater.html'
		}).when('/furnace', {
			templateUrl : '/views/public/furnace.html'
		}).when('/services', {
			templateUrl : '/views/public/services.html'
		}).when('/about', {
			templateUrl : '/views/public/about.html'
		}).when('/products', {
			templateUrl : '/views/public/products.html'
		}).when('/community', {
			templateUrl : '/views/public/community.html'
		}).when('/500', {
			templateUrl : '/views/public/500.html'
		}).otherwise({
			redirectTo : '/'
		});
    // Translation
    //$translateProvider.translations('en_US', en_US );  
    //$translateProvider.translations('zh_CN', zh_CN );
    
    //$translateProvider.preferredLanguage('en_US');
}]);

