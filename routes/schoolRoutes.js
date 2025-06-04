import express from "express";
import SchoolController from "../controllers/SchoolController.js";

const router = express.Router();

router.post("/addSchool", SchoolController.addSchool);
router.get("/listSchools", SchoolController.listSchools);

export default router;
