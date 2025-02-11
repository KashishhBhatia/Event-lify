import express from "express";
const router = express.Router();
import verifyToken from "../utils/verifyToken.js";
import * as userControllers from "../controllers/user.js";



router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.get("/auth-status", verifyToken, userControllers.verifyUser);
router.post("/logout", verifyToken, userControllers.userLogout);
router.get("/eventsRegistered", verifyToken, userControllers.getEventsRegistered);
router.get('/eventsCreated', verifyToken, userControllers.getEventsCreated);

export default router;
