// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('geeta_satsang');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'fullName', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        fullName: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'teacher', 'learner']
        }
      }
    }
  }
});

// Create indexes for users collection
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'role': 1 });
db.users.createIndex({ 'isApproved': 1 });
db.users.createIndex({ 'createdAt': -1 });
db.users.createIndex({ 'googleId': 1 }, { sparse: true });

// Create other collections
db.createCollection('discussions');
db.createCollection('spaces');
db.createCollection('satsangs');
db.createCollection('notifications');
db.createCollection('content');

// Create indexes for discussions
db.discussions.createIndex({ 'author': 1 });
db.discussions.createIndex({ 'category': 1 });
db.discussions.createIndex({ 'createdAt': -1 });
db.discussions.createIndex({ 'title': 'text', 'content': 'text' });

// Create indexes for spaces
db.spaces.createIndex({ 'teacher': 1 });
db.spaces.createIndex({ 'members': 1 });
db.spaces.createIndex({ 'isPrivate': 1 });

// Create indexes for satsangs
db.satsangs.createIndex({ 'teacher': 1 });
db.satsangs.createIndex({ 'scheduledAt': 1 });
db.satsangs.createIndex({ 'status': 1 });

// Create application user (if needed)
db.createUser({
  user: 'geeta_satsang_app',
  pwd: 'app_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'geeta_satsang'
    }
  ]
});

print('MongoDB initialization completed for Gita Satsang Platform');
