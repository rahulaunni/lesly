angular.module('designcontrolServices',[])
.factory('DC',function ($http) {
	DCFactory={};
	DCFactory.getUsrNeed = function () {
		return $http.get('/api/userneed');
	}
	DCFactory.addUsrNeed = function (userneed) {
		return $http.post('/api/userneed',userneed);
	}
	DCFactory.addRisk = function (risk) {
		return $http.post('/api/risk',risk);
	}
	DCFactory.loadRisk = function (risk) {
		return $http.get('/api/risk',risk);
	}

	DCFactory.loadusrandrisk = function () {
		return $http.get('/api/loadusrandrisk');
	}
	DCFactory.addDi = function (di) {
		return $http.post('/api/designinput',di);
	}
	DCFactory.loadDi = function () {
		return $http.get('/api/designinput');
	}
	DCFactory.addDo = function (desop) {
		return $http.post('/api/designoutput',desop);
	}
	DCFactory.addDva = function (dva) {
		return $http.post('/api/designvalidation',dva);
	}
	DCFactory.addDve = function (dve) {
		return $http.post('/api/designverification',dve);
	}
	return DCFactory;
});