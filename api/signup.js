// var express = require("express");
// var apiRoutes = express.Router();
// var mongoose = require('mongoose');
//
// var passport = require('passport');
// var jwt = require('jwt-simple');
// var config = require('../config/database');
//
// var User = require("./models/user");

//apiRoutes.post('/signup', function (req, res) {
//  if (!req.body.name || !req.body.password) {
//    res.json({ success: false, msg: 'Please pass name and password.' });
//  } else {
//    var newUser = new User({
//      name: req.body.name.toLowerCase(),
//      password: req.body.password
//    });
//    // save the user
//    newUser.save(function (err) {
//      if (err) {
//        return res.json({ success: false, msg: 'Username already exists.' });
//      }
//      var token = jwt.encode(newUser, config.secret);
//      res.json({ success: true, msg: 'Successful created new user.', token: 'JWT ' + token });
//    });
//  }
//});