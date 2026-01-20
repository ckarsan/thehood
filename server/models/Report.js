const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema(
  {
    originalDescription: { type: String, required: true },
    city: { type: String, required: true }, // Gotham, Smallville, etc.
    location: { type: String, required: true }, // Ideally coordinates, but string for MVP
    images: [{ type: String }],
    civilianContact: {
      name: String,
      phone: String,
      email: String,
    },
    status: {
      type: String,
      enum: ['Not Started', 'Assigned', 'Completed'],
      default: 'Not Started',
    },
    department: { type: String, default: 'Unassigned' },
    aiAnalysis: {
      cleanedText: String,
      severity: String,
      duplicateConfidence: Number,
      thoughts: String, // OPIK logs
    },
    resolution: {
      completedBy: String,
      notes: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Report', ReportSchema)
