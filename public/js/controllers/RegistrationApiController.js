/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */

MetronicApp.filter('team', function () {
	return function () {
		var out = [1, 2, 3, 4];
		return out;
	};
})

MetronicApp.controller('RegistrationApiController', function ($scope, registrationService, teamFilter) {

    $scope.alerts = [];
    $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in, er zal dan een volgende-knop verschijnen';
    $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
    $scope.teamMsg = 'Kies je team';
    $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
	  $scope.playerPositions = [{ Id: 1, Position: "GK" }, { Id: 2, Position: "DF" }, { Id: 3, Position: "MF" }, { Id: 4, Position: "FW" }];

	$scope.players = [{
		Id: 1,
		Name: "Jasper Cillissen",
		Team: "AJA",
		TeamId: 1,
		Selected: false,
		Position: "GK"
	}, {
			Id: 2,
			Name: "Jeroen Zoet",
			Team: "PSV",
			TeamId: 12,
			Selected: false,
			Position: "GK"
		},
		{
			Id: 3,
			Name: "Joel Veltman",
			Team: "AJA",
			TeamId: 1,
			Selected: false,
			Position: "DF"
		}, {
			Id: 4,
			Name: "Bruma",
			Team: "PSV",
			TeamId: 12,
			Selected: false,
			Position: "DF"
		}, {
			Id: 5,
			Name: "Hakim Ziyech",
			Team: "TWE",
			TeamId: 15,
			Selected: false,
			Position: "MF"
		}, {
			Id: 6,
			Name: "Vitesse Middenvelder",
			Team: "VIT",
			TeamId: 17,
			Selected: false,
			Position: "MF"
		}, {
			Id: 7,
			Name: "Dirk Kuyt",
			Team: "FEY",
			TeamId: 5,
			Selected: false,
			Position: "FW"
		}, {
			Id: 8,
			Name: "Aanvaller groningen1",
			Team: "GRO",
			TeamId: 7,
			Selected: false,
			Position: "FW"
		}, {
			Id: 9,
			Name: "Aanvaller Feyenoord",
			Team: "FEY",
			TeamId: 5,
			Selected: false,
			Position: "FW"
		}, {
			Id: 10,
			Name: "Guram Kashia",
			Team: "VIT",
			TeamId: 17,
			Selected: false,
			Position: "DF"
		}]

	$scope.teams = [{
		Id: 1,
		Team: "ADO Den Haag",
		Selected: false,
		PlayerSelected: false
	},
		{
			Id: 2,
			Team: "Ajax",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 3,
			Team: "AZ",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 4,
			Team: "Excelsior",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 5,
			Team: "Feyenoord",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 6,
			Team: "Go Ahead Eagles",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 7,
			Team: "FC Groningen",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 8,
			Team: "SC Heerenveen",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 9,
			Team: "Heracles Almelo",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 10,
			Team: "N.E.C.",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 11,
			Team: "PEC Zwolle",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 12,
			Team: "PSV",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 13,
			Team: "Roda JC Kerkrade",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 14,
			Team: "Sparta Rotterdam",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 15,
			Team: "FC Twente",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 16,
			Team: "FC Utrecht",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 17,
			Team: "Vitesse",
			Selected: false,
			PlayerSelected: false
		}, {
			Id: 18,
			Team: "Willem II",
			Selected: false,
			PlayerSelected: false
		}]

	$scope.updateTablePrediction = function (newId, position) {

		var oldId = $scope.data.Table[position - 1].SelectedTeamId

		if (oldId) {
			$scope.teams[(oldId - 1)].Selected = false;
		}
		$scope.teams[(newId - 1)].Selected = true;
		$scope.data.Table[position - 1].SelectedTeamId = newId
		$scope.data.Table[position - 1].SelectedTeam = $scope.teams[(newId - 1)].Team;

	}

	$scope.createFilter = function () {
		console.log("function createfilter activated")
	}

	$scope.unSelectPlayersOfThisTeam = function (playerIdInput, activePlayer) {

		SCOPE = $scope.$root.$new();

		for (var i = 0; i < $scope.data.Team.length; i += 1) {
			var playerId = $scope.data.Team[i].PlayerId
			var predictionId = $scope.data.Team[i].Id

			if (playerId == playerIdInput && predictionId == activePlayer.Id) {
				var TeamId = $scope.players[(playerId - 1)].TeamId
				for (var i = 0; i < $scope.players.length; i += 1) {
					if ($scope.players[i].TeamId === TeamId) {
						$scope.players[i].Selected = false;
            								}
				}
			}
		}
		SCOPE.$apply

	}

	$scope.selectPlayersOfThisTeam = function (playerIdInput, activePlayer) {

		SCOPE = $scope.$root.$new();

		for (var i = 0; i < $scope.data.Team.length; i += 1) {
			var playerId = $scope.data.Team[i].PlayerId
			var predictionId = $scope.data.Team[i].Id

			if (playerId == playerIdInput && predictionId == activePlayer.Id) {
				var TeamId = $scope.players[(playerId - 1)].TeamId
				for (var i = 0; i < $scope.players.length; i += 1) {
					if ($scope.players[i].TeamId === TeamId) {
						$scope.players[i].Selected = true;
					}
				}
			}
		}

		SCOPE.$apply
	}

	$scope.updateTeamPrediction = function (playerId, t) {

		var oldPlayerId = $scope.data.Team[t.Id - 1].PlayerId

		if (oldPlayerId) {
			$scope.players[(oldPlayerId - 1)].Selected = false;
			//todo create loop

		}
		//update players list.

        var newTeamId = $scope.players[(playerId - 1)].TeamId
        for (var i = 0; i < $scope.players.length; i += 1) {
			if ($scope.players[i].TeamId === newTeamId) {
				$scope.players[i].Selected = true;
			}
		}

		//set prediction fields
		$scope.data.Team[t.Id - 1].PlayerId = playerId
		$scope.data.Team[t.Id - 1].PlayerName = $scope.players[(playerId - 1)].Name
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

    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = true;

    $scope.participantView = function () {
        $scope.showParticipant = true;
        $scope.showTable = false;
        $scope.showTeam = false;
    };
    $scope.tableView = function () {
        $scope.showParticipant = false;
        $scope.showTable = true;
        $scope.showTeam = false;

    };
    $scope.teamView = function () {
        $scope.showParticipant = false;
        $scope.showTable = false;
        $scope.showTeam = true;

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
			"Team": [{
				"Id": 1,
				"Position": "GK",
				"PlayerId": "",
				"PlayerName": "",
				"TeamId": ""
			}, {
					"Id": 2,
					"Position": "DF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 3,
					"Position": "DF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 4,
					"Position": "DF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 5,
					"Position": "DF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 6,
					"Position": "MF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 7,
					"Position": "MF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 8,
					"Position": "MF",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 9,
					"Position": "FW",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 10,
					"Position": "FW",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}, {
					"Id": 11,
					"Position": "FW",
					"PlayerId": "",
					"PlayerName": "",
					"TeamId": ""
				}]
		}


	$scope.filteredTeams = teamFilter();
});



