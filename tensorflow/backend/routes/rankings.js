const express = require('express');
const router = express.Router();
const maindata = require('../controller/mainDataController');

router.get('/', maindata.data);

router.get('/myscore',maindata.myscore)

router.post('/addScore',maindata.addData)

module.exports = router;
