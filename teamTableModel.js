console.log("teamtable is ingeladen")

var mongoose = require( 'mongoose' );


var teamTableSchema = new mongoose.Schema({
    RoundId : {type: Number, required: true},
	Participant: {
		Name: { type: String, required: true },
		Email: { type: String, required: true },
		Location: { type: String, required: true },
		Gender: { type: String, required: true },
		PhoneNumber: { type: String, required: true }
	},
	Team: [{
		Id: { type: Number, required: false },
		Position: { type: String, required: false },
		PlayerId: { type: String, required: false },
		PlayerName: { type: String, required: false },
		TeamId: { type: String, required: false },
        Points : { type: Number, required: false}
	}]
});

var teamTable = module.exports = mongoose.model('teamTable', teamTableSchema);

