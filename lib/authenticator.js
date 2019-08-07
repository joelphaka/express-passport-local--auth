const Promise = require('bluebird');
const User  = require('../models/user');


const redirectTo = (res, path) => {
    if (typeof path === 'function') {
        redirTo();
    } else if (typeof path === 'string') {
        res.redirect(path);
    } else {
        res.redirect('/');
    }
};

exports.settings = {
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
};

exports.authenticate = () => {
    return (req, email, password, done) => {

        User.query({where: {email: email}})
            .fetch()
            .then(function (user) {
                if (user) {
                    user = user.toJSON();
                    if (User.comparePassword(password, user.password)) {
                        return done(null, user);
                    }
                } else {
                    done(null, false);
                }
            });
    };
};

exports.serializeUser = function () {
    return (user, done) => {
        done(null, user.id)
    };
};

exports.deserializeUser = function () {
    return (id, done) => {
        new Promise((resolve, reject) => {
            resolve(id)
        }).then((userId) => {
            User.query({where: {id: userId}})
                .fetch()
                .then(function (user) {
                    if (user) {
                        user = user.toJSON();
                        done(null, user);
                    } else {
                        done(null, false)
                    }
                })
        });
    };
};

exports.signIn = function(user, redirTo) {
    return (req, res, next) => {
        return req.login(user, function (err) {
            if (err || !user) {
                next(err);
            } else {
                redirectTo(res, redirTo);
            }
        });
    };

};

exports.signOut = (redirTo) => {
    return (req, res, next) => {
        req.logout();
        req.session.destroy(() => { 
            res.clearCookie('connect.sid');
            
            redirectTo(res, redirTo);
        });
    }
};

