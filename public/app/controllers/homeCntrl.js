angular.module('homeController',['homeServices'])
.controller('homeCntrl',function ($http,$route,$scope,$rootScope,$interval,$window,$location,$timeout,$mdDialog,$scope,Home) {
	$scope.systemvals=["ELECTRONICS","MECHANICAL","SOFTWARE","PACKAGE","PRODUCTION","INSTALLATION"];
	$scope.data= false;
	Home.getTrace().then(function (data) {
		if(data.data.success){
			$scope.data = data.data.designinput;
		}
	});



});
 