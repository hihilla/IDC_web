let sqlite = require('sqlite-sync');
let path = require('path');

let UserCredentials = require(path.join(__dirname,'../models/user.js'));
let Message = require(path.join(__dirname,'../models/message.js'));
let Notification = require(path.join(__dirname,'../models/notification.js'));
let Problem = require(path.join(__dirname,'../models/problem.js'));
let Idea = require(path.join(__dirname,'../models/idea.js'));
let IdeaType = require(path.join(__dirname,'../models/ideaType.js'));
let ProblemStatus = require(path.join(__dirname,'../models/problemStatus.js'));
let NotificationStatus = require(path.join(__dirname,'../models/notificationStatus.js'));

let method = DAL.prototype;

function DAL() {
    this.db = sqlite.connect('ideas.db');
}

// ######################  USERS #######################

method.login = function(user, pass){
    let result = this.db.run(`SELECT users.id, users.username, profiles.id as profile_id, profiles.name 
                              FROM users 
                              LEFT JOIN profiles ON users.id = profiles.userid 
                              WHERE username = ? AND pass = ?`, [user, pass]);
    if(result.length == 0){
        return null;
    }
    let row = result[0];
    return new UserCredentials(row.id, row.username, row.profile_id, row.name);
};

method.isUsernameExists = function(user){
    let result = this.db.run('SELECT id FROM users WHERE username = ?', [user]);
    return result.length >= 1;
};

method.register = function(name, user, pass){
    let userId = this.db.insert('users', {username: user, pass: pass});
    if(!userId){
        return null;
    }

    let profileId = this.db.insert('profiles', {name: name, userid: userId});
    if(!profileId){
        return null;
    }
    return new UserCredentials(userId, user, profileId, name);
};

// ######################  IDEAS #######################

method.getIdeas = function(profileId, privacy_level){
    let queryResult = this.db.run(`SELECT ideas.id, ideas.author, profiles.name, ideas.idea, ideas.privacy, ideas.insertion_time 
                                   FROM ideas 
                                   LEFT JOIN profiles ON profiles.id = ideas.author 
                                   WHERE author = ? AND type = ? AND privacy >= ? 
                                   ORDER BY insertion_time desc`,
                                    [profileId, IdeaType.PERSONAL, privacy_level]);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let idea = new Idea(row.id,
                            row.author,
                            row.name,
                            row.idea,
                            row.privacy,
                            row.insertion_time);
        result.push(idea);
    }
    return result;
};

method.getProblemIdeas = function(problemId){
    let queryResult = this.db.run(`SELECT ideas.id, ideas.author, profiles.name, ideas.idea, ideas.privacy, ideas.insertion_time 
                                   FROM ideas 
                                   LEFT JOIN profiles ON profiles.id = ideas.author 
                                   WHERE target = ? and type = ?
                                   ORDER BY insertion_time desc`,
                                   [problemId, IdeaType.PROBLEM_ANSWER]);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let idea = new Idea(row.id,
            row.author,
            row.name,
            row.idea,
            row.privacy,
            row.insertion_time);
        result.push(idea);
    }
    return result;
};

method.addPersonalIdea = function(idea, profileId, privacy){
    return this.db.insert('ideas', {author: profileId, idea: idea, privacy: privacy, type: IdeaType.PERSONAL});
};

method.addProblemIdea = function(idea, profileId, privacy){
    return this.db.insert('ideas', {author: profileId, idea: idea, privacy: privacy, type: IdeaType.PERSONAL});
};

method.deleteIdea = function(id, profileId){
    let result = this.db.run('DELETE FROM ideas WHERE id = ? and author = ?', [id, profileId]);
    return 1;
};

method.setIdeaPrivacy = function(id, privacyLevel, profileId){
    let result = this.db.update('ideas', {privacy: privacyLevel}, {id: id, author: profileId});
    return 1;
};

method.updateIdea = function(id, text, profileId){
    let result = this.db.update('ideas', {idea: text}, {id: id, author: profileId});
    return 1;
};

// ######################  NOTIFICATIONS #######################

