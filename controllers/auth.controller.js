const User              = require('../models/user');
const Promise           = require('bluebird');
const passport          = require('passport');
const authenticator     = require('../lib/authenticator');
const {session}         = require('../config/settings');

exports.login = {
    get(req, res) {
        res.render('auth/login')
    },
    post(req, res, next) {
        passport.authenticate('local', (err, user) => {
            if (err || !user) {
                const message = 'Incorrect email or password.';

                res.render('auth/login', {message: message});
            } else {
                if (req.body.remember) {
                    req.session.cookie.maxAge = session.cookie.maxAge;
                } else {
                    req.session.cookie.expires = false;
                }

                authenticator.signIn(user)(req, res, next);
            }

        })(req, res, next);
    }
};

exports.register = {
    get(req, res) {
        res.render('auth/register')
    },
    post(req, res, next) {
        User.validateRegistration(req)
            .then((errors) => {
                if (errors.isEmpty()) {
                    return Promise.resolve(true);
                } else {
                    var err = new Error('Validation failed');
                    err.errors = errors.array();

                    return Promise.reject(err);
                }
            })
            .then(() => {
                return User
                    .forge({
                        email: req.body.email.trim(),
                        username: req.body.username.trim(),
                        first_name: req.body.first_name.trim(),
                        last_name: req.body.last_name.trim(),
                        password: User.hashPassword(req.body.password)
                    })
                    .save()
                    .then((record) => {
                        if (record) {
                            return Promise.resolve(record.toJSON());
                        } else {
                            return Promise.reject(new Error('Could not complete registration.'));
                        }
                    })

            })
            .then((user) => {
                res.redirect('/login');
            })
            .catch((err) => {
                if (err.errors) {
                    res.render('auth/register', {errors: err.errors});
                } else {
                    next(err);
                }
            });
    }
};

exports.logout = (req, res, next) => {
    authenticator.signOut()(req, res, next);
};