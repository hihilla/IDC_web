let express = require('express');
let path = require('path');
let router = express.Router();
let DAL = require(path.join(__dirname,'../logic/DAL.js'));
let dal = new DAL();

// Get all notifications
router.get('/', function(req, res){
    let userId = req.session.profileId;
    if(!userId){
        // If the user is not logged in - NO ACCESS
        res.status(403).render();
        return;
    }
    res.json(dal.getUnreadNotifications(userId));
});

router.put("/setAsRead", function(req, res){
    let userId = req.session.userId;
    if(!userId){
        // If the user is not logged in - NO ACCESS
        res.status(403).render();
        return;
    }
    let newIdea = req.body;
  let newId = dal.addIdea(newIdea, userId);
  res.send(newId.toString());
});

router.delete("/idea/:id", function(req, res){
    let userId = req.session.userId;
    if(!userId){
        // If the user is not logged in - NO ACCESS
        res.status(403).render();
        return;
    }
    let idToDelete = req.params.id;
    res.send(dal.deleteIdea(idToDelete, userId).toString());
});

router.post("/idea/:id", function(req, res){
    let userId = req.session.userId;
    if(!userId){
        // If the user is not logged in - NO ACCESS
        res.status(403).render();
        return;
    }
    let idToUpdate = req.params.id;
    let ideaContent = req.body;
  res.send(dal.updateIdea(idToUpdate, ideaContent, userId).toString());
});

module.exports = router;
