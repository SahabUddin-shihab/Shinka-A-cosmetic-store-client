import express from "express";
import passport from "passport";
import { Router } from "express";
import GoogleloginController from "../../controllers/auth/GoogleloginController.js";
import generateToken from "../../utils/GenerateToken.js";

const router = Router();

router.get("/login", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/error" }),
  function (req, res) {

    const user = req.user;
    const token = generateToken(user); 
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

export default router;