const Task = require('../../model/task.model');
const User = require('../../model/user.model');

//  [GET] /task
module.exports.index = async (req, res) => {

    // task?page=''&&keyWrod=''&&status=''

    const find = {
        deleted : false,
    }

    // pagination
    const pagination = {
        page : 1,
        limitTask : 5,
    }
    if(req.query.limitTask){
        pagination.limitTask = parseInt(req.query.limitTask);
    }
    
    const countTaskInDatabase = await Task.countDocuments(find);
    pagination.totalPage = Math.ceil(countTaskInDatabase/pagination.limitTask);
    if(req.query.page){
        const page = parseInt(req.query.page);
        pagination.page = page > pagination.totalPage ? 1 : page;
    };
    pagination.skipTask = (pagination.page-1)*pagination.limitTask;
    // End pagination

    // search 
    if(req.query.keyWord){
        const keyWrod = new RegExp(req.query.keyWord, 'i');
        find.title = keyWrod;
    }
    // End search

    // fillter
    if(req.query.status){
        find.status = req.query.status;
    }
    // End fillter

    const listTask = await Task.find(find).limit(pagination.limitTask).skip(pagination.skipTask);

    res.json({
        listTask : listTask,
    })
}

// [PATCH] /task/change-status
module.exports.changeStatus = async (req, res) => {
    try {
        const ids = req.body.ids;
        const status = req.body.status; 

        await Task.updateMany({
            _id : {
                $in : ids,
            }
        }, {
            status : status
        });
        res.json({
            code : 200,
            message : 'thay đổi trạng thái thành công'
        })
    } catch (error) {
        res.json({
            message : 'not Found'
        })
    }
}

// [GET] /task/detail/:id
module.exports.detail = async (req, res) => {

    // {
    //     "ids" : ["", ""],
    //     "status" : ""
    // }

    try {
        const id = req.params.id;
    
        const task = await Task.findOne({
          _id: id,
          deleted: false
        });
      
        res.status(200).json(task);
    } catch (error) {
        res.status(404).json({
            code: 404,
            message: "Not Found"
        })
    } 
}

// [POST] /task/create
module.exports.createPost = async (req, res) => {

    // {
    //     "title": "Công việc 4",
    //     "status": "assign",
    //     "staffId": 'id of staff', 
    //     "content": "Nội dung công việc 4...",
    //     "timeStart": "2023-09-18T14:43:01.579Z",
    //     "timeFinish": "2023-09-24T14:43:01.579Z",
    //     "createdAt": "2023-09-16T14:43:01.579Z",
    //     "updatedAt": "2023-09-16T14:43:01.579Z",
    //     "deleted": false
    // }

    try {
        req.body.createdBy = req.decoded.id;
    
        const task = new Task(req.body);
        await task.save();
      
        res.json({
            code : 200,
            message: "Tạo công việc thành công!",
            task: task
        });
      } catch (error) {
        console.error(error)
        res.json({
          message: "Not Found"
        });
      }
}

// [GET]   /task/edit/:id 
module.exports.edit = async (req, res) => {
    const taskEdit = await Task.findOne({
        _id : req.params.id,
        deleted : false,
    }).select('title status content staffId timeFinish timeStart');

    // not exist task
    if(!taskEdit) {
        res.status(404).json({
            code : 404,
            message : 'not found task'
        });
        return;
    }

    // find staff
    const currentPage = req.query.page || 1;
    const limit = 5;
    const staffList = await User.find({
        status : 'active',
        deleted : false,
    }).limit(limit).skip(limit*(currentPage-1));
    
    if(staffList.length <= 0) {
        res.status(404).json({
            code : 404,
            message : 'not found staff',
        });
        return;
    }

    res.status(200).json({
        code : 200,
        staffList : staffList,
        task : taskEdit
    })
}
// [PATCH] /task/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        req.body.updatedBy = req.decoded.id;
        const idTask = req.params.id;
        await Task.updateOne({
            _id : idTask
        }, req.body);

        res.status(200).json({
            code : 200,
            message : 'cập nhật công việc thành công'
        })
    } catch (error) {
        res.status(404).json({
            code : 404,
            message: "Not Found"
        });
    }
}

// [PATCH] /task/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const idTask = req.params.id;
        await Task.updateOne({
            _id : idTask
        }, {
            deleted : true,
        });

        res.status(200).json({
            code : 200,
            message : 'xóa công việc thành công'
        })
    } catch (error) {
        res.status(404).json({
            code : 404,
            message: "Not Found"
        });
    }
}
