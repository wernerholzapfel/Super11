console.log("questionsscoreforms is ingeladen")

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var questionsScoreFormsSchema = new mongoose.Schema({
		Questions: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: true },
		Answer: { type: String, required: true }
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var questionsscoreforms = module.exports = mongoose.model('questionsscoreforms', questionsScoreFormsSchema);


