var express = require('express');
var router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
	db.query("SELECT * FROM bags", (err, results) =>{
		if (err) {throw err};
		res.json(results)
	})
})

// Obtain one bag from DB by ID.
router.get('/:id', (req, res) => {
	console.log("Fetching user by ID:" + req.params.id)
	
	const bagID = req.params.id

	db.query("SELECT * FROM bags WHERE id = ?", [bagID], (err, results) => {
		console.log("I think we fetched correctly?");
		res.json(results);
	})
})

module.exports = router;