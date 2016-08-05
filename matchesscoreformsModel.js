console.log("matchesscoreforms is ingeladen")

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var matchesScoreFormsSchema = new mongoose.Schema({
		Matches: [{
		Id: { type: Number, required: true },
		Matches: { type: String, required: true },
		Home: { type: Number, required: false },
		Away: { type: Number, required: false }
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var matchesscoreforms = module.exports = mongoose.model('matchesscoreforms', matchesScoreFormsSchema);


