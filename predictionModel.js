console.log("berekenstand is ingeladen")
var mongoose = require( 'mongoose' );

var predictionsSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: true },
		Email: { type: String, required: true },
		Location: { type: String, required: true },
		Gender: { type: String, required: true },
		PhoneNumber: { type: String, required: true }
	}
	,
	Table: [{
		Position: { type: Number, required: true },
		SelectedTeam: { type: String, required: true },
		SelectedTeamId: { type: String, required: true }
	}],
	Team: [{
		Id: { type: Number, required: true },
		Position: { type: String, required: true },
		PlayerId: { type: String, required: true },
		PlayerName: { type: String, required: true },
		TeamId: { type: String, required: false },
	}],
	Questions: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: true },
		Answer: { type: String, required: true }
	}]
});

var predictions = module.exports = mongoose.model('predictions', predictionsSchema);
