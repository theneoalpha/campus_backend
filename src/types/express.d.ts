// src/types/express.d.ts
import { User } from './models/user'; // Import your User type here

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property with the User type
    }
  }
}
