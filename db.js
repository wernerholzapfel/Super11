var mongoose = require("mongoose");
var uri = process.env.MONGOLAB_GOLD_URI;
var url = 'mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj'
mongoose.Promise = global.Promise;

var db = mongoose.connect(url, function () {
    console.log('mongoose connected')
});
module.exports = db;
