import express from "express";
import { Router } from "express";
import LoginController from "../../controllers/auth/LoginController.js";
import RegisterController from "../../controllers/auth/RegisterController.js";


const router = Router();

router.post("/login", LoginController.login);
router.post("/forgot-password-send-mail", LoginController.forgot_password_email);
router.get("/check-otp/:otp", LoginController.check_otp);
router.post("/reset-password/:otp", LoginController.reset_password);
router.post("/register", RegisterController.store);
router.get("/account/verified/:token", RegisterController.account_verify);
router.post("/account/resend/email", RegisterController.resendEmail);

export default router;
