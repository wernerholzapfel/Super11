console.log("vragenscoreforms is ingeladen")

var mongoose = require( 'mongoose' );
var autoIncrement = require('mongoose-auto-increment');

var vragenScoreFormsSchema = new mongoose.Schema({
	Questions: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: true },
		Answer: { type: String, required: false }
	}]
});

// autoIncrement.initialize(mongoose);
// mongoose.plugin(autoIncrement.plugin, { model: 'players', field: 'RoundId' });

var vragenscoreforms = module.exports = mongoose.model('vragenscoreforms', vragenScoreFormsSchema);


