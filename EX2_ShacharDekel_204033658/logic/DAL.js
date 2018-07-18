let sqlite = require('sqlite-sync');

let method = DAL.prototype;

function DAL() {
    this.db = sqlite.connect('ideas.db');
}

method.login = function(user, pass){
    let result = this.db.run('SELECT id FROM users WHERE username = ? AND pass = ?', [user, pass]);
    return result.length == 1 ? result[0].id : null;
};

method.isUsernameExists = function(user){
    let result = this.db.run('SELECT id FROM users WHERE username = ?', [user]);
    return result.length >= 1;
};

method.register = function(name, user, pass){
    return this.db.insert('users', {name: name, username: user, pass: pass});
};

method.getIdeas = function(userId){
    let queryResult = this.db.run('SELECT id, idea FROM ideas WHERE userId = ? ORDER BY id', [userId]);
    let result = [];
    for(let i in queryResult){
        result.push({id: queryResult[i].id, idea: queryResult[i].idea});
    }
    return result;
};

method.addIdea = function(idea, userId){
    return this.db.insert('ideas', {userId: userId, idea: idea});
};

method.deleteIdea = function(id, userId){
    let result = this.db.run('DELETE FROM ideas WHERE id = ? and userId = ?', [id, userId]);
    return 1;
};

method.updateIdea = function(id, text, userId){
    let result = this.db.update('ideas', {idea: text}, {id: id, userId: userId});
    return 1;
};

module.exports = DAL;