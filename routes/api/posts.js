const router = require('express').Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

router.post(
	'/',
	[auth, check('text', 'Text is required').notEmpty()],
	async (req, res) => {
		const erros = validationResult(req);
		if (!erros.isEmpty()) {
			return res.status(400).json({ erros: erros.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const newPost = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			};

			const post = new Post(newPost);
			await post.save();
			res.json(post);
		} catch (e) {
			console.log(e.message);
			return res.status(500).send('Server Error');
		}
	}
);

router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server Error');
	}
});

router.get('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({
				msg: 'Post not found'
			});
		}

		return res.json(post);
	} catch (e) {
		console.log(e.message);

		if (e.kind == 'ObjectId') {
			return res.status(404).send({
				msg: 'Post not found'
			});
		}
		res.status(500).send('Server Error');
	}
});

router.delete('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if (!post) {
			return res.status(404).json({
				msg: 'Post not found'
			});
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({
				msg: 'User not authorized'
			});
		}
		await post.remove();

		return res.status(404).json({
			msg: 'post removed'
		});
	} catch (e) {
		console.log(e.message);

		if (e.kind === 'ObjectId') {
			return res.status(404).send({
				msg: 'Post not found'
			});
		}
		res.status(500).send('Server Error');
	}
});

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(400).send({ msg: 'Post not found' });
		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length > 0
		) {
			return res.status(400).json({ msg: 'Post already liked' });
		}
		post.likes.unshift({ user: req.user.id });
		await post.save();

		res.json(post.likes);
	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server Error');
	}
});

router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(400).send({ msg: 'Post not found' });
		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length == 0
		) {
			return res.status(400).json({ msg: 'Post has not yet been liked' });
		}

		const removeIndex = post.likes
			.map(like => like.user.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server Error');
	}
});

router.post(
	'/comment/:id',
	[auth, [check('text', 'Text is required').notEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			};

			post.comments.unshift(newComment);

			await post.save();

			return res.json(post.comments);

		} catch (error) {
			console.log(error.message);
			res.status(500).send('Server Error');
		}
	}
);


router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if(!post) {
			return res.status(400).json({msg: 'Post not found'});
		}

		const comment = post.comments.find((item) =>  item.id === req.params.comment_id);

		if(!comment) {
			return res.status(400).json({msg: 'Comment not found'});
		}

		if(comment.user.toString() !== req.user.id) {
			return res.status(401).json({msg: 'User not authorized'});
		}

		const removeIndex = post.comments.map(item => item.user.toString()).indexOf(req.user.id);

		console.log(removeIndex);
		post.comments.splice(removeIndex, 1);
		res.json(post.comments);
	} catch (e) {
		console.log(e.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
