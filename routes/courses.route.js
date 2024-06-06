const express = require('express');
const router = express.Router();
const {validationSchema} = require('../middlewares/validationSchema');
const courseController = require('../controllers/courses.controller');
const ferifyToken = require('../middlewares/ferifyToken');
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');



//CRUD
//(get all & create) courses
router.route('/')
            .get(courseController.getAllCourses)
            .post(ferifyToken, validationSchema(),courseController.addCourse);


//(get by Id & update & delete) courses
router.route('/:courseId')
                .get(courseController.getCourse)
                .patch(courseController.updateCourse)
                .delete(ferifyToken,allowedTo(userRoles.ADMIN, userRoles.MANAGER), courseController.deleteCourse);

                

module.exports = router