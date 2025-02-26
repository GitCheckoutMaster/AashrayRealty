import express from "express";
import {
	createResidency,
	getAllResidencies,
	getResidency,
	removeResidency,
	getResidencyByOwner,
	getReviews,
    submitReview,
	findReview,
	submitQuery,
	getQuery,
	writeAnswer,
} from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

router.post("/create", jwtCheck, createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);
router.post("/getReviews", getReviews);
router.post("/findQuery", getQuery);
router.get("/remove/:id", jwtCheck, removeResidency);
router.post("/getByOwner", jwtCheck, getResidencyByOwner);
router.post("/submitReview", jwtCheck, submitReview);
router.post("/findReview", jwtCheck, findReview);
router.post("/submitQuery", jwtCheck, submitQuery);
router.post("/writeAnswer", jwtCheck, writeAnswer);

export { router as residencyRoute };
