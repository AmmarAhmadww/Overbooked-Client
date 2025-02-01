const mongoose = require('mongoose');

const readingActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  },
  bookName: {
    type: String,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReadingActivity', readingActivitySchema); 