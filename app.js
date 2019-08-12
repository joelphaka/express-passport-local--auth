require('dotenv').config({path: __dirname + '/.env'});

const express           = require('express');
const serve             = require('express-static');
const fileUpload        = require('express-fileupload');
const flash             = require('express-flash-2');
const expressValidator  = require('express-validator');
const {validators}      = require('./lib/validation');
const logger            = require('morgan');
const csrf              = require('csurf');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const path              = require('path');

const routes            = require('./routes');
const middleware        = require('./lib/middleware');
const authenticator     = require('./lib/authenticator');

const app               = express();
const settings          = require('./config/settings');
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const session           = require('express-session');
const MySQLStore        = require('express-mysql-session')(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(middleware.appDir());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({customValidators: validators}));
app.use(csrf({cookie: true}));

app.set('trust proxy', 1);

settings.session.store = new MySQLStore(settings.database.connection);
app.use(session(settings.session));
app.use(flash());

// Passport authentication;
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(authenticator.settings, authenticator.authenticate()));

passport.serializeUser(authenticator.serializeUser());
passport.deserializeUser(authenticator.deserializeUser());

// Custom middleware
app.use(middleware.csrfInView());
app.use(middleware.csrfAsFuncInView());
app.use(middleware.requestInView());
app.use(middleware.requestAsFuncInView());
app.use(middleware.oldRequestDataInView());
app.use(middleware.encodeAsFuncInView());
app.use(middleware.decodeAsFuncInView());
app.use(middleware.escapeAsFuncInView());

app.use(middleware.authUserInView());
app.use(middleware.authUserAsFuncInView());


routes(app);

app.use(serve('public'));

//app.use(middleware.errorHandler());

module.exports = app;