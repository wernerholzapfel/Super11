/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */


MetronicApp.controller('TableRegCtrl', function ($scope) {

});


MetronicApp.controller('RegistrationApiController', function ($scope, registrationService) {

    $scope.alerts = [];
    $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in, er zal dan een volgende-knop verschijnen';
    $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
    $scope.secondRoundMsg = 'Aan de hand van je poule standen is de volgende ronde bepaald. Vul per wedstrijd de winnaar in tot en met de finale';
    $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];


  $scope.teams = [{
                    	Id: 1,
                    	Team: "ADO Den Haag",
                    	Selected: false
                    }, {
                    	Id: 2,
                    	Team: "Ajax",
                    	Selected: false
                    },{
                    	Id: 3,
                    	Team: "AZ",
                    	Selected: false
                    }, {
                    	Id: 4,
                    	Team: "Excelsior",
                    	Selected: false
                    },{
                    	Id: 5,
                    	Team: "Feyenoord",
                    	Selected: false
                    }, {
                    	Id: 6,
                    	Team: "Go Ahead Eagles",
                    	Selected: false
                    },{
                    	Id: 7,
                    	Team: "FC Groningen",
                    	Selected: false
                    }, {
                    	Id: 8,
                    	Team: "SC Heerenveen",
                    	Selected: false
                    },{
                    	Id: 9,
                    	Team: "Heracles Almelo",
                    	Selected: false
                    }, {
                    	Id: 10,
                    	Team: "N.E.C.",
                    	Selected: false
                    },{
                    	Id: 11,
                    	Team: "PEC Zwolle",
                    	Selected: false
                    }, {
                    	Id: 12,
                    	Team: "PSV",
                    	Selected: false
                    },{
                    	Id: 13,
                    	Team: "Roda JC Kerkrade",
                    	Selected: false
                    }, {
                    	Id: 14,
                    	Team: "Sparta Rotterdam",
                    	Selected: false
                    },{
                    	Id: 15,
                    	Team: "FC Twente",
                    	Selected: false
                    }, {
                    	Id: 16,
                    	Team: "FC Utrecht",
                    	Selected: false
                    },{
                    	Id: 17,
                    	Team: "Vitesse",
                    	Selected: false
                    }, {
                    	Id: 18,
                    	Team: "Willem II",
                    	Selected: false
                    }]

		$scope.updateTablePrediction = function (newId, position) {

				var oldId = $scope.data.Table[position-1].SelectedTeamId

				if (oldId)
				{
					$scope.teams[(oldId-1)].Selected = false;
				}
				$scope.teams[(newId-1)].Selected = true;
				$scope.data.Table[position-1].SelectedTeamId = newId
				$scope.data.Table[position-1].SelectedTeam = $scope.teams[(newId-1)].Team;

}

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.save = function () {
        $scope.showConfirm = true;
        $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de voorspellingen van " + $scope.data.Participant.Name });

        var registration = registrationService.post($scope.data);

        registration.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt! Veel plezier met het Ek Spel ' + $scope.data.Participant.Name });
        });
        registration.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });
    };

    $scope.hide = false;
    $scope.orderByField = 'ts';
    $scope.reverseSort = true;

    $scope.showParticipant = true;
    $scope.showTable = false;
    $scope.showSecondRound = false;

    $scope.participantView = function () {
        $scope.showParticipant = true;
        $scope.showTable = false;
        $scope.showSecondRound = false;
    };
    $scope.tableView = function () {
        $scope.showParticipant = false;
        $scope.showTable = true;
        $scope.showSecondRound = false;
  
    };
    $scope.secondRoundView = function () {
        $scope.showParticipant = false;
        $scope.showTable = false;
        $scope.showSecondRound = true;

    };

    $scope.data =
{
	"Participant": {
		"Id": 0,
		"Name": "",
		"Email": "",
		"Location": "",
		"Gender": "",
		"PhoneNumber": ""
	},
	"Table": [{
		"Position": 1,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 2,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 3,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 4,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 5,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 6,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 7,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 8,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 9,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 10,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 11,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 12,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 13,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 14,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 15,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 16,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 17,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}, {
		"Position": 18,
		"SelectedTeam": "",
		"SelectedTeamId": ""
	}],
	"SecondRound": [{
		"PredictionTypeId": 3,
		"GameId": 13,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 1 A",
			"Poule": "A",
			"PoulePosition": 1
		}]
	}, {
		"PredictionTypeId": 3,
		"GameId": 14,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 2 B",
			"Poule": "B",
			"PoulePosition": 2
		}]
	}, {
		"PredictionTypeId": 3,
		"GameId": 15,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 1 B",
			"Poule": "B",
			"PoulePosition": 1
		}]
	}, {
		"PredictionTypeId": 3,
		"GameId": 16,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 2 A",
			"Poule": "A",
			"PoulePosition": 2
		}]
	}, {
		"PredictionTypeId": 4,
		"GameId": 17,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 1 A",
			"Poule": "A",
			"PoulePosition": 1,
			"GameId": 13
		}, {
			"Home": false,
			"Team": "Nr 2 B",
			"Poule": "B",
			"PoulePosition": 2,
			"GameId": 14
		}]
	}, {
		"PredictionTypeId": 4,
		"GameId": 18,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Nr 1 B",
			"Poule": "B",
			"PoulePosition": 1,
			"GameId": 15
		}, {
			"Home": false,
			"Team": "Nr 2 A",
			"Poule": "A",
			"PoulePosition": 2,
			"GameId": 16
		}]
	}, {
		"PredictionTypeId": 5,
		"GameId": 19,
		"SelectedTeam": null,
		"SelectedTeamId": null,
		"Teams": [{
			"Home": true,
			"Team": "Win 18",
			"GameId": 17,
			"TeamId": null
		}, {
			"Home": false,
			"Team": "Win 19",
			"GameId": 18,
			"TeamId": null
		}]
	}]
}

});


