let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let fs = require('fs');

let ideas = {};
let users = {};

app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(cookieParser());
app.use(session({secret: "HillasSecretYas1", cookie:{maxAge: 30 * 60 * 1000}}));


app.get('/', function (req, res) {
    if (req.session.username == undefined) {
        res.status(403).redirect('/users/register');
        return;
    }
    res.sendFile(__dirname + '/www/ideas.html');
});

app.get('/users/register', function (req, res) {
    res.sendFile(__dirname + '/www/register.html');
});

app.get('/users/login', function (req, res) {
    res.sendFile(__dirname + '/www/login.html');
});

/**
 EX1
 **/

// a
app.get('/ideas', function (req, res) {
    // returns all the ideas as an object whereas id(number) -> idea(string)
    let username = req.session.username;
    if (username == undefined) {
        res.status(403).redirect('/users/login');
        return;
    }
    let usersIdea = ideas[username];
    let json = JSON.stringify(usersIdea);
    res.send(json);
});

// b
app.put('/idea', function (req, res) {
    // add new idea ( idea is just a string) returns the idea’s id
    let username = req.session.username;
    if (username === undefined) {
        res.status(403).redirect('/users/login');
        return;
    }
    let usersIdea = ideas[username];
    let name = req.body.author;
    let description = req.body.description;
    let ideaId = Object.keys(usersIdea).length || 0;
    if (usersIdea === undefined) {
        usersIdea = {};
        usersIdea[0] = Idea(name, description);
    } else {
        usersIdea[ideaId] = Idea(name, description);
    }

    ideas[username] = usersIdea;
    encodeData();
    res.send(JSON.stringify(ideaId))
});

// c
app.delete('/idea/:ideaId', function (req, res) {
    let username = req.session.username;
    if (username == undefined) {
        res.status(403).redirect('/users/login');
        return;
    }
    let usersIdea = ideas[username];
    // delete an idea by it’s id (returns 0 if success, 1 otherwise)
    let ideaId = parseInt(req.body.ideaId);
    if (typeof ideaId != 'number' || ideaId > usersIdea.length || ideaId < 0) {
        res.send(JSON.stringify(1));
        return
    }
    let deletedIdea = usersIdea.splice(ideaId, 1);
    encodeData();
    res.send(JSON.stringify(0))
});

// d
app.post('/idea/:ideaId', function (req, res) {
    let username = req.session.username;
    if (username == undefined) {
        res.status(403).redirect('/users/login');
        return;
    }
    let usersIdea = ideas[username];
    // update an idea (string)  by it’s id
    let ideaId = req.body.ideaId;
    let description = req.body.description;
    usersIdea[ideaId].description = description;
    encodeData();
    res.send(JSON.stringify(ideaId))
});

// e
app.get('/static/:filename', function (req, res) {
    let filename = req.params.filename;
    res.end(filename);
    return filename
});

/**
 EX2
 **/

// A
app.post('/users/register', function (req, res) {
    let name = req.body.name;
    let user = req.body.user;
    let pass = req.body.pass;
    // let userId = users.length;
    // look for user with same username
    decodeData();
    let userObject = users[user];
    if (userObject != null) {
        console.log("username exists");
        // we already have user with this username!!!
        res.status(303);//.redirect('/users/login');
        res.send(JSON.stringify('/users/login'));
        return;
    }

    let newUser = User(name, user, pass);
    console.log("new user! " + newUser.toString());
    // add new user to database
    users[user] = newUser;

    ideas[user] = {};
    encodeData();

    req.session.username = user;
    // res.writeHead(303, {'Location': "http://" + req.headers['host'] +'/', 'Content-Type': 'text/html'});
    res.send(JSON.stringify('/'));
    return;
    // res.setHeader('content-type', 'text/html');
    // res.redirect('/');
});

// B
app.post('/users/login', function (req, res) {
    let user = req.body.user;
    let pass = req.body.pass;
    // find user with username
    let userObject = users[user];
    if (userObject!== undefined && pass === userObject.pass) {
        user = userObject.user;
    } else {
        // the user should get redirected to the register page with a specific msg regarding the failure to login
        res.send(JSON.stringify('/users/register'));
        res.status(303);//.redirect('/users/register');
        return;
    }

    // If the user exist the response should redirect (30X HTTP Response) to the main ideas page of Ex1
    req.session.username = user;
    // res.writeHead(303, {'Location': '/'});
    res.status(303).redirect('/');
    res.send(JSON.stringify('/'));
});


/****/

let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log("Idea Ex2 app listening at http://%s:%s", host, port)
});


function Idea(author, desc) {
    let newIdea = {
        author: author,
        description: desc,
        toString: function () {
            return "Author: " + this.author +
                ", Description: " + this.description;
        }
    };

    return newIdea;
}

function User(name, user, password) {
    let newUser = {
        name: name,
        user: user,
        password: password,
        toString: function () {
            return "Name: " + this.name +
                ", User: " + this.user +
                ", Password: " + this.password;
        }
    };

    return newUser;
}


// function getUserFromCookie(req) {
//     let username = req.cookies.username;
//     if (username == undefined) {
//         return null
//     }
//
//     decodeData();
//     let user = users[username];
//
//     return user;
// }

// function handleCookies(req, res) {
//     let username = req.cookies.username;
//     if (username == undefined) {
//         res.status(403).render();
//         return;
//     }


    // let user = getUserFromCookie(req);
    // if (user == null) {
    //     res.redirect(401, '/users/register');
    //     return;
    // }
    //
    // res.cookie(user, 'username', {expire: thirtyMin + Date.now()});
    // return user;
// }

function encodeData() {
    let usersJson = JSON.stringify(users);
    let ideasJson = JSON.stringify(ideas);


    if (usersJson != '') {
        fs.writeFile('data/users_data.txt', usersJson, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }

    if (ideasJson != '') {
        fs.writeFile('data/ideas_data.txt', ideasJson, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }
}

function decodeData() {
    let usersJson;
    let ideasJson;

    // Asynchronous read

    fs.readFile('data/users_data.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        usersJson = data;
        if (usersJson !== "") {
            users = JSON.parse(usersJson);
        }
    });

    fs.readFile('data/ideas_data.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        ideasJson = data;
        if (ideasJson !== "") {
            ideas = JSON.parse(ideasJson);
        }
    });
}
