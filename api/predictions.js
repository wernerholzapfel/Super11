var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var Predictions = require("../models/predictionModel");

apiRoutes.get("/predictions/:Id", function (req, res, next) {
  Predictions.findById(req.params.Id, { 'Participant.Email': 0, createDate: 0 }, function (err, prediction) {
    if (err) {
      handleError(res, err.message, "Failed to get prediction.");
    } else {
      res.status(200).json(prediction);
    }
  });
});

apiRoutes.get("/predictions", function (req, res, next) {
  Predictions.find({}, { 'Participant.Email': 0, "Team": 0, "Questions": 0, "Table": 0, createDate: 0 }, function (err, predictionsList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(predictionsList);
    }
  });
});

var determineifplayerisselected = require("../determineifplayerisselected");

// inschrijven uitgezet.
// apiRoutes.post("/predictions", passport.authenticate('jwt', { session: false }), function (req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     var decoded = jwt.decode(token, config.secret);
//     User.findOne({
//       name: decoded.name
//     }, function (err, user) {
//       if (err) throw err;
//       if (!user) {
//         return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
//       }
//       else {
//         var predictions = new Predictions(req.body);
//         predictions.Participant.Email = user.name;
//         Predictions.findOneAndUpdate({ 'Participant.Email': user.name }, predictions, ({ upsert: true }), function (err, newPrediction) {
//           if (err) {
//             handleError(res, err.message, "Failed to create new prediction.");
//           } else {
//             res.status(201).json(predictions);
//             determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
//           }
//         });
//       }
//     })
//   }
// });
module.exports = apiRoutes;
