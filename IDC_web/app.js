let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let logger = require('morgan');
let bodyParser = require('body-parser');
let indexRouter = require('./routes/ideas');
let usersRouter = require('./routes/users');
let messagesRouter = require('./routes/messages');
let problemsRouter = require('./routes/problems');
let profileRouter = require('./routes/profile');
let notificationsRouter = require('./routes/notifications');


let app = express();

let options = {
    inflate: true,
    limit: '100kb',
    type: '*/*'
};
//app.engine('html', engines.mustache);
//app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.text(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "^pguRw1bRYw(M3S9jhpLw4azRPk5ZLhHz3dGKSaVnP!SGf$Z", cookie:{maxAge: 60000 * 30}}));

//app.set('views', path.join(__dirname, 'www'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/problems', problemsRouter);
app.use('/profile', profileRouter);
app.use('/notifications', notificationsRouter);
app.use('/static', express.static(path.join(__dirname, 'www')));

module.exports = app;
