console.log("wedstrijdscoreforms is ingeladen");

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var wedstrijdScoreFormsSchema = new mongoose.Schema({
		Matches: [{
		Id: { type: Number, required: true },
		Match: { type: String, required: true },
		Home: { type: Number, required: false },
		Away: { type: Number, required: false },
		RoundId : {type: Number, required : false}		
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var wedstrijdscoreforms = module.exports = mongoose.model('wedstrijdscoreforms', wedstrijdScoreFormsSchema);
