import express from "express";
import { Router } from "express";
import WatchlistController from "../../controllers/profile/WatchlistController.js";


const router = Router();

router.get("/", WatchlistController.index);
router.post("/", WatchlistController.store);
router.delete("/:id", WatchlistController.destroy);


export default router;
