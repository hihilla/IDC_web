let path = require('path');
let Privacy = require(path.join(__dirname,'privacy.js'));

function Idea(id, authorId, authorName, idea, privacy, postTime){
    this.id = id;
    this.authorId = authorId;
    this.authorName = authorName;
    this.idea = idea;
    if(privacy){
        this.privacy = privacy;
    }
    else {
        this.privacy = Privacy.PRIVATE;
    }
    this.postTime = postTime;
}



module.exports = Idea;