angular.module('nurseController',['authServices','userServices','adminServices','nurseServices'])
.controller('nurseCntrl',function ($http,$route,$scope,$rootScope,$window,$location,$timeout,$mdDialog,$scope,Auth,Admin,Nurse) {
	var app = this;
	//to provide all stations to nurse user
	$scope.stations = [];
	$scope.nostation=false;
	Nurse.viewStation().then(function (data) {
		if(data.data.success){
			$scope.stations=data.data.stations;

		}
		else{
			$scope.nostation=true;

		}
	});

	//user select a station and in service call a setstation route 
	this.selectStation = function (selectstationData) {
		console.log(this.selectstationData);
		Nurse.setStation(this.selectstationData).then(function (data) {
			if(data.data.success){
				app.selected=true;
				$location.path('/');
			}
			else{
				$location.path('/selectstation')
			}
		});

	};

	//redirect user if no station selected
	Auth.getUser().then(function (data) {
		if(!data.data.station){
			$location.path('/selectstation')
		}

	});	

})
.controller('managePatientCntrl',function ($http,$route,$scope,$rootScope,$window,$location,$timeout,$mdDialog,$scope,Auth,Admin,Nurse) {
	var app = this;
	$scope.beds = [];
	$scope.nobed=false;
	//function called on page load gives all the stations associated with the user to frontend
	Nurse.viewBed().then(function (data) {
		if(data.data.success){
			$scope.beds=data.data.beds;

		}
		else{
			$scope.nobed=true;

		}
	});
	$scope.doctors = [];
	$scope.nodoctor=false;
	//function called on page load gives all the stations associated with the user to frontend
	Nurse.viewDoctor().then(function (data) {
		if(data.data.success){
			$scope.doctors=data.data.doctors;

		}
		else{
			$scope.nodoctor=true;

		}
	});

	app.loader = false;
	app.successMsg = false;
	app.errorMsg = false;
	app.editloader = false;
	app.editsuccessMsg = false;
	app.editerrorMsg = false;
	this.addPatient = function (patientData) {
		Nurse.addPatient(this.patientData).then(function (data) {
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loader = true;
				$timeout(function () {
					app.loader = false;
					$window.location.reload('/nurse/managepatients');
				},3000);
			}
			else{
				app.errorMsg=data.data.message;
				app.loader = false;
			}
		});

	};
	app.patient = false;
	app.showOnAddMedication = false;
	this.showAddMedication = function (patientData) {
		Nurse.addPatient(this.patientData).then(function (data) {
			if(data.data.success){
				app.patient=data.data.patient;
				$scope.choices.patientid=data.data.patient._id;
				app.successMsg = data.data.message;
				app.loader = true;
				app.showOnAddMedication = true;
				$scope.myTabIndex = $scope.myTabIndex +1; //to move tp next tab
			}
			else{
				app.errorMsg=data.data.message;
				app.loader = false;
			}
		});
		
	};



	//function to get time details
	  $scope.variables=[];
	  this.getTime = function (choice, ambutton, index,i) {
	  			$scope.variables[i][index] = !$scope.variables[i][index];//to toggle button action
	           if(!$scope.variables[i][index]){//checking whether button is sctive
	           	choice.time.push(ambutton);//save that time
	           }
	           else{
	           	var index = choice.time.indexOf(ambutton);//if button pressed again delete the time
	           	choice.time.splice(index, 1);
	            }
	       };
	$scope.variabless=[];
	this.getTimePM = function (choice, pmbutton, index,i) {
	         $scope.variabless[i][index] = !$scope.variabless[i][index];
	         if(!$scope.variabless[i][index]){
	         	choice.time.push(pmbutton);
	             //save the value to an array;
	         }
	         else{
	         	var index = choice.time.indexOf(pmbutton);
	         	choice.time.splice(index, 1);
	          }
	     };

	//function and variable to add more medicines

	$scope.ambuttons = [0,1,2,3,4,5,6,7,8,9,10,11];
	$scope.pmbuttons = [12,13,14,15,16,17,18,19,20,21,22,23];
	$scope.choices = [{id: 'choice1',time:[]}];	 
	$scope.addNewChoice = function() {
	   var newItemNo = $scope.choices.length+1;
	   $scope.choices.push({'id':'choice'+newItemNo,'time':[]});
	};
	   
	$scope.removeChoice = function() {
	   var lastItem = $scope.choices.length-1;
	   $scope.choices.splice(lastItem);
	};

	this.addMedication = function (patientId) {
		for(var key in $scope.choices){
			$scope.choices[key].patientid = patientId;
		}
		Nurse.addMedication($scope.choices).then(function (data) {
			console.log(data.data);
		});


	};



});
