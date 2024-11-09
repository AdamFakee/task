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
const { addToBlackListToken, checkExistInBlackListTokenFunction } = require('./helper/blackListToken.helper');
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
        }).select('-password -email -createdAt -updatedAt -deleted -refreshToken')
        if(user){
            const token = generateHelper.jwtToken({id : user._id});
            await User.updateOne({
                _id : user._id,
            }, {
                refreshToken : token.refreshToken,
            })
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
    // {
    //     "refreshToken" : "..."
    // }
    const accessToken = req.headers.authorization.split(' ')[1]; 
    const refreshToken = req.body.refreshToken;
    if(!refreshToken && !accessToken){
        res.status(404).json({
            code : 404,
            message : 'not exist token'
        });
        return;
    }
    let user;
    try {
        const payloadInAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const payloadInRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(payloadInAccessToken.id != payloadInRefreshToken.id) { 
            return res.status(409).json({
                code : 409,
                message : 'data in accessToken differ data in refreshToken'
            })
        }
        const checkExist = await checkExistInBlackListTokenFunction(payloadInAccessToken); // check accessToken in blackList
        console.log(checkExist)
        if(checkExist == false) {
            return res.status(498).json({
                code : 498,
                message : 'token in black list'
            });
        }
        user = await User.findOne({
            _id : payloadInAccessToken.id,
        })
    } catch (error) {
        return res.status(498).json({
            code : 498,
            message : 'verify err'
        })
    }
    if(user){
        addToBlackListToken(accessToken); // add accessToken to blackList
        const token = generateHelper.jwtToken({ id : user._id});
        await User.updateOne({
            _id : user._id,
        }, {
            refreshToken : token.refreshToken,
        })
        res.status(200).json({
            code : 200,
            message : "refresh token successfull",
            accessToken : token.accessToken,
            refreshToken : token.refreshToken
        });
    } else {
        res.status(404).json({
            code : 404,
            message : 'not exist user'
        });
    }
})
// End generate token

// logout
app.delete('/logout', async (req, res) => { 
    const accessToken = req.headers.authorization.split(' ')[1]; 
    if(!accessToken){
        res.status(404).json({
            code : 404,
            message : 'not exist'
        });
        return;
    }
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        await User.updateOne({
            _id : payload.id,
        }, {
            refreshToken : null,
        })
        await addToBlackListToken(accessToken); // logout => token is not exp => add to black list
        res.json({
            code : 200,
            message : 'logout'
        })
    } catch (error) {
        console.log(error)
        res.status(498).json({
            code : 498,
            message : 'error'
        })
        return;
    }
})
// End logout
app.listen(port, () => {
    console.log(`running ${port}`)
})