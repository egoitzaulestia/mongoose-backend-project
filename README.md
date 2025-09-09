# The Social Network — Backend API

A comprehensive REST API for a social media platform built with Node.js, Express, and MongoDB. This project provides complete backend functionality for user management, posts, comments, likes, and social features like following users.

## 🚀 Live Demo

**Production URL:** [https://mongoose-backend-project.onrender.com](https://mongoose-backend-project.onrender.com)

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
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
- **API Documentation**: Interactive Swagger UI with comprehensive endpoint documentation

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Authorization Middleware**: Protected routes with role-based access
- **Authorship Verification**: Users can only edit/delete their own content
- **Input Validation**: Comprehensive validation for all endpoints

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud) with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Bcrypt
- **File Upload**: Multer middleware
- **Email Service**: Nodemailer
- **Validation**: Validator.js
- **API Documentation**: Swagger/OpenAPI 3.0
- **Environment Management**: Dotenv
- **Deployment**: Docker, Render, MongoDB Atlas

## 📁 Project Structure

```
src/
├── config/
│   ├── db.js                 # Database configuration
│   └── nodemailer.js         # Email configuration
├── controllers/
│   ├── CommentController.js
│   ├── HomeController.js     # Welcome/API info
│   ├── PostController.js
│   └── UserController.js
├── docs/
│   ├── basicinfo.js          # Basic API information
│   ├── comments.js           # Comment endpoints documentation
│   ├── components.js         # Reusable Swagger components
│   ├── index.js              # Main Swagger configuration
│   ├── posts.js              # Post endpoints documentation
│   └── users.js              # User endpoints documentation
├── middlewares/
│   ├── authentication.js     # JWT authentication
│   ├── authorship.js         # Content ownership verification
│   ├── typeError.js          # Error handling
│   └── uploads.js            # File upload handling
├── models/
│   ├── Comment.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── comments.js
│   ├── home.js               # Welcome route
│   ├── posts.js
│   └── users.js
├── uploads/                  # Uploaded files storage
└── index.js                  # Application entry point
```

## 🔧 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
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

Create a `.env` file in the root directory (you can copy `​.env.example` to `.env` and then fill in your values):

```env
# Production (MongoDB Atlas)
MONGO_URI=
DB_NAME=

# or, for local dev with Docker’d Mongo:
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_INITDB_DATABASE=

# Which port your Express app should listen on
PORT=

# JWT signing key (keep this secret!)
JWT_SECRET=

# Email (Gmail) credentials
EMAIL_USER=
EMAIL_PASS=
```

## 📚 API Documentation

### Interactive Documentation

The API is fully documented using **Swagger/OpenAPI 3.0**. You can explore and test all endpoints interactively through the Swagger UI:

**Swagger UI**: [https://mongoose-backend-project.onrender.com/api-docs](https://mongoose-backend-project.onrender.com/api-docs)

### Documentation Features

- **Complete endpoint coverage**: All API endpoints are documented with detailed descriptions
- **Request/Response schemas**: Full schema definitions for all data models
- **Interactive testing**: Test endpoints directly from the documentation
- **Authentication examples**: Clear examples of how to authenticate requests
- **Error response documentation**: Comprehensive error handling examples
- **Pagination details**: Documentation of pagination parameters and responses

### Swagger Configuration

The documentation is organized into several modules:

- **Basic Info**: API metadata, contact information, and general description
- **Components**: Reusable schemas for User, Post, Comment, and response models
- **Endpoints**: Detailed documentation for all API routes grouped by functionality
  - User management and authentication
  - Post operations and interactions
  - Comment management and interactions

## 📚 API Endpoints

### Home Endpoint

| Method | Endpoint | Description                | Authentication |
| ------ | -------- | -------------------------- | -------------- |
| GET    | `/`      | Welcome message / API info | ❌             |

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
- **Maximum file size**: 2MB per image
- **Storage**: Local filesystem (uploads/ directory)

### Upload Endpoints

- `POST /users/register` - (Optional) Upload profile photo in the register
- `POST /users/me/photo` - Upload profile photo
- `POST /posts/create` - Create post with images
- `PUT /posts/id/:_id` - Update post images
- `POST /posts/:postId/comments` - Create comment with images
- `PUT /comments/:commentId` - Update comment images

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
# Use official Node.js image
FROM node:18-alpine as builder

# Create work directory in /root/src
RUN mkdir -p /root/src

# Establish the work directory in /root/src
WORKDIR /root/src

# Install only production deps
COPY ["package.json", "package-lock.json","./"]
RUN npm install --only=production

# Copy the rest of the app files
COPY src/. ./

# Expose the port your app listens on
EXPOSE 3000

# Launch the app with your "start" script
CMD ["node", "index.js"]
```

## 📝 API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": {
    // Response data (when applicable)
  }
}
```

### Error Response

```json
{
  "message": "Error description",
  "error": {
    // Additional error details (in development)
  }
}
```

## 🧪 Testing

Test the API endpoints using tools like:

- **Swagger UI**: Interactive documentation at `/api-docs` endpoint
- **Postman**: Import the API collection
- **cURL**: Command-line testing

### Example Request

```bash
curl -X POST https://mongoose-backend-project.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Expected response:
# {
#   "message": "Login successful",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "name": "John Doe", "email": "user@example.com" }
# }
```

## 📄 License & Usage

This project was created as part of a backend development learning course. It demonstrates the implementation of a complete REST API with authentication, CRUD operations, and social media features.

**Note**: This is primarily an educational project showcasing backend development skills with Node.js, Express, and MongoDB.

## 🤝 Questions & Feedback

If you have questions about the implementation or want to discuss the technical approaches used:

1. Review the code and documentation
2. Check existing issues for similar questions
3. Feel free to reach out for educational discussions about the architecture and design decisions

---

**Built with ❤️ using Node.js, Express, and MongoDB Atlas**
