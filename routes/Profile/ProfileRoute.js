import express from "express";
import { Router } from "express";
import ProfileController from "../../controllers/profile/ProfileController.js";
import auth from "../../middleware/Auth.js";

const router = Router();

router.get("/",auth,ProfileController.profile);
router.get("/cities",auth,ProfileController.cities);
router.post("/change-password",auth,ProfileController.chnage_password);
router.post("/update-profile", ProfileController.update_profile);


export default router;
