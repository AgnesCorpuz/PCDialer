var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();
var platformClient = require('purecloud-platform-client-v2');

router.get('/', function(req, res){
    var usersApi = new platformClient.UsersApi();

    usersApi.getUsers({})
    .then(function(data) {
        console.log(`getUsers success! data: ${JSON.stringify(data, null, 2)}`);
        res.render('campaignlist', {'users': data.entities});
    })
    .catch(function(err) {
        console.log('There was a failure calling getUsers');
        console.error(err);
    });
});

module.exports = router;