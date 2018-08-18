let method = Problem.prototype;

function Problem(id, description, authorId, authorName, status, chosenIdea, postTime){
    this.id = id;
    this.description = description;
    this.authorId = authorId;
    this.authorName = authorName;
    this.status = status;
    this.ideas = [];
    this.chosenIdea = chosenIdea;
    this.sendTime = postTime;
}

method.setIdeas = function(ideas){
    this.ideas = ideas;
}

module.exports = Problem;