const User = require('../../model/user.model');
const jwt = require('jsonwebtoken');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        res.json({
            message : 'no token'
        });
        return;
    }
    let currentUser;
    try {
        const accessToken = token.split(' ')[1];
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        currentUser = await User.findOne({
            _id : decoded.id,
        });
        if(!currentUser){
            res.json({
                message : 'not found'
            })
            return;
        }
        req.decoded = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.json({
            message : 'error'
        })
        return;
    }

}