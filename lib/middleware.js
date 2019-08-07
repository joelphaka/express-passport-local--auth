const querystring = require('querystring');

const checkAuth = (req) => {
    return req.isAuthenticated() && req.user
        //req.session.passport
        //req.session.passport.user;
};

exports.appDir = () => {
    return (req, res, next) => {
        // Store the application's directory. This will be useful for file uploads.
        req.APP_DIR = __dirname;

        next();
    };
};

exports.csrfInView = () => {
    return (req, res, next) => {
        res.locals._csrf = req.csrfToken();

        next();
    };
};

exports.csrfAsFuncInView = () => {
    return (req, res, next) => {
        res.locals.csrf = req.csrfToken;

        next();
    };
};

exports.requestInView = () => {
    return (req, res, next) => {
        res.locals._request = {
            query: req.query,
            params: req.params,
            url: req.originalUrl
        };

        next();
    };
};

exports.requestAsFuncInView = () => {
    return (req, res, next) => {
        res.locals.request = (param) => {
            if (param) {
                return req.body[param] ? req.body[param] : null;
            }

            return {
                query: req.query,
                params: req.params,
                url: req.originalUrl
            }
        };

        next();
    };
};

exports.oldRequestDataInView = () => {
    return (req, res, next) => {
        res.locals.old = (param) => {
            if (param) {
                return req.body[param] ? req.body[param] : null;
            }

            return null;
        };

        next();
    };
};

exports.auth = (options) => {
    options = Object(options);
    options.loginUrl = options.loginUrl || '/login';
    options.redirectUrl = options.redirectUrl || null;

    return (req, res, next) => {
        if (checkAuth(req)) {
            if (options.redirectUrl) {
                res.redirect(options.redirectUrl)
            } else {
                next();
            }
        } else {
            if (req.query.continue) {
                res.redirect(`${options.loginUrl}/?continue=${req.originalUrl}`);
            } else {
                res.redirect(options.loginUrl);
            }
        }
    }
};

exports.redirectToIfAuth = (url) => {
    return (req, res, next) => {
        if (checkAuth(req)) {
            res.redirect(url || '/')
        } else {
            next();
        }
    }
};


exports.authUserInView = () => {
    return (req, res, next) => {
        res.locals._auth = {
            user: req.user,
            isAuth: checkAuth(req)
        };

        if (res.locals._auth.user) {
            delete res.locals._auth.user.password
        }

        next();
    };
};

exports.encodeAsFuncInView = () => {
    return (req, res, next) => {
        res.locals.encode = querystring.encode;
        next();
    };
};

exports.decodeAsFuncInView = () => {
    return (req, res, next) => {
        res.locals.decode = querystring.decode;
        next();
    };
};

exports.escapeAsFuncInView = () => {
    return (req, res, next) => {
        res.locals.escape = querystring.escape;
        next();
    };
};


exports.authUserAsFuncInView = () => {
    return (req, res, next) => {
        var _auth = {
            user: req.user,
            isAuth: checkAuth(req)
        };

        if (_auth.user) {
            delete _auth.user.password
        }

        res.locals.auth = () => {
            return _auth;
        };

        next();
    }
};

exports.errorFowarder = () => {
    return (req, res, next) => {
        const err = new Error('Not Found');
        next(err);
    };
};

exports.errorHandler = () => {
    return (err, req, res, next) => {
        res.status(404).render('error/index');
    };
};