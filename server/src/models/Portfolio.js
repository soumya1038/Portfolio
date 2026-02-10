import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
      default: 'Developer',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
      default: '',
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        category: {
          type: String,
          enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'],
          default: 'Other',
        },
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one portfolio document exists (singleton pattern)
portfolioSchema.statics.getPortfolio = async function () {
  let portfolio = await this.findOne();
  if (!portfolio) {
    portfolio = await this.create({
      name: 'Your Name',
      title: 'Full Stack Developer',
      bio: 'Welcome to my portfolio! Update this section to tell visitors about yourself.',
      skills: [],
    });
  }
  return portfolio;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
