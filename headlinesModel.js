console.log("headlines is ingeladen")
var mongoose = require('mongoose');

var headlinesSchema = new mongoose.Schema({
	Content: { type: String, required: true }
}
);

var headlines = module.exports = mongoose.model('headlines', headlinesSchema);
