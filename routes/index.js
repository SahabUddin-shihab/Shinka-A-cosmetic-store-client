import { Router } from "express";
import HomeRoute from "./HomeRoute.js";
import AuthRoute from "./Auth/AuthRoute.js";
import GoogleRoute from "./Auth/GoogleRoute.js";
import FacebookRoute from "./Auth/FacebookRoute.js";
import ProfileRoute from "./Profile/ProfileRoute.js";
import TicketRoute from "./Profile/TicketRoute.js";
import WatchlistRoute from "./Profile/WatchlistRoute.js";
import ReviewRoute from "./Profile/ReviewRoute.js";
import BecomeSellerRoute from "./Profile/BecomeSellerRoute.js";
import LocalizationRoute from "./LocalizationRoute.js";



import auth from "../middleware/Auth.js";

const router = Router();

router.use("/", HomeRoute);
router.use("/frontent", LocalizationRoute);
router.use("/auth", AuthRoute);
router.use("/google", GoogleRoute);
router.use("/facebook", FacebookRoute);


router.use("/profile",ProfileRoute);
router.use("/watchlist", auth,WatchlistRoute);
router.use("/review", auth,ReviewRoute);
router.use("/ticket", auth,TicketRoute);
router.use("/seller-request",BecomeSellerRoute);

export default router;

