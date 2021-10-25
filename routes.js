const express = require("express");
const userProfile = require("./controller/userProfile");

const router = express.Router();

router.get("/health", (req, res) => {
    res.send("Server running!!").status(200);
})

router.get("/user-profile", userProfile.get);
router.post("/user-profile", userProfile.create);
module.exports = router;