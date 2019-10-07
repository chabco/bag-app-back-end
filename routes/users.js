var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const randToken = require('rand-token');

// MIGHT DELETE LATER

// Obtain information (all users) from DB.
router.get('/', (req, res) => {
	db.query("SELECT * FROM users", (err, results) =>{
		if (err) {throw err};
		res.json(results)
	})
})

// Obtain one userfrom DB by ID.
router.get('/:id', (req, res) => {
	console.log("Fetching user by ID:" + req.params.id)
	
	const userID = req.params.id

	db.query("SELECT * FROM users WHERE id = ?", [userID], (err, results) => {
		console.log("I think we fetched correctly?");
		res.json(results);
	})
})

// MIGHT DELETE LATER


// Filter access to database.
// Let front-end talk to DB, let a user sign up.
router.post('/', (req, res) => {
	console.log(req.body)
	const { username, email, password, hasAgreed } = req.body;
	if ((!username) || (!email) || (!password)) {
		// Empty entries? Stop.
		res.json({
			msg: "invalidData"
		})
		return;
	}
	// const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
	// db.query(checkUserQuery, [email], (err, results) => {
		// if (err) {throw err};
		// if (results.length > 0) {
		// 	res.json({
		// 		msg: "userExists"
		// 	})
		// }
		// else {
			const insertUserQuery = `INSERT INTO users (username, email, password, hasAgreed, token) VALUES (?, ?, ?, ?, ?)`;

			// Token and encrypted password. Safety first.
			// const salt = bcrypt.getSaltSync(10);
			// const hash = bcrypt.hashSync(password, salt);
			const token = randToken.uid(50);

			db.query(insertUserQuery, [username, email, password, hasAgreed, token], (err) => {
				if(err) {throw err};
				// Successful entry.

				res.json({
					username,
					email,
					token,
					msg: "userAdded"
				})
			})
		// }
	// })





	// LOGIN STUFF

	router.post('/login', (req, res) => {
		const { email, password } = req.body;

		const getEmail = `SELECT * FROM users WHERE email = ?`;

		db.query(getEmail, [email], (err, results) => {
			if (err) {throw err};
			if (results.length > 0) {
				const existingUser = results[0];

				// activate when you fix the bcrypt for registration
				// const passValidity = bcrypt.compareSync(password, existingUser.password)

				if (password === existingUser.password) {
					const token = randToken.uid(50);
					const updateUserTokenQuery = `UPDATE users SET token = ? WHERE email = ?`

					db.query(updateUserTokenQuery, [token, email], (err) => {
						if (err) {throw err};
					})

					res.json({
						username,
						email: existingUser.email,
						token,
						msg: "loggedIn"
						
					})
				} else {
					res.json({
						msg: "badPass"
					})
				}
			} else {
				res.json({
					msg: "noEmail"
				})
			}
		})
	})
})

// router.post('/'), ()

module.exports = router;
