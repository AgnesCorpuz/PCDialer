var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();
var platformClient = require('purecloud-platform-client-v2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PCDialer' });
});

/* GET Contact page. */
router.get('/contact/:id', function(req, res){
    var db = req.db;
    db.get('Contacts').find({'ContactList': req.params.id}, function(e, docs){
        res.render('contactPage', {
            'contact' : docs,
            'page' : req.params.id
        });
    }); 
});

/* GET Contactlist page. */
router.get('/contactlist', function(req, res) {
    var db = req.db;
    db.get('ContactList').aggregate([
            {"$group" : {_id : {ContactListName:"$ContactListName", ContactListId:"$ContactListId"}}}
        ],function(e,docs){
            res.render('contactlist', {
                "contactlist" : docs         
            });
    });
});

/* GET Upload Contact List page. */
router.get('/contactListUpload', function(req, res) {
    var db = req.db;
    db.get('ContactList').aggregate([
            {"$group" : {_id : {ContactListName:"$ContactListName", ContactListId:"$ContactListId"}}}
        ],function(e,docs){
            res.render('contactListUpload', {
                "contactlist" : docs         
            });
    });
});

/* POST to Add Contact List Service */
router.post('/createContactList', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('ContactList');

    // Submit to the DB
    collection.insert(req.body, function (err, doc) {
        pureCloudCreateContactList(req, res);
    });
});

function pureCloudCreateContactList(req, res){
    var db = req.db;
    var collection = db.get('ContactList');

    var columnNames = [];
    var phoneColumns = [];
    var phoneType = [];
    var phoneTypes = [];

    // Called after Purecloud returns the successfully created Contact List
    function updateContactListID(data){
        collection.update({'ContactListName': req.body.ContactListName}, {$set: {'ContactListId': data.id}}, {multi: true});
    }

    // Find all the column entries from the db
    collection.find({'ContactListName': req.body.ContactListName}, function(e, docs){
        columnNames = (docs.map((entry) => entry.ColumnName)).toString().split(",");
        phoneColumns = (docs.map((entry) => entry.ColumnType)).toString().split(",");      
        while(phoneColumns.length) phoneType.push(phoneColumns.splice(0,2));

        phoneType.forEach(function (item){
            var obj = {};
            obj.columnName = item[0];
            obj.type = item[1];
            phoneTypes.push(obj);
        });

        //Add contactlist to PureCloud
        var outboundApi = new platformClient.OutboundApi();
        var body = {
            'name': req.body.ContactListName,
            'columnNames': columnNames, 
            'phoneColumns': phoneTypes
        };

        outboundApi.postOutboundContactlists(body)
        .then(function(data) {
            console.log(`postOutboundContactlists success! data: ${JSON.stringify(data, null, 2)}`);
            updateContactListID(data);         
        })
        .catch(function(err) {
            console.log('There was a failure calling postOutboundContactlists');
            console.error(err);
        });
    }); 
}

// router.post('/createContactList/PureCloud', function(req, res) {
    
// });

/* GET Contact via URL search. */
router.get('/search/:query', function(req, res){
    var db = req.db;
    db.get('Contacts').find({'Phone': req.params.query}, function(e, docs){
        if(docs){
            res.redirect("../contact/" + docs[0]._id);
        }
    }); 
});

/* POST to Add Contact Service */
router.post('/addcontact', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('Contacts');

    // Submit to the DB
    collection.insert(req.body, function (err, doc) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* GET ontacts page. */
router.get('/contacts', function(req, res) {
    var db = req.db;
    var collection = db.get('Contacts');
    collection.find({},{},function(e,docs){
        res.render('contacts', {
            "contacts" : docs
        });
    });
});

/* GET CallLogs page. */
router.get('/callLogs', function(req, res) {
    var db = req.db;
    var collection = db.get('CallLogs');
    collection.find({},{},function(e,docs){
        res.render('callLogs', {
            "callLogs" : docs
        });
    });
});

/* POST to Add Call Logs Service */
router.post('/addCallLogs', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('CallLogs');

    // Submit to the DB
    collection.insert(req.body, function (err, doc) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
