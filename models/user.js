const Bookshelf     = require('./db');
const validation    = require('../lib/validation');
const bcrypt        = require('bcrypt');

const User = Bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true
});

User.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

User.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

User.validateRegistration = (req) => {

    req.checkBody('email')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isEmail().withMessage(validation.MESSAGES.EMAIL)
        .uniqueEmail().withMessage(validation.MESSAGES.EMAIL_EXISTS2);

    req.checkBody('password')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isLength({min:6}).withMessage(validation.MESSAGES.MIN_LENGTH(6))
        ;
    req.checkBody('password_confirmation')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isLength({min:6}).withMessage(validation.MESSAGES.MIN_LENGTH(6))
        .matches(new RegExp(req.body.password)).withMessage(validation.MESSAGES.MATCH_PASSWORD)
        ;
    req.checkBody('username')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isAlphanumeric().withMessage('The username must be alphanumeric.')
        .isLength({min:8}).withMessage(validation.MESSAGES.MIN_LENGTH(8))
        .uniqueUsername().withMessage(validation.MESSAGES.USERNAME_EXISTS2);

    req.checkBody('first_name')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isName().withMessage(validation.MESSAGES.NAME);

    req.checkBody('last_name')
        .notEmpty().withMessage(validation.MESSAGES.REQUIRED)
        .notWhitespace().withMessage(validation.MESSAGES.EMPTY)
        .isName().withMessage(validation.MESSAGES.NAME);

    return req.getValidationResult();
};

module.exports = Bookshelf.model('User', User);