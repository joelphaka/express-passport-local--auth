const express           = require('express');
const router            = express.Router();
const middlware         = require('../lib/middleware');
const HomeController    = require('../controllers/home.controller');

router.get('/', HomeController.index);
router.get('/about', HomeController.about);

module.exports = router;