const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
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