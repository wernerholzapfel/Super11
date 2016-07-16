var mongoose = require( 'mongoose' );

var teamStandSchema = new mongoose.Schema({
    RoundId : {type: Number, required: false},
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: false },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	},
	TeamScores: [{
		Name: { type: String, required: false },
		Team: { type: String, required: false },
        Won : { type: Number, required: false},
        Draw : { type: Number, required: false},
        Played : { type: Number, required: false},
        RedCard : { type: Number, required: false},
        YellowCard : { type: Number, required: false},
        Assist : { type: Number, required: false},
        Goals : { type: Number, required: false},
        OwnGoals : { type: Number, required: false},
        TotalScore : { type: Number, required: false}
	}]
});

var teamStand = module.exports = mongoose.model('teamStand', teamStandSchema);

