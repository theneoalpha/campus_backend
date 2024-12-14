var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const registerUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
      const existingUser = yield User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }
      const hashedPassword = yield bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      yield newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error registering user" });
    }
  });
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "MYNAMEISVIKASHANDIAMISINSIRSA",
      { expiresIn: "1h" }
    );

    // Ensure no further response is sent after this
    return res.json({ token });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Error logging in" + err });
    }
  }
};

// const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     try {
//         const user = yield User.findById(req.user.id);
//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }
//         // Include user id in the response
//         res.json({ id: user._id, name: user.name, email: user.email, role: user.role, approved: user.approved });
//     }
//     catch (err) {
//         res.status(500).json({ message: 'Error fetching user details' });
//     }
// });
const getUserDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.approved) {
        return res
          .status(403)
          .json({
            message:
              "You are not a verified user, please wait for verification",
          });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching user details" });
    }
  });

  const publicUsers = async (req, res) => {
    try {
       
        const users = await User.find({ approved: true, role: 'user' }, '-password'); 
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};


const approveUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
      const user = yield User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      user.approved = true;
      yield user.save();
      res.json({ message: "User approved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error approving user" });
    }
  });

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};
export { registerUser, loginUser, getUserDetails, approveUser, getAllUsers, publicUsers };
