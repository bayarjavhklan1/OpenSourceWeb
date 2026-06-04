import express from "express";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Generate URL for the uploaded file
  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    imageUrl: imageUrl,
  });
});

export default router;
