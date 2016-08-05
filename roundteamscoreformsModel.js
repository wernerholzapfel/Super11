console.log("roundteamscoreforms is ingeladen")

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var roundTeamScoreFormsSchema = new mongoose.Schema({
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
		OwnGoal: { type: Number, required: false }
	}],
	Questions: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: true },
		Answer: { type: String, required: false }
	}],
	Matches: [{
		Id: { type: Number, required: true },
		Match: { type: String, required: true },
		Home: { type: Number, required: false },
		Away: { type: Number, required: false }
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var roundteamscoreforms = module.exports = mongoose.model('roundteamscoreforms', roundTeamScoreFormsSchema);


