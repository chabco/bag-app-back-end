var express = require('express');
var router = express.Router();
const db = require('../db');

// talk to DB and get all users
router.get('/', (req, res) => {
	console.log('Getting everyone!')
	db.query("SELECT * FROM users", (err, results) =>{
		if (err) {throw err}
		res.json(results)
	})
})

// talk to DB and get 1 user by ID
router.get('/:id', (req, res) => {
	console.log("Fetching user by ID:" + req.params.id)
	
	const userID = req.params.id

	db.query("SELECT * FROM users WHERE id = ?", [userID], (err, results) => {
		console.log("I think we fetched correctly?");
		res.json(results);
	})
})

module.exports = router;
