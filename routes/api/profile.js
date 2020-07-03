const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Person Model
const Person = require('../../models/Person');

//Load Profile Model
const Profile = require('../../models/Profile');

//  @type GET
// @route /api/profile
// @desc route for personal use profile
// @access private
// router.get("/",(req,res) =>res.json({test:"Profile is scuess"}));
router.get("/",
    passport.authenticate("jwt",{session:false}),
    (req,res) =>{
        Profile.findOne({user:req.user.id})
        .then(profile =>{
            if(!profile){
                return res.status(400).json({profilenotfound:"Profile not found"});
            }
            res.json(profile);
        })
        .catch()

});
module.exports = router;