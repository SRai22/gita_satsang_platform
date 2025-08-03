const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  passwordHash: {
    type: String,
    required: function() {
      return !this.googleId; // Password required if not Google OAuth user
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  spiritualName: {
    type: String,
    trim: true,
    maxlength: [100, 'Spiritual name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'learner'],
    default: 'learner'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  introduction: {
    type: String,
    maxlength: [1000, 'Introduction cannot exceed 1000 characters']
  },
  googleId: {
    type: String,
    sparse: true // Allows multiple null values
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    satsangReminders: {
      type: Boolean,
      default: true
    },
    newDiscussions: {
      type: Boolean,
      default: true
    },
    spaceUpdates: {
      type: Boolean,
      default: true
    }
  },
  deviceTokens: [{
    token: String,
    platform: {
      type: String,
      enum: ['ios', 'android', 'web']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full display name
userSchema.virtual('displayName').get(function() {
  return this.spiritualName || this.fullName;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  if (this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Instance method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

// Instance method to generate refresh token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    }
  );
};

// Instance method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Static method to get user stats
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        approvedUsers: {
          $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
        },
        pendingUsers: {
          $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] }
        },
        teachers: {
          $sum: { $cond: [{ $eq: ['$role', 'teacher'] }, 1, 0] }
        },
        learners: {
          $sum: { $cond: [{ $eq: ['$role', 'learner'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    teachers: 0,
    learners: 0
  };
};

module.exports = mongoose.model('User', userSchema);
