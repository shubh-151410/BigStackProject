const express = require('express');
const router = express.Router();

router.get("/",(req,res) => res.json({test:"Auth is sucess"}));

module.exports = router;