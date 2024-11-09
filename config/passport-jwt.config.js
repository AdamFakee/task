const passport = require('passport');
const User = require('../model/user.model');
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
        const user = await User.findOne({
            _id : jwt_payload.id,
            // status : 'active',
            deleted : false,
        }).select('_id fullName')
        if(!user) return done(null, false);

        req.payload = jwt_payload; // thêm vào để dùng cho việc check token trong black list
        return done(null, user);
    }));
    
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
    })(req, res, next);
}