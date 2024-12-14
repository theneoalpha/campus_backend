import Post from "../models/Posts.js";

const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = new Post({
      user: req.user.id,
      content,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name");
    res.json({ posts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).populate(
      "user",
      "name"
    );
    res.json({ posts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching your posts", error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

export { createPost, getPosts, getUserPosts, deletePost };
