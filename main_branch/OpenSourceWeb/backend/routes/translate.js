var express = require("express");
var router = express.Router();

// Translate endpoint - uses MyMemory free API
// POST /translate
router.post("/", function(req, res) {
  var text = req.body.text;
  var from = req.body.from;
  var to = req.body.to;

  if (!text || !from || !to) {
    return res.json({ success: false, message: "text, from, to are required" });
  }

  // Build URL for MyMemory API
  var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + from + "|" + to;

  // Call the API
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var translated = data.responseData.translatedText;
      res.json({ success: true, translatedText: translated });
    })
    .catch(function(err) {
      console.log("translate error:", err);
      res.json({ success: false, message: "translation failed" });
    });
});

module.exports = router;