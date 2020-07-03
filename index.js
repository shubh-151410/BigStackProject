const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const auth  = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const question = require('./routes/api/question');
const passport = require('passport');

const app = express();

//Middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//mongo db configuration
const db = require('./setup/myurl').mongoURL;


//attempt to connect mongodb
mongoose.connect(db).then(() => console.log("mongo db connected successfully")).catch((error) => console.log(error));

//Passport middleware
app.use(passport.initialize());

//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);

const port = process.env.port || 4000;

// just for testing route
app.get("/", (req, res) => res.send("Hello big stack"));

// actual routes
app.use("/api/auth",auth);

// profile routes
 app.use("/api/profile",profile);

 //question routes
 app.use("/api/question",question);

app.listen(port, () => console.log(`server is running at ${port}`));