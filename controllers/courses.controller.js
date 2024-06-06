const {validationResult} = require('express-validator');
const Course = require('../models/courses.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/app.Error');



const getAllCourses = asyncWrapper( async (req,res)=> {
    const query = req.query;

    const limit = query.limit || 10 ;
    const page = query.page || 1 ;
    const skip = (page - 1) * limit ;

    //get all courses from DB using course model
    const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS, data:{courses}});
});


const getCourse = asyncWrapper( async (req,res)=> {

    //try {
        const course = await Course.findById(req.params.courseId);
        if(!course) {
            const error = appError.create('course not found', 404, httpStatusText.FAIL)
            return next(error);//res.status(404).json({status: httpStatusText.FAIL , data:{course:"course not found"}});
        } 
        return res.json({status: httpStatusText.SUCCESS , data:{course}});
// 
    // } catch (error) {
        // return res.status(400).json({status: httpStatusText.ERROR , data: null, message:"Invaled Object ID", code: 400});
    // }
    // 
});


const addCourse = asyncWrapper( async (req,res)=> {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
        return next(error); //res.status(400).json({status: httpStatusText.FAIL , data: errors.array()});
    };

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({status: httpStatusText.SUCCESS, data:{courses: newCourse}});
});


const updateCourse = asyncWrapper( async (req,res)=> {
    const courseId = req.params.courseId;
    //try {
    const updateCourse = await Course.updateOne({_id: courseId},{$set: {...req.body}});
    return res.status(200).json({status: httpStatusText.SUCCESS, data:{courses: updateCourse}});

    // } catch (error) {
        // return res.status(400).json({status: httpStatusText.ERROR, message: error.message});
    // }
});


const deleteCourse = asyncWrapper( async (req,res)=> {
    const data = await Course.deleteOne({_id: req.params.courseId});
    res.status(200).json({status: httpStatusText.SUCCESS , data:null});
    });



module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}    