import express from "express";
import { Router } from "express";
import HomeController from "../controllers/HomeController.js";


const router = Router();

router.get("/", HomeController.index);
router.get("/website-setup", HomeController.websiteSetup);
router.get("/events", HomeController.events);
router.get("/search-event", HomeController.search);
router.get("/latest-events", HomeController.latest_events);
router.get("/recent-events", HomeController.recent_events);
router.get("/populer-events", HomeController.populer_events);
router.get("/event/:id", HomeController.event);
router.get("/event-review/:id", HomeController.event_review);
router.get("/subcategories", HomeController.subcategories);
router.get("/organizers", HomeController.organizers);
router.get("/organizer-details/:id", HomeController.organizer);
router.get("/about-us", HomeController.about_us);
router.get("/contact-us", HomeController.contact_us);
router.get("/terms-condition", HomeController.terms_condition);
router.get("/privacy", HomeController.privacy);
router.post("/send/contactmail", HomeController.send_contactmail);
router.post("/send/subscribermail", HomeController.send_subscribermail);
router.get("/subscriber/verified/:email", HomeController.subscriber_verify);
router.get("/countries", HomeController.countries);

export default router;
