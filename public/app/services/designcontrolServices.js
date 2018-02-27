angular.module('designcontrolServices',[])
.factory('DC',function ($http) {
	DCFactory={};
	DCFactory.getUsrNeed = function () {
		return $http.get('/api/userneed');
	}
	DCFactory.addUsrNeed = function (userneed) {
		return $http.post('/api/userneed',userneed);
	}
	DCFactory.editUsrNeed = function (userneed) {
		return $http.put('/api/userneed',userneed);
	}
	DCFactory.deleteUn = function (userneed) {
		return $http.delete('/api/userneed',{params:{usrid:userneed._id}});
	}

	DCFactory.addRisk = function (risk) {
		return $http.post('/api/risk',risk);
	}
	DCFactory.loadRisk = function (risk) {
		return $http.get('/api/risk',risk);
	}
	DCFactory.editRisk = function (risk) {
		return $http.put('/api/risk',risk);
	}
	DCFactory.deleteRisk = function (risk) {
		return $http.delete('/api/risk',{params:{id:risk._id}});
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
	DCFactory.editDi = function (di) {
		return $http.put('/api/designinput',di);
	}
	DCFactory.deleteDi = function (designinput) {
		return $http.delete('/api/designinput',{params:{diid:designinput._id}});
	}

	DCFactory.addDo = function (desop) {
		return $http.post('/api/designoutput',desop);
	}

	DCFactory.loadDo = function () {
		return $http.get('/api/designoutput');
	}
	DCFactory.editDo = function (desop) {
		return $http.put('/api/designoutput',desop);
	}
	DCFactory.deleteDo = function (designoutput) {
		return $http.delete('/api/designoutput',{params:{doid:designoutput._id}});
	}

	DCFactory.addDva = function (dva) {
		return $http.post('/api/designvalidation',dva);
	}
	DCFactory.loadDva = function () {
		return $http.get('/api/designvalidation');
	}
	DCFactory.editDva = function (dva) {
		return $http.put('/api/designvalidation',dva);
	}
	DCFactory.deleteDva = function (dva) {
		return $http.delete('/api/designvalidation',{params:{dvaid:dva._id}});
	}
	DCFactory.addDve = function (dve) {
		return $http.post('/api/designverification',dve);
	}
	DCFactory.loadDve = function () {
		return $http.get('/api/designverification');
	}
	DCFactory.editDve = function (dve) {
		return $http.put('/api/designverification',dve);
	}
	DCFactory.deleteDve = function (dve) {
		return $http.delete('/api/designverification',{params:{dveid:dve._id}});
	}
	return DCFactory;
});