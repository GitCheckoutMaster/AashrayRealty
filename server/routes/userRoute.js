import express from "express";
import {
  bookVisit,
  cancelBooking,
  createUser,
  getAllBookings,
  getAllFavorites,
  toFav,
  addAdmin,
  removeAdmin,
  getAllUsers,
  editProfile,
  getEveryBooking,
  getAllCancellation,
} from "../controllers/userCntrl.js";
import jwtCheck from "../config/auth0Config.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFavorites);
router.post("/addAdmin", jwtCheck, addAdmin);
router.post("/removeAdmin", jwtCheck, removeAdmin);
router.get("/getCustomers", jwtCheck, getAllUsers);
router.post("/editProfile", jwtCheck, upload.single("image"), editProfile);
router.get("/getEveryBooking", jwtCheck, getEveryBooking);
router.get("/getEveryCancellation", jwtCheck, getAllCancellation);
export { router as userRoute };
