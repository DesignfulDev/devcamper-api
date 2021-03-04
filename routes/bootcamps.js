const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampImageUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance/:units').get(getBootcampsInRadius);

router
  .route('/:id/image')
  .put(protect, authorize('admin', 'publisher'), bootcampImageUpload);

router
  .route('/')
  .get(
    advancedResults(Bootcamp, {
      path: 'courses',
      select: 'title tuition description',
    }),
    getBootcamps
  )
  .post(protect, authorize('admin', 'publisher'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

module.exports = router;
