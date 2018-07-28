var mongoose = require('mongoose');

var totaalStandSchema = new mongoose.Schema({
	
    RoundId: { type: Number, required: true },
	Name: { type: String, required: true },
	Email: { type: String, required: true },
	TotalTeamScore: { type: Number, required: true },
	TotalEindstandScore: { type: Number, required: true },
	TotalMatchesScore: { type: Number, required: true },
	TotalScore: { type: Number, required: true },
	TotalQuestionsScore: { type: Number, required: true },
	Positie: {type: Number,required: true},
	TeamScores: [{
		Id : {type: Number, required: true},
        PlayerId: {type: Number, required: false},
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
		CleanSheetScore: { type: Number, required: false },
        TotalScore: { type: Number, required: false },
        Captain: {type: Boolean, required: false},
        RoundId: {type: Number, required: false}
	}],
	 updatedAt: {
     type : Date,
     default : Date.now
   }
});

var totaalStand = module.exports = mongoose.model('totaalStand', totaalStandSchema);

