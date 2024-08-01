import express from "express";
import { Router } from "express";
import ReviewController from "../../controllers/profile/ReviewController.js";


const router = Router();

router.get("/", ReviewController.index);
router.post("/", ReviewController.store);
router.delete("/:id", ReviewController.destroy);


export default router;
