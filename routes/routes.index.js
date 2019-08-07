exports.Home = require('./routes.home');
exports.Auth = require('./routes.auth');

module.exports = (app) => {

    app.use('/', this.Home);
    app.use('/', this.Auth);
};