const router = require('express').Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');

// @route Post api/users
// @desc Register a user
// @access Publlic
router.post(
	'/',
	[
		check('email', 'Please include a valid Email').isEmail(),
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					errors: [{ msg: 'User already exists' }]
				});
			}

			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			user = new User({
				name,
				email,
				password,
				avatar
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				process.env.SECRET_KEY,
				{
					expiresIn: 360000
				},
				(err, token) => {
					if (err) {
						throw err;
					} else {
						return res.json({ token });
					}
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('server Error');
		}
	}
);

module.exports = router;
