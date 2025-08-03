# Gita Satsang Platform - Backend

This is the backend API for the Gita Satsang spiritual community platform, built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 👥 **User Management**: Registration approval system for spiritual community
- 💬 **Discussions**: Community discussions on spiritual topics
- 🏠 **Spaces**: Teacher-led spiritual learning groups
- 📚 **Learning Corner**: PDF, audio, and video content management
- 🧘 **Satsang Scheduling**: Zoom integration for spiritual gatherings
- 🔔 **Notifications**: Real-time notifications for community activities
- 🕉️ **Daily Shloka**: Bhagavad Gita verse of the day

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT
- **Validation**: Joi & Express Validator
- **File Upload**: Multer + Cloudinary
- **Logging**: Winston
- **API Documentation**: Following OpenAPI specification

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 7+
- Redis 7+
- Docker (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gita_satsang_platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Start with Docker Compose** (from project root)
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/geeta_satsang` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

See `.env.example` for complete list of environment variables.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users/pending-approvals` - Get pending user approvals (Admin)
- `POST /api/v1/users/:id/approve` - Approve user (Admin)
- `PUT /api/v1/users/:id/role` - Update user role (Admin)

### Discussions
- `GET /api/v1/discussions` - Get discussions with pagination
- `POST /api/v1/discussions` - Create new discussion
- `GET /api/v1/discussions/:id` - Get specific discussion
- `POST /api/v1/discussions/:id/reactions` - Add reaction

### Spaces
- `GET /api/v1/spaces` - Get user spaces
- `POST /api/v1/spaces` - Create new space (Teacher)
- `POST /api/v1/spaces/:id/join` - Join space
- `GET /api/v1/spaces/:id/posts` - Get space posts

### Satsangs
- `GET /api/v1/satsangs` - Get scheduled satsangs
- `POST /api/v1/satsangs` - Schedule satsang (Teacher)
- `POST /api/v1/satsangs/:id/register` - Register for satsang

## Database Schema

### User Model
```javascript
{
  email: String,           // Unique email
  passwordHash: String,    // Hashed password
  fullName: String,        // Full name
  spiritualName: String,   // Spiritual name (optional)
  role: String,           // 'admin', 'teacher', 'learner'
  isApproved: Boolean,    // Approval status
  avatar: String,         // Avatar URL
  bio: String,           // User biography
  preferences: Object,    // Notification preferences
  createdAt: Date,
  updatedAt: Date
}
```

### Discussion Model
```javascript
{
  title: String,          // Discussion title
  content: String,        // Discussion content
  author: ObjectId,       // Reference to User
  category: String,       // Discussion category
  tags: [String],         // Tags array
  reactions: Object,      // Reaction counts
  comments: [Object],     // Comments array
  createdAt: Date,
  updatedAt: Date
}
```

## User Roles & Permissions

### Admin
- Full platform access
- User approval and role management
- Content moderation
- Analytics access

### Teacher
- Create and manage spaces
- Schedule satsangs
- Upload learning content
- Moderate own spaces

### Learner
- Join spaces
- Participate in discussions
- Register for satsangs
- Access learning content

## Security Features

- 🔒 JWT-based authentication
- 🛡️ Helmet for security headers
- 🚦 Rate limiting
- ✅ Input validation and sanitization
- 🔐 Password hashing with bcrypt
- 🛡️ CORS protection
- 📊 Request logging

## Error Handling

The API uses consistent error response format:

```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable error message",
    details: {
      // Additional error details
    }
  }
}
```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

### Code Structure

```
src/
├── controllers/     # Route controllers
├── models/         # Database models
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic services
├── utils/          # Utility functions
├── config/         # Configuration files
└── app.js          # Express app setup
```

## Deployment

### Production Environment

1. **Build and deploy**
   ```bash
   npm install --production
   npm start
   ```

2. **Using PM2**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

### Environment-specific configurations

- **Development**: Full logging, auto-restart
- **Production**: Optimized logging, clustering, monitoring

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and spiritual guidance, please reach out to the Gita Satsang community administrators.

---

*"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"*  
*"You have the right to perform your actions, but never to the fruits of action."*  
- Bhagavad Gita 2.47
