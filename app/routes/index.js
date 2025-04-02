const express = require('express');
const router = express.Router();

const app = express();
router.get('/', function (req, res, next) {
	const json = {
		code: 200,
		message: "Hello world!"
	};
	res.json(json);
});



module.exports = router;