method.getUnreadNotifications = function(profileId){
    let queryResult = this.db.run(`SELECT id, text, insertion_time 
                                   FROM notifications 
                                   WHERE profile_id = ? and status = ?
                                   ORDER BY insertion_time desc`,
                                   [profileId, NotificationStatus.UNREAD]);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let notification = new Notification(row.id,
            row.text,
            row.insertion_time);
        result.push(notification);
    }
    return result;
};

method.addNotification = function(profileId, text){
    return this.db.insert('notifications', {profile_id: profileId, text: text, type: NotificationStatus.UNREAD});
};

method.setNotificationAsRead =  function(id, profileId){
    let result = this.db.update('notifications', {type: NotificationStatus.READ}, {id: id, profile_id: profileId});
    return 1;
};

// ######################  PROBLEMS #######################

method.getAllProblems = function(){
    let queryResult = this.db.run(`SELECT problems.id, problems.author, profiles.name , problems.description, problems.status, problems.chosen_idea, problems.insertion_time
                                   FROM problems
                                   LEFT JOIN profiles ON profiles.id = problems.author
                                   ORDER BY insertion_time desc`);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let problem = new Problem(row.id,
                                       row.description,
                                       row.author,
                                       row.name,
                                       row.status,
                                       row.chosen_idea,
                                       row.insertion_time);
        let ideas = getProblemIdeas(row.id);
        problem.setIdeas(ideas);
        result.push(problem);
    }
    return result;
};

method.getProfileProblems = function(profileId){
    let queryResult = this.db.run(`SELECT problems.id, problems.author, profiles.name , problems.description, problems.status, problems.chosen_idea, problems.insertion_time
                                   FROM problems
                                   LEFT JOIN profiles ON profiles.id = problems.author
                                   WHERE problems.author = ?
                                   ORDER BY insertion_time desc`, [profileId]);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let problem = new Problem(row.id,
            row.description,
            row.author,
            row.name,
            row.status,
            row.chosen_idea,
            row.insertion_time);

        let ideas = getProblemIdeas(row.id);
        problem.setIdeas(ideas);
        result.push(problem);
    }
    return result;
};

method.getProblemById = function(problemId){
    let queryResult = this.db.run(`SELECT problems.id, problems.author, profiles.name , problems.description, problems.status, problems.chosen_idea, problems.insertion_time
                                   FROM problems
                                   LEFT JOIN profiles ON profiles.id = problems.author
                                   WHERE problems.id = ?
                                   ORDER BY insertion_time desc`, [problemId]);
    let result = [];
    for(let i in queryResult){
        let row = queryResult[i];
        let problem = new Problem(row.id,
            row.description,
            row.author,
            row.name,
            row.status,
            row.chosen_idea,
            row.insertion_time);

        let ideas = getProblemIdeas(row.id);
        problem.setIdeas(ideas);
        result.push(problem);
    }
    return result[0];
};

method.addProblem = function(description, profileId){
    return this.db.insert('problems', {author: profileId, description: description, status: ProblemStatus.OPEN});
};

method.chooseAnswer = function(id, profileId, ideaId){
    let result = this.db.update('problems', {status: ProblemStatus.SOLVED, chosen_idea: ideaId}, {id: id, author: profileId});
    return 1;
};

method.setProblemStatus = function(id, profileId, status){
    let result = this.db.update('problems', {status: status}, {id: id, author: profileId});
    return 1;
};

// ######################  MESSAGES #######################
method.getAllMessages = function(profileId){
    let queryResult = this.db.run('SELECT id, message, from, to, insertion_time ' +
        'FROM messages WHERE to = ? ORDER BY insertion_time desc', [profileId]);
    let result = [];
    for(let i in queryResult){
        let message = new Message(queryResult[i].id,
                                  queryResult[i].message,
                                  queryResult[i].from,
                                  queryResult[i].to,
                                  queryResult[i].insertion_time);
        result.push(message);
    }
    return result;
};

method.sendMessage = function(from, to, message){
    return this.db.insert('messages', {message: message, from: from, to: to});
};

module.exports = DAL;