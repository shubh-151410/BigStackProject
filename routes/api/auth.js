const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require("../../setup/myurl");

router.get("/", (req, res) => res.json({
    test: "Auth is sucess"
}));

//import schema for person register
const Person = require('../../models/Person');

//  @type Post
// @route /api/auth/register
// @desc route for registration
// @access public

router.post('/register', (req, res) => {
    Person.findOne({
            email: req.body.email
        })
        .then(
            person => {
                if (person) {
                    return res.status(400).json({
                        emailerror: "Email is already registered"
                    });
                } else {
                    const newperson = new Person({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    //Encrypt Password using bcrypt

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newperson.password, salt, (err, hash) => {
                            // Store hash in your password DB.
                            if (err) throw err;
                            newperson.password = hash;
                            newperson
                                .save()
                                .then(person => res.json(person))
                                .catch(err => console.log(error))
                        });
                    });
                }
            }
        )
        .catch(err => console.log(err));
});

//  @type Post
// @route /api/auth/login
// @desc route for login
// @access public

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Person.findOne({
            email
        })
        .then(person => {
            if (!person) {
                return res.status(400).json({
                    emailerror: "email not found"
                });
            }
            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        // res.json({sucess:"login successfull"});
                        //create payload
                        const payload = {
                            id: person.id,
                            name: person.name,
                            email: person.email,
                        };
                        jsonwt.sign(
                            payload,
                            key.secret,
                            { expiresIn: 3600 },
                            (err, token) => {
                              res.json({
                                success: true,
                                token: "Bearer " + token
                              });
                            }
                          );

                    } else {
                        res.status(400).json({
                            status: "password error"
                        });

                    }
                })
                .catch(
                    err => console.log(err)
                );
        })
        .catch(err => console.log(err));
});

//  @type GET
// @route /api/auth/Profile
// @desc route for userprofile
// @access private

router.get("/profile", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(res);
});



module.exports = router;