var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ideas = [];

app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/ideas.html');
})

// a
app.get('/ideas', function (req, res) {
    // returns all the ideas as an object whereas id(number) -> idea(string)
    let json = JSON.stringify(ideas)
    res.send(json);
})

// b
app.put('/idea', function (req, res) {
    // add new idea ( idea is just a string) returns the idea’s id
    var name = req.body.author
    var description = req.body.description
    var ideaId = ideas.length
    let idea = Idea(name, description);
    ideas[ideaId] = idea
    res.send(JSON.stringify(ideaId))
})

// c
app.delete('/idea/:ideaId', function (req, res) {
    // delete an idea by it’s id (returns 0 if success, 1 otherwise)
    var ideaId = req.body.ideaId
    if (typeof ideaId != 'number' || ideaId > ideas.length || ideaId < 0) {
        res.send(JSON.stringify(1))
        return
    }
    var deletedIdea = ideas.splice(ideaId, 1);
    res.send(JSON.stringify(0))
})

// d
app.post('/idea/:ideaId', function (req, res) {
    // update an idea (string)  by it’s id
    var ideaId = req.body.ideaId
    var description = req.body.description
    ideas[ideaId].description = description
    res.send(JSON.stringify(ideaId))
})

// e
app.get('/static/:filename', function (req, res) {
    let filename = req.params.filename;
    res.end(filename)
    return filename
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Idea Ex1 app listening at http://%s:%s", host, port)
})


function Idea(author, desc) {
    var newIdea = {
        author: author,
        description: desc,
        toString: function () {
            return "Author: " + this.author +
                ", Description: " + this.description;
        }
    };

    return newIdea;
}

