angular.module('homeController',['homeServices'])
.controller('homeCntrl',function ($http,$route,$scope,$rootScope,$interval,$window,$location,$timeout,$mdDialog,$scope,Home) {
	$scope.data= false;
	Home.getTrace().then(function (data) {
		if(data.data.success){
			$scope.data = data.data.designinput;
		}
	});



});
 