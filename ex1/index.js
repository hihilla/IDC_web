var http = require("http");
http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

// /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
var funcGet = function() {

}

// /idea (PUT) - add new idea ( ideas is just a string) returns the idead’s id
var funcPut = function(name, idea) {
	let nameString = name.value
	let ideaString = idea.value
	
}

// /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
var funcDelete = function(ideaId) {
	let id = ideaId.value
}

// /idea/<id> (POST) - update an idea (string)  by it’s id
var funcPost = function(ideaId, newIdea) {
	let id = ideaId.value
	let idea = newIdea.value
}

// /static/<filename> - returns the <filename> from the “www” directory that you should create
var funcFilename = function() {
	
}