angular.module('adminController',['userServices','adminServices'])
.controller('manageStationCntrl',function ($http,$window,$location,$timeout,$mdDialog,$scope,Admin) {
	var app = this;
	$scope.stations = [];
	$scope.nostation=false;
	Admin.viewStation().then(function (data) {
		if(data.data.success){
			$scope.stations=data.data.stations;

		}
		else{
			$scope.nostation=true;

		}
	});
	app.loader = false;
	app.successMsg = false;
	app.errorMsg = false;
	app.showOnEditStation = false;
	app.editloader = false;
	app.editsuccessMsg = false;
	app.editerrorMsg = false;
	app.editstation = {};
	$scope.form={};
	//function for add user form submission
	this.addStation = function (stationData) {
		Admin.addStation(this.stationData).then(function (data) {
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loader = true;
				$timeout(function () {
					app.loader = false;
					$scope.myTabIndex =0;
					Admin.viewStation().then(function (data) {
						if(data.data.success){
							$scope.stations=data.data.stations;

						}
						else{
							$scope.nostation=true;

						}
					});
					app.stationData ={};
					$scope.form.addStation.$setPristine();
					$scope.form.addStation.$setUntouched();
					app.errorMsg = false;
					$location.path('/admin/managestations');
				},1500);
			}
			else{
				app.errorMsg=data.data.message;
				app.loader = false;
			}
		});
	};

	//function to provide edit station tab and hide add station tab
	this.showEditStation = function (station) {
		app.showOnEditStation = true;
		app.editloader = false;
		$scope.myTabIndex = $scope.myTabIndex +1; //to move tp next tab
		app.editstation = station;
	};
	//form submission after edit
	this.editStation = function (editstation) {
		Admin.editStation(this.editstation).then(function(data) {
			if(data.data.success){
				app.editloader = true;
				app.editsuccessMsg = data.data.message;
				$timeout(function () {
					app.loader = false;
					$scope.myTabIndex =0;
					Admin.viewStation().then(function (data) {
						if(data.data.success){
							$scope.stations=data.data.stations;

						}
						else{
							$scope.nostation=true;

						}
					});
					app.editstation ={};
					$scope.form.editStation.$setPristine();
					$scope.form.editStation.$setUntouched();
					app.showOnEditStation = false;
					app.editloader = false;
					app.editsuccessMsg = false;
					$location.path('/admin/managestations');
				},3000);
			}
			else{
				app.editerrorMsg=data.data.message;
				app.editloader = false;
			}
		});
		
	};



	//when cancel the edit tab
	this.cancel=function () {
		app.showOnEditStation = false;
		$location.path('/admin/managestations');
	};


		//function for deleteting an user by admin show a dialog box and delte on confirm
		this.showConfirmdeleteStation = function(ev,station) {
		  // Appending dialog to document.body to cover sidenav in docs app
		  var confirm = $mdDialog.confirm({
		  	onComplete: function afterShowAnimation() {
	                        var $dialog = angular.element(document.querySelector('md-dialog'));
	                        var $actionsSection = $dialog.find('md-dialog-actions');
	                        var $cancelButton = $actionsSection.children()[0];
	                        var $confirmButton = $actionsSection.children()[1];
	                        angular.element($confirmButton).addClass('md-raised md-warn');
	                        angular.element($cancelButton).addClass('md-raised');
	                    }
	            })
		        .title('Would you like to delete '+station.stationname)
		        .textContent('This will remove '+station.stationname+' permanantly from database')
		        .ariaLabel('Lucky day')
		        .targetEvent(ev)
		        .ok('Yes, Delete!')
		        .cancel('No, Keep Station');

		  $mdDialog.show(confirm).then(function() {
		  	Admin.deleteStation(station).then(function (data) {
		  		if(data.data.success){
		  			$scope.myTabIndex =0;
		  			Admin.viewStation().then(function (data) {
		  				if(data.data.success){
		  					$scope.stations=data.data.stations;

		  				}
		  				else{
		  					$scope.nostation=true;

		  				}
		  			});
		  			$location.path('/admin/managestations');
		  		}
		  	});

		  }, function() {

		  });
		};
		$scope.reload =  function () {
			app.showOnEditStation = false;
		}


});
