// var http = require("http");
// http.createServer(function (request, response) {
//    // Send the HTTP header 
//    // HTTP Status: 200 : OK
//    // Content Type: text/plain
//    response.writeHead(200, {'Content-Type': 'text/plain'});
   
//    // Send the response body as "Hello World"
//    response.end('Hello World\n');
// }).listen(8081);

// // Console will print the message
// console.log('Server running at http://127.0.0.1:8081/');
var counter = 0;

var Idea = function(id, author, desc) {
	var newIdea = {
		id: 			id,
		author: 		author,
		description: 	desc,
		toString: 		function () {
			return "ID: " + this.id + 
			", Author: " + this.author + 
			", Description: " + this.description;
		}
	};

	return newIdea;
}

var getNextId = function() {
	return counter++;
}

// /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
var funcGet = function() {
	alert("GET ALL IDEAS")
	// TODO: get all idea from database as Json
	// var allIdeasJson = getAllIdeasJson()
	// TODO: parse them to array of idea objects
	// var allIdeas = parsIdeasFrom(allIdeasJson)
	// TODO: present in table
}

// /idea (PUT) - add new idea ( ideas is just a string) returns the idead’s id
var funcPut = function(name, idea) {
	console.log("HILLA:: " + name)
	let id = getNextId()
	console.log(id)
	let newIdea = Idea(id, name, idea)
	// TODO: add new idea to database
	alert("New Idea added: " + newIdea.toString())
}

// /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
var funcDelete = function(ideaId) {
	// TODO: delete idea from database and return the deleted idea, or null if no idea with thid id
	let idea = null//deleteIdea(ideaId)
	if (idea) {
		alert("Deleted idea: " + idea.toString())
	} else {
		alert("Could not find idea with id " + ideaId)
	}
}

// /idea/<id> (POST) - update an idea (string)  by it’s id
var funcPost = function(ideaId, newIdea) {
	console.log("HILLa::" + ideaId + " " + newIdea)
	// TODO: get the idea from database by id
	var idea = null//getIdeaById(ideaId)
	if (Idea) {
		// Idea.description = newIdea
		alert("Updated idea: ")// + idea.toString())
	} else {
		alert("Could not find idea with id " + ideaId + ", try creating a new idea")
	}
}

// /static/<filename> - returns the <filename> from the “www” directory that you should create
var funcFilename = function() {
	// TODO: get the file name and print to console or whtever
}