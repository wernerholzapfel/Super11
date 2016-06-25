MetronicApp.service('saveScoreFormService', function ($http) {


    //Create new record
    this.post = function (playerList) {
        var req = $http.post('https://safe-oasis-58234.herokuapp.com/api/players', playerList);
        return req;

    }
});



MetronicApp.factory('playerListService', function ($http) {
  
  return [
 {
   "Id":1,
   "Name":"Zwinkels",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":2,
   "Name":"Hansen",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":3,
   "Name":"Coremans",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":4,
   "Name":"de Boer",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":5,
   "Name":"Wormgoor",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":6,
   "Name":"Kanon",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":7,
   "Name":"Malone",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":8,
   "Name":"Meijers",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":9,
   "Name":"Zuiverloon",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":10,
   "Name":"Ebuehi",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":11,
   "Name":"Derijck",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":12,
   "Name":"Kristensen",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":13,
   "Name":"Jansen",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":14,
   "Name":"Gehrt",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":15,
   "Name":"Bakker",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":16,
   "Name":"Nieuwenhuijs",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":17,
   "Name":"Alberg",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":18,
   "Name":"Hevel",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":19,
   "Name":"Schaken",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":20,
   "Name":"Duplan",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":21,
   "Name":"Havenaar",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":22,
   "Name":"Korte",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":23,
   "Name":"Kastaneer",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":24,
   "Name":"Owobowale",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":25,
   "Name":"Marengo",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":26,
   "Name":"Gorr�",
   "Team":"ADO",
   "TeamId":1,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":27,
   "Name":"Cillessen",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":28,
   "Name":"Boer",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":29,
   "Name":"Onana",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":30,
   "Name":"Viergever",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":31,
   "Name":"Boilesen",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":32,
   "Name":"Tete",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":33,
   "Name":"Van der Hoorn",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":34,
   "Name":"Van Rhijn",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":35,
   "Name":"Veltman",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":36,
   "Name":"Dijks",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":37,
   "Name":"Riedewald",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":38,
   "Name":"Heitinga",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":39,
   "Name":"Gudelj",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":40,
   "Name":"Serero",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":41,
   "Name":"Andersen",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":42,
   "Name":"Klaassen",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":43,
   "Name":"Sinkgraven",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":44,
   "Name":"Bazoer",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":45,
   "Name":"Schone",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":46,
   "Name":"Fischer",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":47,
   "Name":"Milik",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":48,
   "Name":"El Ghazi",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":49,
   "Name":"Younes",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":50,
   "Name":"Sanogo",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":51,
   "Name":"Cerny",
   "Team":"AJA",
   "TeamId":2,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":52,
   "Name":"Coutinho",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":53,
   "Name":"Rochet",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":54,
   "Name":"Olij",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":55,
   "Name":"J. Wuytens",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":56,
   "Name":"M. Johansson",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":57,
   "Name":"Gorter",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":58,
   "Name":"Haps",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":59,
   "Name":"Van der Linden",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":60,
   "Name":"Gouweleeuw",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":61,
   "Name":"Anderson",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":62,
   "Name":"Lukasseb",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":63,
   "Name":"Kramer",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":64,
   "Name":"Brezancic",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":65,
   "Name":"Henriksen",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":66,
   "Name":"Ortiz",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":67,
   "Name":"Haye",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":68,
   "Name":"Van Overeem",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":69,
   "Name":"Dos Santos",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":70,
   "Name":"Spierings",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":71,
   "Name":"Hupperts",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":72,
   "Name":"Lewis",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":73,
   "Name":"Jonsson",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":74,
   "Name":"Muhren",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":75,
   "Name":"Janssen",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":76,
   "Name":"Vaarnold",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":77,
   "Name":"Tankovic",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":78,
   "Name":"Jahanbakhsch",
   "Team":"AZ",
   "TeamId":3,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":79,
   "Name":"Nienhuis",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":80,
   "Name":"Zienstra",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":81,
   "Name":"Peersman",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":82,
   "Name":"Heerings",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":83,
   "Name":"Andriuskevicius",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":84,
   "Name":"Pereira",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":85,
   "Name":"Mac Intosh",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":86,
   "Name":"Bakker",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":87,
   "Name":"Overgoor",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":88,
   "Name":"Van der Streek",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":89,
   "Name":"Steblecki",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":90,
   "Name":"Schootstra",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":91,
   "Name":"Masek",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":92,
   "Name":"Byrne",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":93,
   "Name":"F. Narsingh",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":94,
   "Name":"Houtkoop",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":95,
   "Name":"Barto",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":96,
   "Name":"Rosheuvel",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":97,
   "Name":"Hoefdraad",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":98,
   "Name":"Berisha",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":99,
   "Name":"Ogbeche",
   "Team":"CAM",
   "TeamId":4,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":100,
   "Name":"Jurjus",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":101,
   "Name":"Heusinkveld",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":102,
   "Name":"Verstappen",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"GK",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":103,
   "Name":"Will",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":104,
   "Name":"Van de Pavert",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":105,
   "Name":"Cicek",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":106,
   "Name":"Lammers",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":107,
   "Name":"Straalman",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":108,
   "Name":"Bouma",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":109,
   "Name":"R. Propper",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":110,
   "Name":"Linthorst",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":111,
   "Name":"Tesselaar",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"DF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":112,
   "Name":"Bannink",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":113,
   "Name":"Tarfi",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":114,
   "Name":"El Jebli",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":115,
   "Name":"Menting",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":116,
   "Name":"Kaak",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":117,
   "Name":"Smeets",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":118,
   "Name":"Driver",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"MF",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":119,
   "Name":"Quekel",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":120,
   "Name":"Koolhof",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":121,
   "Name":"Vida",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":122,
   "Name":"Vermeij",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 },
 {
   "Id":123,
   "Name":"Kabasele",
   "Team":"GRA",
   "TeamId":5,
   "Selected":false,
   "Position":"FW",
   "RoundId":0,
   "Played":false,
   "Win":false,
   "Draw":false,
   "Goals":0,
   "Assists":0,
   "Yellow":0,
   "Red":0,
   "CleanSheet":false,
   "OwnGoal":false
 }
]
});
