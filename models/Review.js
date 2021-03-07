const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the review'],
    maxlength: [100, 'Review title cannot exceed 100 characters'],
  },
  text: {
    type: String,
    required: [true, 'Please provide a text for the review'],
    maxlength: [500, 'Review text cannot exceed 500 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 10'],
    min: [1, 'Rating cannot be less than 1'],
    max: [10, 'Rating cannot be more than 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'The review needs to be associated with a bootcamp'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'The review needs to be associated with a user'],
  },
});

// Prevent user from adding more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating for bootcamps and save to database
ReviewSchema.statics.calcAverageRating = async function (bootcampId) {
  const dataAggreates = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: dataAggreates[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

// calcAverageRating after save
ReviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.bootcamp);
});

// calcAverageRating after remove
ReviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
