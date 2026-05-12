const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    displayName: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    profileUrl: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Search', searchSchema);
