var express = require('express');
var router = express.Router();

/* GET Contact page. */
router.get('/:id', function(req, res){
    var db = req.db;
    var o_id = new ObjectId(req.params.id);
    db.get('ContactList').find({'_id': o_id}, function(e, docs){
        res.render('contactPage', {
           'contact' : docs[0] 
        });
    }); 
});

module.exports = router;