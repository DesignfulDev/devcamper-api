// @desc      Show all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = (req, res, next) => {
  res.send(200).json({ success: true, msg: `Show all bootcamps` });
};

// @desc      Show single bootcamp by id
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = (req, res, next) => {
  res.send(200).json({
    success: true,
    msg: `Show single bootcamp by id ${req.params.id}`,
  });
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.getBootcamps = (req, res, next) => {
  res.send(200).json({ success: true, msg: `Create new bootcamp` });
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.getBootcamps = (req, res, next) => {
  res
    .send(200)
    .json({ success: true, msg: `Update bootcamp by id ${req.params.id}` });
};

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.getBootcamps = (req, res, next) => {
  res
    .send(200)
    .json({ success: true, msg: `Delete bootcamp by id ${req.params.id}` });
};
