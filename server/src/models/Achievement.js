import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    issuer: {
      type: String,
      trim: true,
      maxlength: [150, 'Issuer cannot exceed 150 characters'],
      default: '',
    },
    date: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ order: 1, date: -1, createdAt: -1 });

achievementSchema.pre('save', async function (next) {
  if (this.isNew && this.order === 0) {
    const count = await this.constructor.countDocuments();
    this.order = count + 1;
  }
  next();
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
