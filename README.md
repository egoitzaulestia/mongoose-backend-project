# Social Media Backend API

A comprehensive REST API for a social media platform built with Node.js, Express, and MongoDB. This project provides complete backend functionality for user management, posts, comments, likes, and social features like following users.

## 🚀 Live Demo

**Production URL:** [https://mongoose-backend-project.onrender.com](https://mongoose-backend-project.onrender.com)

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Core Features

- **User Authentication**: Registration, login, logout with JWT tokens
- **Password Security**: Bcrypt encryption for secure password storage
- **Email Confirmation**: Account verification via email
- **Post Management**: Complete CRUD operations for posts
- **Comment System**: Create, update, delete comments on posts
- **Like System**: Like/unlike posts and comments
- **User Following**: Follow/unfollow other users
- **File Uploads**: Image uploads for posts, comments, and user profiles
- **Pagination**: Efficient data loading with 10 items per page
- **Search Functionality**: Search posts and users by name or ID

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Authorization Middleware**: Protected routes with role-based access
- **Authorship Verification**: Users can only edit/delete their own content
- **Input Validation**: Comprehensive validation for all endpoints

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **File Upload**: Multer middleware
- **Email Service**: Nodemailer
- **Validation**: Validator.js
- **Environment Management**: Dotenv
- **Deployment**: Docker, Render

## 📁 Project Structure

```
src/
├── config/
│   ├── db.js              # Database configuration
│   └── nodemailer.js      # Email configuration
├── controllers/
│   ├── CommentController.js
│   ├── PostController.js
│   └── UserController.js
├── middlewares/
│   ├── authentication.js  # JWT authentication
│   ├── authorship.js      # Content ownership verification
│   ├── typeError.js       # Error handling
│   └── uploads.js         # File upload handling
├── models/
│   ├── Comment.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── comments.js
│   ├── posts.js
│   └── users.js
├── uploads/               # Uploaded files storage
└── index.js              # Application entry point
```

## 🔧 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Git

### Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mongoose-backend-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

### Docker Setup

The project includes Docker configuration for easy deployment:

```bash
# Build the Docker image
docker build -t social-media-api .

# Run the container
docker run -p 3000:3000 social-media-api
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/social-media
DB_NAME=social-media

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint                     | Description       | Authentication |
| ------ | ---------------------------- | ----------------- | -------------- |
| POST   | `/users/register`            | Register new user | ❌             |
| GET    | `/users/confirm/:emailToken` | Confirm email     | ❌             |
| POST   | `/users/login`               | User login        | ❌             |
| DELETE | `/users/logout`              | User logout       | ✅             |

### User Management

| Method | Endpoint            | Description                             | Authentication |
| ------ | ------------------- | --------------------------------------- | -------------- |
| GET    | `/users/info`       | Get current user info                   | ✅             |
| GET    | `/users/me/profile` | Get user profile with posts & followers | ✅             |
| GET    | `/users/id/:_id`    | Get user by ID                          | ✅             |
| GET    | `/users/name/:name` | Get user by name                        | ❌             |
| GET    | `/users/`           | Get all users                           | ❌             |
| PUT    | `/users/id/:_id`    | Update user                             | ✅             |
| DELETE | `/users/id/:_id`    | Delete user                             | ✅             |
| POST   | `/users/me/photo`   | Upload profile photo                    | ✅             |

### Social Features

| Method | Endpoint            | Description   | Authentication |
| ------ | ------------------- | ------------- | -------------- |
| POST   | `/users/:id/follow` | Follow user   | ✅             |
| DELETE | `/users/:id/follow` | Unfollow user | ✅             |

### Post Management

| Method | Endpoint              | Description               | Authentication |
| ------ | --------------------- | ------------------------- | -------------- |
| POST   | `/posts/create`       | Create new post           | ✅             |
| GET    | `/posts/`             | Get all posts (paginated) | ❌             |
| GET    | `/posts/full`         | Get posts with comments   | ❌             |
| GET    | `/posts/id/:_id`      | Get post by ID            | ❌             |
| GET    | `/posts/title/:title` | Search posts by title     | ❌             |
| PUT    | `/posts/id/:_id`      | Update post               | ✅             |
| DELETE | `/posts/id/:_id`      | Delete post               | ✅             |

### Post Interactions

| Method | Endpoint              | Description   | Authentication |
| ------ | --------------------- | ------------- | -------------- |
| POST   | `/posts/:postId/like` | Like a post   | ✅             |
| DELETE | `/posts/:postId/like` | Unlike a post | ✅             |

### Comment Management

| Method | Endpoint                        | Description            | Authentication |
| ------ | ------------------------------- | ---------------------- | -------------- |
| POST   | `/posts/:postId/comments`       | Create comment on post | ✅             |
| GET    | `/posts/:postId/comments`       | Get post comments      | ✅             |
| GET    | `/comments/`                    | Get all comments       | ❌             |
| GET    | `/comments/detailed`            | Get detailed comments  | ✅             |
| GET    | `/comments/:commentId/detailed` | Get detailed comment   | ✅             |
| PUT    | `/comments/:commentId`          | Update comment         | ✅             |
| DELETE | `/comments/:commentId`          | Delete comment         | ✅             |

### Comment Interactions

| Method | Endpoint                    | Description      | Authentication |
| ------ | --------------------------- | ---------------- | -------------- |
| POST   | `/comments/:commentId/like` | Like a comment   | ✅             |
| DELETE | `/comments/:commentId/like` | Unlike a comment | ✅             |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. Register a new account via `/users/register`
2. Confirm your email using the link sent to your inbox
3. Login via `/users/login` to receive a JWT token
4. Include the token in subsequent requests to protected endpoints

## 📁 File Uploads

The API supports image uploads for:

- **User profiles**: Single image upload
- **Posts**: Up to 4 images per post
- **Comments**: Up to 4 images per comment

### Upload Specifications

- **Supported formats**: JPG, PNG, GIF
- **Maximum file size**: 5MB per image
- **Storage**: Local filesystem (uploads/ directory)

### Upload Endpoints

- `POST /users/me/photo` - Upload profile photo
- `POST /posts/create` - Create post with images
- `PUT /posts/id/:_id` - Update post images
- `POST /posts/:postId/comments` - Create comment with images

## 🚀 Deployment

### Production Deployment on Render

The application is deployed on Render with the following configuration:

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Environment**: Node.js
4. **Auto-Deploy**: Enabled from main branch

### Docker Deployment

The project includes Docker support:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## 🧪 Testing

Test the API endpoints using tools like:

- **Postman**: Import the API collection
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

### Example Request

```bash
curl -X POST https://mongoose-backend-project.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

If you have any questions or need help with the API, please:

1. Check the documentation above
2. Review the existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Node.js, Express, and MongoDB**
