console.log("berekenstand is ingeladen")
var mongoose = require( 'mongoose' );

var predictionsSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: true },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	}
	,
	Table: [{
		Position: { type: Number, required: false },
		SelectedTeam: { type: String, required: false },
		SelectedTeamId: { type: String, required: false }
	}],
	Formation: {type: String, required: false},
	Team: [{
		Id: { type: Number, required: true },
		Position: { type: String, required: false },
		PlayerId: { type: String, required: false },
		PlayerName: { type: String, required: false },
		TeamId: { type: String, required: false },
		Team: {type: String, required: false},
		Captain: {type: Boolean, required: false}
	}],
	Questions: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: false },
		Answer: { type: String, required: false }
	}],
		Matches: [{
  		Id: { type: Number, required: true },
  		Match: { type: String, required: false },
  		Home: { type: Number, required: false },
  		Away: { type: Number, required: false }
  	}]
});

var predictions = module.exports = mongoose.model('predictions', predictionsSchema);
