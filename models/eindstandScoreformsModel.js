console.log("eindstandscoreforms is ingeladen")

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var eindstandScoreFormsSchema = new mongoose.Schema({
		Table: [{
		Position: { type: Number, required: false },
		SelectedTeam: { type: String, required: false },
		SelectedTeamId: { type: String, required: false }
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var eindstandscoreforms = module.exports = mongoose.model('eindstandscoreforms', eindstandScoreFormsSchema);
