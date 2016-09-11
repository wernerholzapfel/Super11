console.log("comments is ingeladen")
var mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({
	content: { type: String, required: true },
	name: { type: String, required: false },
	createdAt: { type: Date, required: true }
}
);

var comments = module.exports = mongoose.model('comments', commentsSchema);
