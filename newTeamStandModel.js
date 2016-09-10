var mongoose = require('mongoose');

var newTeamStandSchema = new mongoose.Schema({
    RoundId: { type: Number, required: false },
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: false },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	},
	TeamScores: [{
		Id : {type: Number, required: true},
		Name: { type: String, required: false },
		Position: { type: String, required: false },
		Team: { type: String, required: false },
        Won: { type: Number, required: false },
        Draw: { type: Number, required: false },
        Played: { type: Number, required: false },
        RedCard: { type: Number, required: false },
        YellowCard: { type: Number, required: false },
        Assist: { type: Number, required: false },
        Goals: { type: Number, required: false },
        OwnGoals: { type: Number, required: false },
		CleanSheetScore: { type: Number, required: true },
        TotalScore: { type: Number, required: false }
	}],
	TotalTeamScore: { type: Number, required: true }
});

var newTeamStand = module.exports = mongoose.model('newTeamStand', newTeamStandSchema);

