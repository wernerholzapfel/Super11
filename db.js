////db.js - logica voor verbinden met MongoDB
//
//var mongodb = require("mongodb");
//var ObjectID = mongodb.ObjectID;
//
//// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
//
//var uri = process.env.MONGOLAB_GOLD_URI;
//
//// Connect to the database before starting the application server.
//var db = mongodb.MongoClient.connect('mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj', function (err, database) {
//  if (err) {
//    console.log(err);
//    process.exit(1);
//  }
//  // Save database object from the callback for reuse.
//  db = database;
//  console.log("Database connection ready");
//
////  db.collectionNames(function(err, collections){
////      console.log(collections);
////  });
//
//});
//  module.exports.db;
//


var mongoose = require("mongoose");
var url = 'mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj'

var db = mongoose.connect(url, function() {
console.log('mongoose connected')
});
 module.exports = db;
