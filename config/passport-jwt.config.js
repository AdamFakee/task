const passport = require('passport');
const User = require('../model/user.model');
const { redis } = require('./ioredis.config');
const { addToString, getInString } = require('../helper/ioredis.helper');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// options  
let opts = {}
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.passReqToCallback = true;
// khác với passport-local, cái này chạy qua strategy liên tục như 1 middleware còn cái local chỉ chạy quả strategy lần đầu rồi mã hóa = sequelize... sau cái desequelize... được chạy qua liên tục để decode

module.exports.passportConfig = () => {
    passport.use(new JwtStrategy(opts, async function(req, jwt_payload, done) { 
        // check in cache
        const key = `user:${jwt_payload.id}`; // key in cache
        let userInCache = await getInString(key); // data in cache
        if(userInCache) {
            userInCache = JSON.parse(userInCache); 
            req.payload = jwt_payload; // thêm vào để dùng cho việc check token trong black list
            return done(null, userInCache); 
        }
        // end check in cache
        const user = await User.findOne({
            _id : jwt_payload.id,
            status : 'active',
            deleted : false,
        }).select('role fullName')

        // set to cache
        await addToString(key, user, 300); // 300s
        // End set to cache
        if(!user) return done(null, false);

        req.payload = jwt_payload; // thêm vào để dùng cho việc check token trong black list
        return done(null, user);
    }));
    

    // do cái passportAuthenticateConfig đã check xong rồi next luôn nên k chạy vào 2 cái này nữa 
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}

module.exports.passportAuthenticateConfig = (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
        if (err) {
            return res.status(401).json({ code: 401, message: 'Unauthorized' });
        }
        if(!user) {
            return res.status(404).json({ code: 404, message: 'not found' });
        }
        next();
        return;
    })(req, res, next);
}