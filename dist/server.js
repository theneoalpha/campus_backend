import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
dotenv.config();
connectDB();
console.log(process.env.JWT_SECRET);
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api/user', router);
app.use('/api', postRouter);
// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
