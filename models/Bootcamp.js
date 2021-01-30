const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the bootcamp'],
    unique: [true, 'Bootcamp already exist'],
    maxlength: [50, 'Bootcamp name cannot exceed 50 characters'],
    trim: true,
  },
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
