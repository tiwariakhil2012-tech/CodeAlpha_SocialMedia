const express = require('express');
const router = express.Router();
const Post = require('../models/Createpost');
const auth = require('../middleware/auth'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//  Setup Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

//  CREATE POST ROUTE
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'No user ID found, authorization denied' });
    }

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text || '', 
      image: req.file ? `/uploads/${req.file.filename}` : '' 
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error("MONGODB SAVE ERROR:", err.message); 
    res.status(500).json({ error: err.message });
  }
});

//  GET ALL POSTS
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name']).sort({ date: -1 }); 
    res.json(posts);
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// 4. LIKE / UNLIKE POST ROUTE 
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const alreadyLiked = post.likes.some(like => like.user.toString() === req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    res.json(post.likes); // Return the updated likes array to the frontend
  } catch (err) {
    console.error("Like Error:", err.message);
    res.status(500).send('Server Error');
  }
});

//  DELETE POST
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;