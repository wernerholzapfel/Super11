var mongoose = require('mongoose');

var vragenStandSchema = new mongoose.Schema({
	Participant: {
		Name: { type: String, required: false },
		Email: { type: String, required: false },
		Location: { type: String, required: false },
		Gender: { type: String, required: false },
		PhoneNumber: { type: String, required: false }
	},
	QuestionsScore: [{
		Id: { type: Number, required: true },
		Question: { type: String, required: true },
		Answer: { type: String, required: false },
        Score: { type: Number, required: false },
		Uitslag : {type: String, required: false}

	}],	
	TotalQuestionsScore: { type: Number, required: true }
});

var vragenstand = module.exports = mongoose.model('vragenstand', vragenStandSchema);

