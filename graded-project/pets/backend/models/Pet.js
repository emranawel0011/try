const mongoose = require('mongoose');

// One pet up for adoption. Mongo generates `_id` for us automatically — the
// frontend reads it back as a plain string (`pet._id`) in the JSON response.
const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Small Animal', 'Other'],
    },
    breed: { type: String, trim: true, default: '' },
    age: { type: Number, required: true, min: 0 },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      default: 'Medium',
    },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Pet || mongoose.model('Pet', petSchema);
