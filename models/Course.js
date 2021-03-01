const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'The course needs to be associated with a publisher user'],
  },
});

CourseSchema.statics.calcAverageCost = async function (bootcampId) {
  const dataAggreates = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost:
        dataAggreates.length > 0 ? Math.ceil(dataAggreates[0].averageCost) : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// calcAverageCost after save
CourseSchema.post('save', async function () {
  await this.constructor.calcAverageCost(this.bootcamp);
});

// calcAverageCost before remove
CourseSchema.post('remove', async function () {
  await this.constructor.calcAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
