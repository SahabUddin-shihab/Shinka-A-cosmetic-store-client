import express from "express";
import passport from "passport";
import { Router } from "express";
import GoogleloginController from "../../controllers/auth/GoogleloginController.js";

const router = Router();

router.get("/login", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/error" }),
  function (req, res) {

    const user = req.user;
    return res.json({
      user : {
          id : user.id,
          name : user.name,
          email : user.email,
          image : user.image
      },
      token,
      user_type : 'user',
      message: "Logged in successfully!",
    });
    //res.redirect("/");
  }
);

export default router;