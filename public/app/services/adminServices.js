angular.module('adminServices',[])
.factory('Admin',function ($http) {
	adminFactory={};
	//to add station calling api post
	adminFactory.addStation = function (stationData) {
		return $http.post('/api/admin/station',stationData);
	}
	//to view all the station
	adminFactory.viewStation = function (stationData) {
		return $http.get('/api/admin/station',stationData);
	}
	//to delete a station
	adminFactory.deleteStation = function (station) {
		return $http.delete('/api/admin/station',{params: {stationid: station._id}});
	}
	adminFactory.editStation = function (editstation) {
		return $http.put('/api/admin/station',editstation);
	}
	return adminFactory;
});