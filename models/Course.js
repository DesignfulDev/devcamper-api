const mongoose = require('mongoose');

const CourseScheema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the course'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the course'],
  },
  weeks: {
    type: Number,
    required: [true, 'Please provide the course duration in weeks'],
    min: [1, 'Duration cannot be less than 1 week'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please provide the course tuition cost'],
    min: [0, 'Tuition cost cannot be less than 0'],
  },
  minimumSkill: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [
      true,
      'Please provide the minimum skill required for this course',
    ],
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'The course needs to belong in a bootcamp'],
  },
});

module.exports = mongoose.model('Course', CourseScheema);
