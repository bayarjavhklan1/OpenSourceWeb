const express = require("express");
const router = express.Router();
const {
  addSubscriber,
  getSubscriberCount,
} = require("../controllers/subscriberController");

// POST /api/subscribers
router.post("/", addSubscriber);

// GET /api/subscribers/count
router.get("/count", getSubscriberCount);

module.exports = router;