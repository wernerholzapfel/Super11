var mongoose = require('mongoose');

var wedstrijdenStandSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: false },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	},
	MatchesScore: [{
		Id: { type: Number, required: true },
		Match: { type: String, required: true },
		Home: { type: Number, required: false },
		Away: { type: Number, required: false },
        Score: { type: Number, required: false },
		Uitslag : {type: String, required: false}
	}],
	TotalMatchesScore: { type: Number, required: true }
});

var wedstrijdenstand = module.exports = mongoose.model('wedstrijdenstand', wedstrijdenStandSchema);

