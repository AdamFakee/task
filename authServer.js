const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const User = require('./model/user.model');
const generateHelper = require('./helper/generate.helper');
// database
const databaseConfig = require('./config/database.config');
const { limiter } = require('./helper/rateLimitTraffic.helper');
databaseConfig.connect();
// End database

// cors
app.use(cors());
// End cors


// body-parser
app.use(bodyParser.json())
// End body-parser


// configure in rateLimit
const message = 'too many click', limitHit = 1, windowMs = 30 * 1000; // 30s
// End configure in rateLimit

// register
app.post('/register', limiter(windowMs, limitHit, message), async (req, res) => {

    // {
    //     "email" : "",
    //     "password" : "",
    //     "fullName" : ""
    // }

    try {
        req.body.password = md5(req.body.password); // mã hóa password
        const newUser = new User(req.body);
        const clipboard = newUser; // bản sao của newUser
        await newUser.save();

        const token = generateHelper.jwtToken({id : newUser._id}); // tạo token
        await User.updateOne({
            _id : newUser._id,
        }, {
            refreshToken : token.refreshToken
        })
        res.cookie('refreshToken', token.refreshToken);
        res.status(200).json({
            code : 200,
            message : "register successful",
            newUser : clipboard,
            accessToken : token.accessToken,
            refreshToken : token.refreshToken
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            code : 401,
            message : 'register un-successful'
        })
    }
} )
// End register

// login 
app.post('/login', async (req, res) => {

    // {
    //     "email" : "",
    //     "password" : ""
    // }

    try {
        req.body.password = md5(req.body.password); // mã hóa pass
        const user = await User.findOne({
            email : req.body.email,
            password : req.body.password,
        }).select('-password -email -createdAt -updatedAt -deleted')
        if(user){
            const token = generateHelper.jwtToken({id : user._id});
            await User.updateOne({
                _id : user._id,
            }, {
                refreshToken : token.refreshToken,
            })
            res.cookie('refreshToken', token.refreshToken)
            res.status(200).json({
                code : 200,
                message : "login successful",
                user : user,
                accessToken : token.accessToken,
                refreshToken : token.refreshToken
            });
        } else {
            res.status(404).json({
                code : 404,
                message : 'email or password in-correct'
            });
        }
        
    } catch (error) {
        console.log(error)
        res.json({
            message : 'login un-successful'
        })
    }
})
// End login

// generate token
const WindowMsResetToken = 10 * 60 * 1000; // 10m
app.patch('/reset-token', limiter(WindowMsResetToken, limitHit, message), async (req, res) => {

    const refreshToken = req.headers.authorization.split(' ')[1]; 
    if(!refreshToken){
        res.json({
            message : 'not exist'
        });
        return;
    }
    let user;
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        user = await User.findOne({
            _id : decoded.id,
        })
    } catch (error) {
        res.json({
            message : 'error'
        })
        return;
    }
    if(user){
        const token = generateHelper.jwtToken({ id : user._id});
        await User.updateOne({
            _id : user._id,
        }, {
            refreshToken : token.refreshToken,
        })
        res.cookie('refreshToken', token.refreshToken)
        res.json({
            code : 200,
            message : "login successful",
            accessToken : token.accessToken,
            refreshToken : token.refreshToken
        });
    } else {
        res.json({
            message : 'not exist'
        });
    }
})
// End generate token

// logout
app.delete('/logout', async (req, res) => { 
    try {
        const decoded = req.decoded;
        await User.updateOne({
            _id : decoded.id,
        }, {
            refreshToken : null,
        })
        res.json({
            code : 200
        })
    } catch (error) {
        console.log(error);
        res.json({
            message : 'error 666'
        })
    }
})
// End logout
app.listen(port, () => {
    console.log(`running ${port}`)
})