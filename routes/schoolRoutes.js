import express from "express";
import SchoolController from "../controllers/SchoolController.js";

const router = express.Router();

router.post("/add", SchoolController.addSchool);
router.get("/list", SchoolController.listSchools);

export default router;
