const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		res.json(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: 'Server Error'
		});
	}
});

// @route Post api/auth
// @desc auth a user and get token
// @access Publlic
router.post(
	'/',
	[
		check('email', 'Email is required').isEmail(),
		check('password', 'Password is required').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid Credentials' }]
				});
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid Credentials' }]
				});
			}

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
