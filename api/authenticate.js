// var express = require("express");
// var apiRoutes = express.Router();
// var mongoose = require('mongoose');

// var passport = require('passport');
// var jwt = require('jwt-simple');
// var config = require('../config/database');

// var User = require("../models/user");

// // route to authenticate a user
// apiRoutes.post('/authenticate', function (req, res) {
//   User.findOne({
//     name: req.body.name.toLowerCase()
//   }, function (err, user) {
//     if (err) throw err;

//     if (!user) {
//       res.send({ success: false, msg: 'Authentication failed. User not found.' });
//     } else {
//       // check if password matches
//       user.comparePassword(req.body.password, function (err, isMatch) {
//         if (isMatch && !err) {
//           // if user is found and password is right create a token
//           var token = jwt.encode(user, config.secret);
//           // return the information including token as JSON
//           res.json({ success: true, token: 'JWT ' + token });
//         } else {
//           res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
//         }
//       });
//     }
//   });
// });

// module.exports = apiRoutes;
