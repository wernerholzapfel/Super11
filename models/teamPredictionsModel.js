console.log("teampredictions is ingeladen")
var mongoose = require( 'mongoose' );

var teampredictionsSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: true },
		Email: { type: String, required: true },
		Location: { type: String, required: true },
		Gender: { type: String, required: true },
		PhoneNumber: { type: String, required: false }
	},
	Formation: {type: String, required: false},
	CaptainId: {type: String, required: false},
	Team: [{
		Id: { type: Number, required: true },
		Position: { type: String, required: false },
		PlayerId: { type: String, required: false },
		PlayerName: { type: String, required: false },
		TeamId: { type: String, required: false },
		Team: {type: String, required: false},
		Captain: {type: Boolean, required: false}
	}],
});

var teampredictions = module.exports = mongoose.model('teampredictions', teampredictionsSchema);
