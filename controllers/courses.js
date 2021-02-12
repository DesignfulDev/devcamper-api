const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @desc      Show courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  const populateBootcamp = { path: 'bootcamp', select: 'name description' };

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate(
      populateBootcamp
    );
  } else {
    query = Course.find().populate(populateBootcamp);
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
