angular.module('manageUserNeedController',['designcontrolServices','adminServices'])
.controller('manageUserNeedCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	DC.getUsrNeed().then(function (data) {
		if(data.data.success){
			$scope.userneeds = data.data.userneed;
		}
		else{
			$scope.userneeds = false;
		}

	});

	$scope.addUsrNeed = function (usrneed) {
		DC.addUsrNeed(usrneed).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/manageuserneed')
			}
			else{
				$scope.errorMsg = data.data.message;
			}
		});

		

	}
	
})

.controller('manageriskCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.addRisk = function (risk) {
		DC.addRisk(risk).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managerisk')
			}
			else{
				$scope.errorMsg = data.data.message;
			}
		});

	}
	
})

.controller('managediCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.userneeds = false;
	DC.loadusrandrisk().then(function (data) {
		if(data.data.success){
			$scope.userneeds = data.data.need;
		}
		else{
			$scope.userneeds = false;
		}

	});

	DC.loadDi().then(function (data) {
		if(data.data.success){
			$scope.designinputs = data.data.designinput;
		}
		else{
			$scope.userneeds = false;
		}

	});


	$scope.addDi = function (di) {
		DC.addDi(di).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/manageuserneed')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});

	}
})


.controller('managedoCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.userneeds = false;
	DC.loadDi().then(function (data) {
		if(data.data.success){
			$scope.designinputs = data.data.designinput;
		}
		else{
			$scope.userneeds = false;
		}

	});

	$scope.addDo = function (desop) {
		DC.addDo(desop).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedo')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});


	}
})

.controller('managedvaCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.userneeds = false;
	DC.getUsrNeed().then(function (data) {
		if(data.data.success){
			$scope.userneeds = data.data.userneed;
		}
		else{
			$scope.userneeds = false;
		}

	});

	$scope.addDva = function (dva) {
		console.log(dva);
		DC.addDva(dva).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedva')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});

	}
})


.controller('managedveCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.userneeds = false;
	DC.loadDi().then(function (data) {
		if(data.data.success){
			$scope.designinputs = data.data.designinput;
		}
		else{
			$scope.userneeds = false;
		}

	});

	$scope.addDve = function (dve) {
		DC.addDve(dve).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedva')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});

	}
});

