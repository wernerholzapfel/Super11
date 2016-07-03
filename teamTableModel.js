console.log("berekenstand is ingeladen")
var db = require("./db.js");

var teamTable = db.model('teamTable', {
    RoundId : {type: Number, required: true},
	Participant: {
		Name: { type: String, required: true },
		Email: { type: String, required: true },
		Location: { type: String, required: true },
		Gender: { type: String, required: true },
		PhoneNumber: { type: String, required: true }
	},
	Team: [{
		Id: { type: Number, required: false },
		Position: { type: String, required: false },
		PlayerId: { type: String, required: false },
		PlayerName: { type: String, required: false },
		TeamId: { type: String, required: false },
        Points : { type: Number, required: false}
	}]
});

module.exports = teamTable;
