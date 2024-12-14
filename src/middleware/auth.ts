import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

interface IJwtPayload {
  id: string;
  role: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as IJwtPayload;
    req.user = decoded; // Store user info in the request object
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  next();
};

export { verifyToken, isAdmin };
