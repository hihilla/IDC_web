const URL = 'http://localhost:8081';

// /ideas (GET) - returns all the ideas as an object whereas id(number) -> idea(string)
function getAllIdeas() {
    const table = document.getElementById('ideas');
    const url = URL + '/ideas';
    fetch(url, {method: 'GET'})
        .then((resp) => resp.json())
        .then(function (data) {
            updatePage("")
            table.textContent = ""
            if (data.length == 0) {
                table.innerHTML = "No ideas in database yet..."
                return
            }
            let tr = createNode('tr'),
                td = createNode('td');
            td.innerHTML = `${"Ideas:"}`;
            append(tr, td);
            append(table, tr);
            var i = 0
            return data.map(function (idea) {
                let tr = createNode('tr'),
                    span = createNode('td');
                span.innerHTML = `${i++} - ${idea.author}: ${idea.description}`;
                append(tr, span);
                append(table, tr);
            })
        })
        .catch(error => errorHandler(error));
}

// /idea (PUT) - add new idea ( ideas is just a string) returns the idead’s id
var funcPut = function (author, idea) {
    const url = URL + '/idea';
    let data = {author: author, description: idea};
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            updatePage("Added idea with id: " + data)
        })
        .catch(error => (error));
}

// /idea/<id> (DELETE) - delete an idea by it’s id (returns 0 if success, 1 otherwise)
var funcDelete = function (ideaId) {
    const url = URL + '/idea/' + ideaId;

    fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ideaId: ideaId}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            if (data == 0) {
                updatePage("Deleted idea with id: " + ideaId)
            } else {
                updatePage("Couldn't delete idea with id: " + ideaId)
            }
        })
        .catch(error => errorHandler(error));
}

// /idea/<id> (POST) - update an idea (string)  by it’s id
var funcPost = function (ideaId, newIdea) {
    const url = URL + '/idea/' + ideaId;
    let data = {ideaId: ideaId, description: newIdea};
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            updatePage("Updated idea with id: " + data)
        })
        .catch(error => errorHandler(error));
}


function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function updatePage(text) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    const table = document.getElementById('ideas');
    const updateTitle = document.getElementById('updateTitle')
    updateTitle.textContent = text
    table.textContent = ""
}

function errorHandler(error) {
    updatePage("en error has occured: " + error)
}