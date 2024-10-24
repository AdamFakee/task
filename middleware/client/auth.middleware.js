const User = require('../../model/user.model');
const jwt = require('jsonwebtoken');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        res.status(400).json({
            code : 400,
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
            res.status(404).json({
                code : 400,
                message : 'not found'
            })
            return;
        }
        req.decoded = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.status(403).json({
            code : 403,
            message : 'error'
        })
        return;
    }

}