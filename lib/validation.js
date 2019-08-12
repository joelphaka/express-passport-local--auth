const util      = require('util');
const Promise   = require('bluebird');
const User      = require('../models/user');

exports.MESSAGES = {
    REQUIRED: "This field is required.",
    USERNAME_EXISTS: 'The username already exists.',
    USERNAME_EXISTS2: 'An account with this username already exists.',
    EMAIL_EXISTS: 'This email is already in use.',
    EMAIL_EXISTS2: 'An account with this email already exists.',
    TERMS_AND_CONDITIONS: 'You must agree with the terms and conditions.',
    EMAIL: "Please enter a valid email address.",
    URL: "Please enter a valid URL.",
    DATE: "Please enter a valid date.",
    NUMBER: "Please enter a valid number.",
    DIGIT: "Please enter only digits.",
    EQUAL_TO: "Please enter the same value again.",
    MATCH_PASSWORD: "Passwords do not match.",
    EMPTY: 'The field cannot be empty',
    NAME: 'Please enter a valid name',
    /**
     * @return {string}
     */
    MAX_LENGTH (arg) {
        return util.format("Please enter no more than %d characters.", arg);
    },
    /**
     * @return {string}
     */
    MIN_LENGTH (arg) {
        return util.format("Please enter at least %d characters.", arg);
    },
    /**
     * @return {string}
     */
    RANGE_LENGTH (arg, arg2) {
        return util.format("Please enter a value between %d and %d characters long.", arg, arg2);
    },
    /**
     * @return {string}
     */
    RANGE (arg, arg2) {
        return util.format("Please enter a value between %d and %d.", arg, arg2);
    },
    /**
     * @return {string}
     */
    MAX (arg) {
        return util.format("Please enter a value less than or equal to %d.", arg);
    },
    /**
     * @return {string}
     */
    MIN (arg) {
        return util.format("Please enter a value greater than or equal to %d.", arg);
    },
    /**
     * @return {string}
     */
    MIN_AGE (arg) {
        return util.format('You must be at least %d year(s) old.', arg)
    }
};

exports.validators = {
    notWhitespace (value) {
        return value || value.toString().trim().length > 0
    },
    /**
     * Check if a string is a valid name.
     *
     * @link https://stackoverflow.com/questions/150033/regular-expression-to-match-non-ascii-characters
     * @param value
     * @returns {boolean}
     */
    isName (value) {
        return /^[a-zA-Z\u00C0-\u1FFF\u2C00-\uD7FF]+(([',. -][a-zA-Z\u00C0-\u1FFF\u2C00-\uD7FF ])?[a-zA-Z\u00C0-\u1FFF\u2C00-\uD7FF]*)*$/gi.test(value);
    },
    uniqueEmail(value) {
        return User.query({where: {email: value}})
            .fetch()
            .then(user => {
                return !user ? Promise.resolve(true) : Promise.reject(new Error('validation:email:exists'));
            })
    },
    uniqueUsername(value) {
        return User.query({where: {username: value}})
            .fetch()
            .then(user => {
                return !user ? Promise.resolve(true) : Promise.reject(new Error('validation:username:exists'));
            })
    },
};