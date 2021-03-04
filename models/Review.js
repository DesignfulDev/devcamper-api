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

module.exports = mongoose.model('Review', ReviewSchema);
