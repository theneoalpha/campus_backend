import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ message: 'Access denied' }); // Return early
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'MYNAMEISVIKASHANDIAMISINSIRSA');
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (!res.headersSent) {
            res.status(400).json({ message: 'Invalid token' });
        }
    }
};


const isAdmin = (req, res, next) => {
    if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    next();
};
export { verifyToken, isAdmin };
