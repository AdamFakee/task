const User = require("../../model/user.model");


module.exports.checkCreateTask = async (req, res, next) => {
    const staffId = req.body.staffId;
    if(staffId) {
        // find staff is assigned this task, if have staffId in req.body
        const existStaff = await User.findOne({
            id : staffId,
            status : 'active',
            deleted : false,
        })
        if(!existStaff) { 
            res.status(404).json({
                code : 404,
                message : 'not found staff'
            });
            return;
        } else {
            req.body.status = 'assigned';
        }
    } 
    
    next();
}

module.exports.checkEditTask = async (req, res, next) => {
    const staffId = req.body.staffId;
    console.log(staffId)
    if(staffId) {
        // find staff is assigned this task, if have staffId in req.body
        const existStaff = await User.findOne({
            _id : staffId,
            status : 'active',
            deleted : false,
        })
        if(!existStaff) { 
            res.status(404).json({
                code : 404,
                message : 'not found staff'
            });
            return;
        } else {
            req.body.status = 'assigned';
        }
    } else {
        res.status(400).json({
            code : 400,
            message : 'not exist staffId'
        })
        return;
    }
    
    next();
}
