var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();
var platformClient = require('purecloud-platform-client-v2');

router.get('/', function(req, res){
    var outboundApi = new platformClient.OutboundApi();
    var routingApi = new platformClient.RoutingApi();

    // Data to use  for the template
    const model =  {};

    //API chain. get Queue list and contactlists list for dropdown
    routingApi.getRoutingQueues({})
        .then((data) => { 
            model.queues = data.entities.map((queue) => queue.name )
            outboundApi.getOutboundContactlists({})
                .then((data) => { 
                    model.contactLists = data.entities.map((contactList) => contactList.name )
                    
                    res.render('campaignlist', model);
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

module.exports = router;