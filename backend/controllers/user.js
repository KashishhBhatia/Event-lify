import User from '../model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../utils/constants.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Clear any existing cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "eventlify.onrender.com",
      signed: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    // Create token and store cookie
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      domain: "eventlify.onrender.com",
      signed: true,
      secure: true,
      path: "/",
      sameSite: "none",
      expires: expires, // Correctly set the expiration date
    });

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email, _id: user._id });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // User login
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }

    // Clear any existing cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "eventlify.onrender.com",
      signed: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    // Create token and store cookie
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      domain: "eventlify.onrender.com",
      signed: true,
      secure: true,
      path: "/",
      sameSite: "none",
      expires: expires, // Correctly set the expiration date
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email, _id: user._id });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    // Assume that a previous middleware (e.g., verifyToken) has set res.locals.jwtData
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email, _id: user._id });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    // Verify user existence before logging out
    const user = await User.findById(res.locals.jwtData.id);
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    // Clear the authentication cookie with the same options as used during login/signup
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "eventlify.onrender.com",
      signed: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};

export const getEventsRegistered = async (req, res) => {
  try {
    // Verify user existence before fetching enrolled events
    const user = await User.findById(res.locals.jwtData.id).populate(
      "events_registered");
    if (!user) {
      return res
        .status(401)
        .send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", events: user.events_registered });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};

export const getEventsCreated = async (req, res) => {
  try {
    // Verify user existence before fetching created events
    const user = await User.findById(res.locals.jwtData.id).populate(
      "events_created");  
    if (!user) {
      return res
        .status(401)
        .send("User not registered OR Token malfunctioned");
    }       
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", events: user.events_created });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ message: "ERROR", cause: error.message });
  }
};
