/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */

MetronicApp.controller('RegistrationApiController', function ($scope, registrationService) {

  $scope.alerts = [];
  $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in. Daarna kan je op volgende klikken om de rest van je voorspellingen in te vullen';
  $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
  $scope.teamMsg = 'Kies je team';
  $scope.questionMsg = 'Met deze vragen kan je extra bonuspunten verdienen'

  $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
  $scope.playerPositions = [{ Id: 1, Position: "GK" }, { Id: 2, Position: "DF" }, { Id: 3, Position: "MF" }, { Id: 4, Position: "FW" }];
  $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }]


  $scope.players = [
    {
      "Id": 1,
      "Name": "Zwinkels",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 2,
      "Name": "Hansen",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 3,
      "Name": "Coremans",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 4,
      "Name": "de Boer",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 5,
      "Name": "Wormgoor",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 6,
      "Name": "Kanon",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 7,
      "Name": "Malone",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 8,
      "Name": "Meijers",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 9,
      "Name": "Zuiverloon",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 10,
      "Name": "Ebuehi",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 11,
      "Name": "Derijck",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 12,
      "Name": "Kristensen",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 13,
      "Name": "Jansen",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 14,
      "Name": "Gehrt",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 15,
      "Name": "Bakker",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 16,
      "Name": "Nieuwenhuijs",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 17,
      "Name": "Alberg",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 18,
      "Name": "Hevel",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 19,
      "Name": "Schaken",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 20,
      "Name": "Duplan",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 21,
      "Name": "Havenaar",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 22,
      "Name": "Korte",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 23,
      "Name": "Kastaneer",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 24,
      "Name": "Owobowale",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 25,
      "Name": "Marengo",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 26,
      "Name": "Gorr�",
      "Team": "ADO",
      "TeamId": 1,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 27,
      "Name": "Cillessen",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 28,
      "Name": "Boer",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 29,
      "Name": "Onana",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 30,
      "Name": "Viergever",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 31,
      "Name": "Boilesen",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 32,
      "Name": "Tete",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 33,
      "Name": "Van der Hoorn",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 34,
      "Name": "Van Rhijn",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 35,
      "Name": "Veltman",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 36,
      "Name": "Dijks",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 37,
      "Name": "Riedewald",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 38,
      "Name": "Heitinga",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 39,
      "Name": "Gudelj",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 40,
      "Name": "Serero",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 41,
      "Name": "Andersen",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 42,
      "Name": "Klaassen",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 43,
      "Name": "Sinkgraven",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 44,
      "Name": "Bazoer",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 45,
      "Name": "Schone",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 46,
      "Name": "Fischer",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 47,
      "Name": "Milik",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 48,
      "Name": "El Ghazi",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 49,
      "Name": "Younes",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 50,
      "Name": "Sanogo",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 51,
      "Name": "Cerny",
      "Team": "AJA",
      "TeamId": 2,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 52,
      "Name": "Coutinho",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 53,
      "Name": "Rochet",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 54,
      "Name": "Olij",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 55,
      "Name": "J. Wuytens",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 56,
      "Name": "M. Johansson",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 57,
      "Name": "Gorter",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 58,
      "Name": "Haps",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 59,
      "Name": "Van der Linden",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 60,
      "Name": "Gouweleeuw",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 61,
      "Name": "Anderson",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 62,
      "Name": "Lukasseb",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 63,
      "Name": "Kramer",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 64,
      "Name": "Brezancic",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 65,
      "Name": "Henriksen",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 66,
      "Name": "Ortiz",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 67,
      "Name": "Haye",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 68,
      "Name": "Van Overeem",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 69,
      "Name": "Dos Santos",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 70,
      "Name": "Spierings",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 71,
      "Name": "Hupperts",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 72,
      "Name": "Lewis",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 73,
      "Name": "Jonsson",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 74,
      "Name": "Muhren",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 75,
      "Name": "Janssen",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 76,
      "Name": "Vaarnold",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 77,
      "Name": "Tankovic",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 78,
      "Name": "Jahanbakhsch",
      "Team": "AZ",
      "TeamId": 3,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 79,
      "Name": "Nienhuis",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 80,
      "Name": "Zienstra",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 81,
      "Name": "Peersman",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 82,
      "Name": "Heerings",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 83,
      "Name": "Andriuskevicius",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 84,
      "Name": "Pereira",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 85,
      "Name": "Mac Intosh",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 86,
      "Name": "Bakker",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 87,
      "Name": "Overgoor",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 88,
      "Name": "Van der Streek",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 89,
      "Name": "Steblecki",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 90,
      "Name": "Schootstra",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 91,
      "Name": "Masek",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 92,
      "Name": "Byrne",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "MF"
    },
    {
      "Id": 93,
      "Name": "F. Narsingh",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 94,
      "Name": "Houtkoop",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 95,
      "Name": "Barto",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 96,
      "Name": "Rosheuvel",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 97,
      "Name": "Hoefdraad",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 98,
      "Name": "Berisha",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 99,
      "Name": "Ogbeche",
      "Team": "CAM",
      "TeamId": 4,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 100,
      "Name": "Jurjus",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 101,
      "Name": "Heusinkveld",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 102,
      "Name": "Verstappen",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "GK"
    },
    {
      "Id": 103,
      "Name": "Will",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 104,
      "Name": "Van de Pavert",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 105,
      "Name": "Cicek",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 106,
      "Name": "Lammers",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 107,
      "Name": "Straalman",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 108,
      "Name": "Bouma",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 109,
      "Name": "R. Propper",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 110,
      "Name": "Linthorst",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 111,
      "Name": "Tesselaar",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "DF"
    },
    {
      "Id": 112,
      "Name": "Bannink",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 113,
      "Name": "Tarfi",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 114,
      "Name": "El Jebli",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 115,
      "Name": "Menting",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 116,
      "Name": "Kaak",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 117,
      "Name": "Smeets",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    },
    {
      "Id": 118,
      "Name": "Driver",
      "Team": "GRA",
      "TeamId": 5,
      "Selected": false,
      "Position": "FW"
    }
  ]


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

  $scope.setFormation = function (formation) {
    switch (formation) {
      case "433":
        $scope.data.Team[8].Position = "FW";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      case "442":
        $scope.data.Team[8].Position = "MF";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      default:

        $scope.data.Team[8].Position = "FW";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;

    }
  };

  $scope.updateTablePrediction = function (newId, position) {

    var oldId = $scope.data.Table[position - 1].SelectedTeamId

    if (oldId) {
      $scope.teams[(oldId - 1)].Selected = false;
    }
    $scope.teams[(newId - 1)].Selected = true;
    $scope.data.Table[position - 1].SelectedTeamId = newId
    $scope.data.Table[position - 1].SelectedTeam = $scope.teams[(newId - 1)].Team;

  };

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

  };

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
  };

  $scope.updateTeamPrediction = function (playerId, t) {

    //set prediction fields
    $scope.data.Team[t.Id - 1].PlayerId = playerId
    $scope.data.Team[t.Id - 1].PlayerName = $scope.players[(playerId - 1)].Name
		};


  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.save = function () {
    $scope.showConfirm = true;
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de voorspellingen van " + $scope.data.Participant.Name });

    var registration = registrationService.post($scope.data);

    registration.success(function () {
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt! Veel plezier met Super 11 ' + $scope.data.Participant.Name });
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

  $scope.formationChosen = false;

  $scope.showParticipant = false;
  $scope.showTable = true;
  $scope.showTeam = false;
  $scope.showQuestions = false;

  $scope.participantView = function () {
    $scope.showParticipant = true;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = false;
  };

  $scope.tableView = function () {
    $scope.showParticipant = false;
    $scope.showTable = true;
    $scope.showTeam = false;
    $scope.showQuestions = false;
  };

  $scope.teamView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = true;
    $scope.showQuestions = false;
  };

  $scope.questionsView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = true;
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
        }],
      "Questions": [{
        "Id": 1,
        "Question": "Wie wordt er kampioen in de premier league?",
        "Answer": ""
      }]
    }
});



