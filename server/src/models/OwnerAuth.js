import mongoose from 'mongoose';

const ownerAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
    },
    sessionVersion: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPasswordChangedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const OwnerAuth = mongoose.model('OwnerAuth', ownerAuthSchema);

export default OwnerAuth;
