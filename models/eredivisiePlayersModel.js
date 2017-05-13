console.log("eredivisieplayers is ingeladen")

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


var eredivisiePlayersSchema = new mongoose.Schema({
	RoundId: { type: Number, required: false },
	Player: [{
		Id: { type: Number, required: true },
        Name: { type: String, required: true },
        Team: { type: String, required: true },
        TeamId: { type: Number, required: true },
		RoundId: { type: Number, required: false },
        Selected: { type: Boolean, required: true },
        PRESelected: { type: Boolean, required: true },
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
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var eredivisiePlayers = module.exports = mongoose.model('eredivisiePlayers', eredivisiePlayersSchema);


