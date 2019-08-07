const app = require('../app');
const {port} = require('../config/settings');

app.set('port', port);

const server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port + "\n");
});