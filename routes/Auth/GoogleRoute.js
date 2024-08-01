import express from "express";
import passport from "passport";
import { Router } from "express";
import GoogleloginController from "../../controllers/auth/GoogleloginController.js";

const router = Router();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google"),
  GoogleloginController.googleAuth
);

export default router;