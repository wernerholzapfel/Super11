var mongoose = require('mongoose');

var eindstandStandSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: false },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	},
	TableScore: [{
		Position: { type: Number, required: false },
		SelectedTeam: { type: String, required: false },
		UitslagPosition: { type: Number, required: false },
		UitslagSelectedTeam: { type: String, required: false },
		Score: {type: Number, required: false}
	}],
	TotalEindstandScore: { type: Number, required: true }
});

var eindstandstand = module.exports = mongoose.model('eindstandstand', eindstandStandSchema);

