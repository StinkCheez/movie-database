const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true }, // could be an external movie ID or title
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);