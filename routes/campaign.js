// Seperate route for campaign for sanity's sake

var express = require('express');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();
var platformClient = require('purecloud-platform-client-v2');

router.get('/', function(req, res){
    var db = req.db
    var outboundApi = new platformClient.OutboundApi();
    var routingApi = new platformClient.RoutingApi();

    // Data to use  for the template
    const model =  {};

    //API chain. 
    //get Queue list and contactlists list for dropdown
    routingApi.getRoutingQueues({})
    .then((data) => { 
        model.queues = data.entities.map((queue) => ({
                'name': queue.name,
                'id': queue.id
            }));

        // Get contact lists from db
        db.get('ContactList').find({},function(e,docs){
            model.contactLists = docs;
            getCampaignList();
        });   
    })
    .catch((err) => console.log(err));

    // Get campaign list from db
    function getCampaignList(){
        db.get('CampaignList').find({}, function(e, docs){
            model.campaignList = docs;
            getCampaignProgress();
        });
    }

    // Get campaign progress from PureCLoud
    function getCampaignProgress(){
        var campaignIdsList = model.campaignList
                            .filter((campaign) => campaign.campaignId)
                            .map((campaign) => campaign.campaignId)
        outboundApi.postOutboundCampaignsProgress(campaignIdsList)
        .then(function(data){
            model.campaignList.forEach((campaign) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].campaign.id === campaign.campaignId){
                        campaign.progress = data[i].percentage;
                    }
                }
            });
            
            console.log(model.campaignList);
            renderPage();
        })
        .catch(function(err) {
            console.error(err);
        });
        
    }

    // Rendder the page
    function renderPage(){
        res.render('campaignlist', model);
    }
});

router.post('/', function(req, res){
    var db = req.db;
    var collection = db.get('CampaignList');
    var outboundApi = new platformClient.OutboundApi();

    // Insert to the db then call PureCloud function
    collection.insert(req.body, createNewCampaignPureCloud);

    function createNewCampaignPureCloud(){
        outboundApi.getOutboundContactlist(req.body.contactList, {})
        .then(function(data) {
            var createNewCampaignBody = {
                "name": req.body.campaignName,
                "contactList": {
                "id": req.body.contactList
                },
                "queue": {
                "id": req.body.outBoundQueue
                },
                "script": {
                    "id": "d01f4329-9585-4527-8d3c-6f5cde854c64"
                },
                "dialingMode": "preview",
                "campaignStatus": "off",
                "phoneColumns": data.phoneColumns,
                "callerName": req.body.callerName,
                "callerAddress": req.body.callerAddress,
                "ruleSets": [],
                "skipPreviewDisabled": true,
                "previewTimeOutSeconds": 0,
                "alwaysRunning": false,
                "noAnswerTimeout": 30,
                "contactListFilters": []
            };    
    
            outboundApi.postOutboundCampaigns(createNewCampaignBody)
            .then(updateCampaignId)
            .catch(errorHandler);})
        .catch(errorHandler);
    }

    function errorHandler(err){
        // Very simple error handler
        console.error(err);
    }

    function updateCampaignId(data){
        collection.update(
                {'campaignName': req.body.campaignName}, 
                {$set: {'campaignId': data.id}}, 
                {multi: true}
            );
        redirectToCampaigns();
    }

    function redirectToCampaigns(){
        // Redirect to the campaigns page
        return res.redirect('/campaigns');
    }
});



module.exports = router;