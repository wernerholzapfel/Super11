console.log("players is ingeladen")
var db = require("./db.js");
var autoIncrement = require('mongoose-auto-increment');

var players = db.model('players', {
	RoundId: { type: Number, required: false },
	Player: [{
		Id: { type: Number, required: true },
        Name: { type: String, required: true },
        Team: { type: String, required: true },
        TeamId: { type: Number, required: true },
        Selected: { type: Boolean, required: true },
        Position: { type: String, required: true },
		Played: { type: Boolean, required: false },
		Win: { type: Boolean, required: false },
		Draw: { type: Boolean, required: false },
		Goals: { type: Number, required: false },
		Assists: { type: Number, required: false },
		Yellow: { type: Number, required: false },
		Red: { type: Number, required: false },
		CleanSheet: { type: Boolean, required: false },
		OwnGoal: { type: Boolean, required: false }

	}]
});
autoIncrement.initialize(db);

db.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });


module.exports = players;
