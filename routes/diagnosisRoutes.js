const express = require("express");
const router = express.Router();
const Diagnosis = require("../models/Diagnosis");
const verifyToken = require("../middleware/verifyToken");

const { savetestresult, getdiagnosis,history } = require("../controllers/diagnosisController");
router.post("/save", verifyToken, savetestresult);
router.get("/latest", verifyToken, getdiagnosis);
router.get("/history", verifyToken, history);