import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['civilian', 'council'],
      required: true,
    },
    city: { type: String },
    phone: String,
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
