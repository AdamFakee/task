const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://buidinhtuan04:KnhwJO9t5P7PXD0a@cluster0.xhbwb9r.mongodb.net/task-management');
        console.log('connect to database');
    } catch (error) {
        console.log('in-conect to database');
    }
}