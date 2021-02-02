const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc      Show all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Clone req.query
  const reqQuery = { ...req.query };

  // Remove fields from query
  const removeFields = ['select', 'sort'];

  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryString = JSON.stringify(reqQuery);

  // Create MongoDB logical operators ($gt, $gte, etc)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => '$' + match
  );

  // Create a Mongoose find query from resource Schema
  let query = Bootcamp.find(JSON.parse(queryString));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split('.').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sort
    query = query.sort('-createdAt');
  }

  // Execute query
  const bootcamps = await query;

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      Show single bootcamp by id
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    msg: `Resource created`,
    data: bootcamp,
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    msg: `Resource updated`,
    updatedFields: req.body,
    data: bootcamp,
  });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    msg: `Resource deleted`,
    data: bootcamp,
  });
});

// @desc      Show bootcamps within distance radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance/:units
// @access    Private
exports.getBootcampsInRaius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance, units } = req.params;

  // Get longitute & latitude from geocoder
  const locationArray = await geocoder.geocode(zipcode);
  const { longitude, latitude } = locationArray[0];

  // Calculate radius using radians: divide distance by Earth's radius
  // Earth's radius = 3,963 mi OR 6,378 km
  let earthRadius;

  if (units === 'km') {
    earthRadius = 6378;
  } else {
    earthRadius = 3963;
  }
  const radius = distance / earthRadius;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
