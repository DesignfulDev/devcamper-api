const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
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

// @desc      Show single course by ID
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc      Add course to bootcamp
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp find with id ${req.params.bootcampId}`)
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});
