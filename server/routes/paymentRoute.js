import jwtCheck from "../config/auth0Config.js";
import express from "express";
import { createPayment } from "../controllers/paymentCntrl.js";

const router = express.Router();

router.post("/create", jwtCheck, createPayment);

export { router as paymentRoute };
