var express = require('express');
var router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
	db.query("SELECT * FROM bags", (err, results) =>{
		if (err) {throw err};
		res.json(results)
	})
})

module.exports = router;