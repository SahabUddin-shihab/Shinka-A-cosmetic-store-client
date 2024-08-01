import express from "express";
import { Router } from "express";
import BecomeSellerController from "../../controllers/profile/BecomeSellerController.js";


const router = Router();

import auth from "../../middleware/Auth.js";

router.post("/", BecomeSellerController.become_seller);
router.post("/mobile", BecomeSellerController.become_seller_mobile);
router.get("/status", auth,BecomeSellerController.seller_request_status);

export default router;
