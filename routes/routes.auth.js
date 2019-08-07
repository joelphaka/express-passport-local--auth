const express           = require('express');
const router            = express.Router();
const middlware         = require('../lib/middleware');
const AuthController    = require('../controllers/auth.controller');

router.get('/login', middlware.redirectToIfAuth(), AuthController.login.get);

router.post('/login', AuthController.login.post);

router.get('/register', AuthController.register.get);
router.post('/register', AuthController.register.post);

router.post('/logout', AuthController.logout);

module.exports = router;
