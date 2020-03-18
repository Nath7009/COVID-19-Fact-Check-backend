var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
    res.write('Backend is working properly');
    res.end();
});

module.exports = router;