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
	$scope.showOneditUn = false;
	$scope.showeditUn = function (usrneed) {
		$scope.eusrData={userneed:usrneed.data,id:usrneed._id}
		$scope.id=usrneed._id
		$scope.showOneditUn = true;
	}
	$scope.editUsrNeed = function (editusrneed) {
		DC.editUsrNeed(editusrneed).then(function (data) {
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
	$scope.deleteUn = function (usrneed) {
		DC.deleteUn(usrneed).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/manageuserneed')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

	}

	$scope.printIt = function(){
	   var innerContents = document.getElementById('printArea').innerHTML;
	          var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
	          popupWinindow.document.open();
	          popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
	          popupWinindow.document.close();
	};


	
})

.controller('manageriskCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.vals=[0,1,2,3,4];
	$scope.sysvals=["COMMUNICATION","ENVIRONMENTAL","ELECTRICAL","SOFTWARE","MECHANICAL","USE","PRODUCTION","OTHERS"];
	$scope.riskData={severity:0,probability:0,riskindex:"LOW",sys:"ONE"};
	DC.loadRisk().then(function (data) {
		if(data.data.success){
			$scope.riskDataView= data.data.risks;
		}
		else{
			$scope.riskDataView = false;
		}

	});

	
	function retriskIndex(sev,prob){
					var riskin = [
			  			[0,0,0,0,1],
			 			[0,0,0,1,2],
			 			[0,0,1,1,2],
			 			[0,1,1,2,2],
			 			[0,1,2,2,2],
						];
						var riskindex=riskin[prob][sev];
						if(riskindex==0){
							return "LOW";
						}else if (riskindex==1){
							return "MEDIUM";
						}else{
							return "HIGH";
						}
	}
	$scope.riskData.riskindex=retriskIndex($scope.riskData.severity,$scope.riskData.probability);
	
	$scope.valChange = function () {
	$scope.riskData.riskindex=retriskIndex($scope.riskData.severity,$scope.riskData.probability);

	}

	$scope.evalChange = function () {
	$scope.eriskData.riskindex=retriskIndex($scope.eriskData.severity,$scope.eriskData.probability);
	}
	
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
	$scope.showOneditRisk = false;
	$scope.showeditRisk = function (risk) {
		$scope.showOneditRisk = true;
		$scope.eriskData={
			id:risk._id,
			data:risk.data,
			cause:risk.cause,
			severity:risk.severity,
			probability:risk.probability,
			riskindex:risk.riskindex,
			riskcontrol:risk.riskcontrol,
			system:risk.system,
		}
		console.log(risk);
	}
	$scope.editRisk = function (risk) {
		console.log(risk);
		DC.editRisk(risk).then(function (data) {
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
	$scope.deleteRisk = function (risk) {
		DC.deleteRisk(risk).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managerisk')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

	}
	
})

.controller('managediCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	$scope.userneeds = false;
	$scope.typevals=["FUNCTIONAL","PERFORMANCE","SAFTEY","INTERFACE","USABILITY","REGULATORY"];
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
			//console.log(data.data.designinput);
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
				$route.reload('/managedi')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});

	}

	$scope.showOneditDi = false;
	$scope.showeditDi = function (designinput) {

		$scope.ediData={
			di:designinput.data,
			id:designinput._id,
			type:designinput.type,
		}
		if(designinput._usr){
			$scope.ediData.idu=designinput._usr._id;
		
		}else{
			$scope.ediData.idu=designinput._risk._id;
			
		}

		$scope.showOneditDi = true;
	}
	$scope.editDi = function (di) {
		DC.editDi(di).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedi')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});
	}

	$scope.deleteDi = function (designinput) {
		DC.deleteDi(designinput).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedi')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

	}


})


.controller('managedoCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	$scope.systemvals=["ELECTRONICS","MECHANICAL","SOFTWARE","PACKAGE","PRODUCTION","INSTALLATION"];
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

	DC.loadDo().then(function (data) {
		if(data.data.success){
			$scope.designoutputs = data.data.designoutput;
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


	$scope.showOneditDo = false;
	$scope.showeditDo = function (designoutput) {
		console.log(designoutput);
		$scope.edoData={do:designoutput.data,id:designoutput._id,system:designoutput.system}
		$scope.ediData.di=designoutput._di.data;
		$scope.showOneditDo = true;
	}

	$scope.editDo = function (desop) {
		console.log(desop);
		DC.editDo(desop).then(function (data) {
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

	$scope.deleteDo = function (designoutput) {
		DC.deleteDo(designoutput).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedo')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

	}

})

.controller('managedvaCntrl',function ($http,$route,$window,$location,$timeout,$mdDialog,$scope,DC) {
	var app = this;
	$scope.successMsg = false;
	$scope.errorMsg = false;
	$scope.loader = false;
	app.refuserneeds = false;
	DC.getUsrNeed().then(function (data) {
		if(data.data.success){
			$scope.refuserneeds = data.data.userneed;
		}
		else{
			app.refuserneeds = false;
		}

	});
	DC.loadDva().then(function (data) {
		if(data.data.success){
			$scope.dvas = data.data.dva;
			console.log(data.data);
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

	$scope.showOneditDva = false;
	$scope.showeditDva = function (dva) {
		$scope.edvaData={dva:dva.data,id:dva._id}
		$scope.showOneditDva= true;
	}

	$scope.editDva = function (dva) {
		DC.editDva(dva).then(function (data) {
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
	$scope.deleteDva = function (dva) {
		DC.deleteDva(dva).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedva')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

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
	DC.loadDve().then(function (data) {
		if(data.data.success){
			$scope.dves = data.data.dve;
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
				$route.reload('/managedve')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});

	}
	$scope.showOneditDve = false;
	$scope.showeditDve = function (dve) {
		$scope.edveData={dve:dve.data,id:dve._id}
		$scope.showOneditDve= true;
	}



	$scope.editDve = function (dve) {
		DC.editDve(dve).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedve')
			}
			else{
				$scope.errorMsg = data.data.message;

			}

		});
	}
	$scope.deleteDve = function (dve) {
		DC.deleteDve(dve).then(function (data) {
			if(data.data.success){
				$scope.successMsg = data.data.message;
				$scope.loader = true;
				$route.reload('/managedve')
			}
			else{
				$scope.errorMsg = data.data.message;
			}

		})

	}
});

