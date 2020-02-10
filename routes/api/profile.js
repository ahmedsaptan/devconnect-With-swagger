const router = require('express').Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require("../../models/User");
const {check, validationResult } = require('express-validator');

router.get('/me', auth, async (req, res) => {
	try {
		const profile = await  Profile.findOne({user: req.user.id}).populate('User', [
			'name',
			'avatar'
		]);

		if(!profile) {
			return res.status(400).json({
				msg: 'There is no profile this user'
			})
		}

		await res.json(profile);

	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server Error');
	}
});

router.post('/', [auth, [
	check('status', 'Status is required').notEmpty(),
	check('skills', 'Skills is required').notEmpty()
]], async (req, res) => {
	const erros = validationResult(req);
	if(!erros.isEmpty()) {
		return res.status(400).json({erros: erros.array()})
	}

	const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin} = req.body;
	const profileFields = {};
	profileFields.user = req.user.id;

	if(company) {
		profileFields.company = company;
	}
	if(website) {
		profileFields.website = website;
	}
	if(location) {
		profileFields.location = location;
	}
	if(bio) {
		profileFields.bio = bio;
	}
	if(status) {
		profileFields.status = status;
	}
	if(githubusername) {
		profileFields.githubusername = githubusername;
	}
	if(skills) {
		profileFields.skills = skills.split(',').map(skill => skill.trim());
	}

	profileFields.social = {};

	if(youtube) {
		profileFields.social.youtube = youtube;
	}
	if(facebook) {
		profileFields.social.facebook = facebook;
	}
	if(instagram) {
		profileFields.social.instagram = instagram;
	}
	if(linkedin) {
		profileFields.social.linkedin = linkedin;
	}
	if(twitter) {
		profileFields.social.twitter = twitter;
	}

	try {
		let profile = await Profile.findOne({user: req.user.id});

		console.log("profile", profile);
		if(profile) {
			// update
			await Profile.findOneAndUpdate({
				user: req.user.id
			}, {
				$set: profileFields
			}, {
				new: true
			});
		 return res.json(profile);
		} else {
			//create new one
			profile = new Profile(profileFields);
			await profile.save();
			return res.json(profile);

		}
	} catch (e) {
		console.log(e.message);
		res.status(500).send('server error');
	}
});

module.exports = router;
