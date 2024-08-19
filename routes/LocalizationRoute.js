import express from "express";
import { Router } from "express";
import LocalizationController from "../controllers/LocalizationController.js";


const router = Router();

router.get("/localization", LocalizationController.getData);
router.put("/language/update", LocalizationController.updateData);

export default router;

