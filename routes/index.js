var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PCDialer' });
});

/* GET Contactlist page. */
router.get('/contactlist', function(req, res) {
  var db = req.db;
  var collection = db.get('ContactList');
  collection.find({},{},function(e,docs){
      res.render('contactlist', {
          "contactlist" : docs
      });
  });
});

/* POST to Add Contact Service */
router.post('/addcontact', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var fName = req.body.fName;
  var lName = req.body.lName;
  var company = req.body.company;
  var phone = req.body.phone;
  var email = req.body.email;

  // Set our collection
  var collection = db.get('ContactList');

  // Submit to the DB
  collection.insert({
      "FirstName" : fName,
      "LastName" : lName,
      "Company" : company,
      "Phone" : phone,
      "Email" : email
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("contactlist");
      }
  });
});

module.exports = router;
