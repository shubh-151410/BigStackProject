const express = require('express');
const router = express.Router();

router.get("/",(req,res) => res.json({test:"question is sucess"}));
module.exports = router;