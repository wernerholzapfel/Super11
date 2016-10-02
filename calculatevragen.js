var vragenUitslag = require("./models/vragenScoreformsModel");
var vragenStand = require("./models/vragenStandModel");
var predictions = require("./models/predictionModel");
var calculatetotaalstand = require("./calculatetotaalstand.js");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.calculateQuestions = function () {

    async.waterfall([
        function (callback) {
            //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
            vragenUitslag.findOne({}).exec(function (err, vragenScore) {
                if (err) return console.error(err);
                callback(null, vragenScore);
            });
        },
        function (vragenScore, callback) {
            //hier worden alle voorspellingen ophgehaald van de deelnemers
            // console.log("playerRoundScore 2e lenght: " + playerRoundScore.length)
            predictions.find({}, {}).exec(function (err, predictions) {
                // console.log("predictions length: " + predictions.length)
                if (err) return console.error(err);
                callback(null, vragenScore, predictions);
            });
        },
        function (playerRoundScore, predictions, callback) {
            async.each(predictions, function (prediction, callback) {
                var stand = new vragenStand;
                stand.TotalQuestionsScore = 0;
                stand.Participant = prediction.Participant;
                stand.QuestionsScore = [];

                async.each(prediction.Questions, function (question, callback) {
                    var scoreQuestion = _.find(playerRoundScore.Questions, function (o) { return o.Id === parseInt(question.Id); });

                    if (scoreQuestion.Answer) {
                        var questionScore = new Object;
                        questionScore.Score = setQuestionScore(scoreQuestion, question),
                            questionScore.Question = question.Question,
                            questionScore.Answer = question.Answer,
                            questionScore.Id = question.Id,
                            questionScore.Uitslag = scoreQuestion.Answer;

                        stand.TotalQuestionsScore = stand.TotalQuestionsScore + questionScore.Score;

                        stand.QuestionsScore.push(questionScore);
                    }
                    else {
                        var questionScore = new Object;
                        questionScore.Score = 0,
                            questionScore.Question = question.Question,
                            questionScore.Answer = question.Answer,
                            questionScore.Id = question.Id,
                            questionScore.Uitslag = scoreQuestion.Answer;

                        stand.TotalQuestionsScore = stand.TotalQuestionsScore + questionScore.Score;

                        stand.QuestionsScore.push(questionScore);
                    }
                },
                    function (err) {
                        console.log("err: " + err);
                    }
                );
                //necessary to overwrite vragenStand
                var standToUpdate = {};
                standToUpdate = Object.assign(standToUpdate, stand._doc);
                delete standToUpdate._id;

                vragenStand.findOneAndUpdate({ 'Participant.Email': prediction.Participant.Email }, standToUpdate, ({ upsert: true }), function (err, stand) {
                    if (err) return console.error("error: " + err);
                    console.log("saved vragenstand for : " + prediction.Participant.Name);
                    callback();
                });
            },
                function (err) {
                    // if any of the file processing produced an error, err would equal that error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        console.log('A file failed to process');
                    } else {
                        console.log('Go calculate totaalstand');
                        calculatetotaalstand.calculatetotaalstand();
                    }
                });
        }
    ], function (err) {
        if (err) console.log("error occured");
    });
};

var setQuestionScore = function (scoreQuestion, question) {
    if (scoreQuestion.Answer === question.Answer) {
        return 10;
    }
    else {
        return 0;
    }
};

