let express = require('express');
let path = require('path');
let router = express.Router();
let DAL = require(path.join(__dirname,'../logic/DAL.js'));
let sha1 = require('sha1');
const queryString = require('query-string');

let dal = new DAL();

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname,'../www/login.html'));
});

router.post('/login', function(req, res) {
    let params = queryString.parse(req.body);
    let user = params.user;
    let pass= sha1(params.pass);
    let userId = dal.login(user, pass);
    if(userId){
        req.session.userId = userId;
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
    else{
        res.writeHead(302, {'Location': '/users/login?error=true'});
        res.end();
    }
});

router.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname,'../www/register.html'));
});

router.post('/register', function(req, res){
    let params = queryString.parse(req.body);
    let name = params.name;
    let user = params.user;
    let pass= sha1(params.pass);
    if(dal.isUsernameExists(user)){
        res.writeHead(302, {'Location': '/users/register?error=true'});
        res.end();
        return;
    }
    let userId = dal.register(name, user, pass);
    if(userId) {
        req.session.userId = userId;
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.writeHead(302, {'Location': '/users/login'});
    res.end();
});


module.exports = router;