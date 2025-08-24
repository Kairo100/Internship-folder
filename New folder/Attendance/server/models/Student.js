
// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    // You might want to make email unique as well, especially if it's used as a primary identifier.
    // unique: true,
    // sparse: true // Use sparse if some documents might not have an email
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'dropout'],
    default: 'active',
  },
  // NEW FIELD: reason for dropout
  dropoutReason: {
    type: String,
    required: function() { return this.status === 'dropout'; }, // Only required if status is 'dropout'
    trim: true,
    default: '' // Default to empty string if not dropout
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);