angular.module('homeController',['homeServices'])
.controller('homeCntrl',function ($http,$route,$scope,$rootScope,$interval,$window,$location,$timeout,$mdDialog,$scope,Home) {
	$scope.systemvals=["ELECTRONICS","MECHANICAL","SOFTWARE","PACKAGE","PRODUCTION","INSTALLATION"];
	$scope.data= false;
	Home.getTrace().then(function (data) {
		if(data.data.success){
			$scope.data = data.data.designinput;
		}
	});

	$scope.printIt = function(){
	   var innerContents = document.getElementById('printArea').innerHTML;
	          var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
	          popupWinindow.document.open();
	          popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../assets/css/style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
	          popupWinindow.document.close();
	};

});
 