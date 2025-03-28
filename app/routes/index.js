var express = require('express');
var router = express.Router();

var app = express();
router.get('/', function (req, res, next) {
	const json = {
		code: 200,
		message: "Hello world!"
	};
	res.json(json);
});



module.exports = router;