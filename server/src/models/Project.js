import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    demoVideoUrl: {
      type: String,
      trim: true,
      maxlength: [600, 'Demo video URL cannot exceed 600 characters'],
      default: '',
    },
    demoVideos: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      enum: ['github', 'manual'],
      default: 'manual',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    // GitHub-specific metadata (populated when imported from GitHub)
    githubMeta: {
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      watchers: { type: Number, default: 0 },
      openIssues: { type: Number, default: 0 },
      language: { type: String, default: '' },
      topics: { type: [String], default: [] },
      license: { type: String, default: '' },
      size: { type: Number, default: 0 },
      defaultBranch: { type: String, default: 'main' },
      isPrivate: { type: Boolean, default: false },
      isArchived: { type: Boolean, default: false },
      isFork: { type: Boolean, default: false },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      pushedAt: { type: Date },
      contributorsCount: { type: Number, default: 0 },
      commitsCount: { type: Number, default: 0 },
      owner: {
        login: { type: String, default: '' },
        avatarUrl: { type: String, default: '' },
        type: { type: String, default: 'User' },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering projects
projectSchema.index({ order: 1, createdAt: -1 });

// Pre-save middleware to auto-set order if not provided
projectSchema.pre('save', async function (next) {
  if (this.isNew && this.order === 0) {
    const count = await this.constructor.countDocuments();
    this.order = count + 1;
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
