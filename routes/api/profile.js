const router = require("express").Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

const { check, validationResult } = require("express-validator");
const request = require('request');

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("User", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile this user"
      });
    }

    await res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty()
    ]
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};

    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }
    if (twitter) {
      profileFields.social.twitter = twitter;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      console.log("profile", profile);
      if (profile) {
        // update
        await Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        );
        return res.json(profile);
      } else {
        //create new one
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).send("server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server error");
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "No profile fro this user" });
    }
    return res.json(profile);
  } catch (e) {
    console.log(e.message, e.kind);
    if (e.kind == "ObjectId") {
      return res.status(400).json({ msg: "No profile fro this user" });
    }
    res.status(500).send("Server error");
  }
});


router.delete("/", auth, async (req, res) => {
  console.log("Delete Profile..");
  try {
    // @todo - remove users posts...

    await Post.deleteMany({ user: req.user.id});
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findByIdAndRemove(req.user.id);

    return res.json({msg: 'User Deleted'});
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }
});

router.put("/experience", [auth, [
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From is required').notEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const {title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title, company, location, from, to, current, description
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);

    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server Error');
  }

});


router.delete("/experience/:exp_id", auth, async (req, res) => {
  console.log("go on");
  try {
    const profile = await Profile.findOne({user: req.user.id});

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }
});


router.put("/education", [auth, [
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From is required').notEmpty()
]], async (req, res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array()
    })
  }

  const { school, degree, fieldofstudy, from, to, current, description } = req.body;

  const newEdu = {
    school, degree, fieldofstudy, from, to, current, description
  };

  try {
    const profile = await Profile.findOne({user: req.user.id});

    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server Error');
  }

});


router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});

    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }

});


router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js'
      }
    };

    request(options, (error, response, body) => {
      if(error) {
        console.log(error)
      }

      if(response.statusCode !== 200) {
        return res.status(400).json({msg: 'No Github profile found'});
      }
      res.json(JSON.parse(body));
    })
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Srever Error');
  }
});
module.exports = router;
