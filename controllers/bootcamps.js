const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc      Show all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Show single bootcamp by id
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: 'courses',
    select: 'title tuition',
  });

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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published Bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // Only one bootcamp per user, unless role is 'admin'
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} already published a bootcamp`,
        400
      )
    );
  }

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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    msg: `Resource deleted`,
    data: bootcamp,
  });
});

// @desc      Show bootcamps within distance radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance/:units
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
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

// @desc      Upload image for bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.bootcampImageUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`Please select an image file to upload`, 400)
    );
  }

  const file = req.files.file;

  // Make sure the file is an image
  if (!file.mimetype.startsWith('image/')) {
    return next(new ErrorResponse(`File must be an image`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Image must not be larger than ${
          process.env.MAX_FILE_UPLOAD / 1048576
        }MB`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `img_${bootcamp.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
