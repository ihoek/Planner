import express from "express";
import { sequelize } from "../db.js";

const router = express.Router();

router.post("/schedule", async (req, res) => {
  const { date, time, userId } = req.body;
  console.log(date, time, userId);
  res.status(200).json({ message: "Schedule saved successfully" });
});

export default router;
