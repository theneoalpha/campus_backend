import { Router } from 'express';
import { createPost, getPosts, deletePost } from '../controllers/postController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const postRouter = Router();

postRouter.post('/createPosts', verifyToken, createPost);
postRouter.get('/getPosts', getPosts);
postRouter.delete('/:postId', verifyToken, deletePost);

export default postRouter;