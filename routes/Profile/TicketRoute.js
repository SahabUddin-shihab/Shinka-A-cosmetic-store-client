import express from "express";
import { Router } from "express";
import TicketController from "../../controllers/profile/TicketController.js";


const router = Router();

router.get("/", TicketController.profile);
router.post("/", TicketController.store);


export default router;
