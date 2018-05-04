var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();

/* GET list of call logs */
router.get('/', function(req, res){
    var db = req.db;
    var collection = db.get('CallLogs');
    collection.find({},{},function(e,docs){
      res.render('callLogList', {
          "callLogs" : docs
      });
  });
});

/* GET a specific Call Log by its ID */
router.get('/:id', function(req, res){
    var db = req.db;
    var o_id = new ObjectId(req.params.id);
    db.get('CallLogs').find({'_id': o_id}, function(e, docs){
        res.render('callLog', {
           'callLog' : docs[0] 
        });
    }); 
});

/* POST to Add Call Log */
router.post('/', function(req, res) {
    var db = req.db;
  
    // Get form values.
    var subject = req.body.subject;
    var comments = req.body.comments;
    var name = req.body.name;

    // Set our collection
    var collection = db.get('CallLogs');
  
    // Submit to the DB
    collection.insert({
        "subject" : subject,
        "comments" : comments,
        "name" : name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/call-log");
        }
    });
  });

module.exports = router;