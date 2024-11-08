const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require("connect-redis").default
const Redis = require('ioredis');
const passport = require('passport');
const { passportAuthenticateConfig, passportConfig } = require('./config/passport-jwt.config');

 
// ioredis + connect-redis
const redis = new Redis(process.env.REDIS_CLOUD);
let redisStore = new RedisStore({
  client: redis,
  prefix: "myapp:",
})
// session
app.use(session({
  secret: 'keyboard cat',
  resave: false, 
  saveUninitialized: true, // true : It means that Your session will be stored into your storage Everytime for request. It will not depend on the modification of req.session.
  // true : It means that Your session is only Stored into your storage, when any of the Property is modified in req.session
  cookie: { secure: false },
  store : redisStore
}))

// initial passport
app.use(passport.initialize());
app.use(passport.session());

// passport-jwt-strategy
passportConfig();
app.use(passportAuthenticateConfig)
// database
const databaseConfig = require('./config/database.config');
databaseConfig.connect();
// End database

// cors
app.use(cors());
// End cors


// body-parser
app.use(bodyParser.json())
// End body-parser

// router 
const clientRouter = require('./router/client/index.router');
clientRouter(app);
// End router

app.listen(port, () => {
    console.log(`running ${port}`)
})