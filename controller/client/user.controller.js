const User = require('../../model/user.model');
const ForgotPassword = require('../../model/forgot-password.model');
const generateHelper = require('../../helper/generate.helper');
const sendMailHelper = require('../../helper/sendMail.helper');
const md5 = require('md5');
const jwt = require('jsonwebtoken');


// [POST] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {

    // {
    //     "email" : ""
    // }

    try {
        const user = await User.findOne({
            email : req.body.email,
        })

        if(!user){
            res.status(404).json({
                code : 404,
                message : 'dont found email in database'
            });
        }
        await ForgotPassword.deleteMany({  // check exit OTP with this email 
            email : req.body.email,
        })

        const OTP = generateHelper.OTP(4);
        const newOTP = new ForgotPassword({
            otp : OTP,
            email : req.body.email,
            expireAt: Date.now() + 3*60*1000 // 3 minutes
        });
        await newOTP.save();

        const sendOtpToEmail = {
            subject : 'đây là mã otp',
            email : req.body.email,
            text : `mã otp để khôi phục mật khẩu là : ${OTP}`,
        }
        sendMailHelper(sendOtpToEmail.subject, sendOtpToEmail.email, sendOtpToEmail.text);
        const accessTokenToEnterOtp = jwt.sign({id : user.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '3m'
          });
        res.status(200).json({
            code : 200, 
            message : "send otp succesfully",
            email : req.body.email,
            accessTokenToEnterOtp : accessTokenToEnterOtp,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message : "error"
        })
    };
}

// [POST] /user/password/otp
module.exports.otpPassword = async (req, res) => {

    // {
    //     "email" : "sosaangel25@kimgmail.com",
    //     "OTP" : "2787"
    // }

    try {
        const {email, OTP} = req.body;
        const existOTP = await ForgotPassword.findOne({
            email : email,
            otp : OTP,
            
        });
        
        if(existOTP){
            res.status(200).json({
                code : 200,
                messase : 'write otp successfully',
                email : email,
            })
        } else {
            res.status(406).json({
                message : 'otp invalid',
            })
        }
    } catch (error) {
        res.json({
            message : "error"
        })
    }
}

// [PATCH] /user/password/reset
module.exports.resetPassword = async (req, res) => {

    // {
    //     "email" : "joypo1993@chupanhcuoidep.com",
    //     "password" : "1"
    // }

    try {
        const email = req.body.email;
        const password = md5(req.body.password);
        await User.updateOne({
            email : email,
        }, {
            password : password,
        })

        res.json({
            code : 200,
            message : 'reset password successfully'
        })
    } catch (error) {
        res.json({
            message : "error"
        })
    }
}


