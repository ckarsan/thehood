import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    originalDescription: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    civilianContact: {
      name: String,
      phone: String,
      email: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      thoughts: String,
    },
    resolution: {
      completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: String,
      timestamp: Date,
    },
    notes: [
      {
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Report', ReportSchema)
