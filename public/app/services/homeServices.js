angular.module('homeServices',[])
.factory('Home',function ($http) {
	homeFactory={};
	homeFactory.getTrace = function () {
		return $http.get('/api/trace');
	}

	return homeFactory;
});
