
import Post from "../models/Posts.js";

const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    // Create a new post associated with the logged-in user
    const newPost = new Post({
      user: req.user.id, // Use the user ID from the JWT token
      content,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    // Fetch all posts, including user data
    const posts = await Post.find().populate('user', 'name');
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

   
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};

export { createPost, getPosts, deletePost };
