module.exports = {
  components: {
    schemas: {
      // -------- USER --------
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            format: "uuid",
            description: "User unique identifier",
            example: "62f1a0c3e4b0f8a1d23c4b5e",
          },
          name: {
            type: "string",
            description: "Full name of the user",
            example: "Alice Walker",
          },
          email: {
            type: "string",
            format: "email",
            description: "User's email address",
            example: "alice@example.com",
          },
          age: {
            type: "integer",
            description: "User's age",
            example: 29,
          },
          photoUrl: {
            type: "string",
            description: "URL to user's profile photo",
            example: "/uploads/62f1a0c3e4b0f8a1d23c4b5e.jpg",
          },
          role: {
            type: "string",
            enum: ["user", "admin", "superadmin"],
            description: "User's role in the system",
            example: "user",
          },
          confirmed: {
            type: "boolean",
            description: "Has the user's email been confirmed?",
            example: true,
          },
          followers: {
            type: "array",
            description: "List of users following this user",
            items: { type: "string", description: "User _id" },
          },
          following: {
            type: "array",
            description: "List of users this user is following",
            items: { type: "string", description: "User _id" },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the user was created",
            example: "2025-06-15T14:12:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the user was last updated",
            example: "2025-06-16T09:45:00.000Z",
          },
        },
      },

      // -------- POST --------
      Post: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            format: "uuid",
            description: "Post unique identifier",
            example: "62f2b1c5d4e1b9a2c34d5e6f",
          },
          author: {
            type: "string",
            description: "User _id of the author",
            example: "62f1a0c3e4b0f8a1d23c4b5e",
          },
          title: {
            type: "string",
            description: "Post title",
            example: "My first post",
          },
          content: {
            type: "string",
            description: "Post body content",
            example: "Hello, world!",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T15:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T16:00:00.000Z",
          },
        },
      },

      // -------- COMMENT --------
      Comment: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            format: "uuid",
            description: "Comment unique identifier",
            example: "62f3c2d6e5f2c0b3d45e6f7a",
          },
          postId: {
            type: "string",
            description: "ID of the post this comment belongs to",
            example: "62f2b1c5d4e1b9a2c34d5e6f",
          },
          author: {
            type: "string",
            description: "User _id of the commenter",
            example: "62f1a0c3e4b0f8a1d23c4b5e",
          },
          content: {
            type: "string",
            description: "The text of the comment",
            example: "Great post, thanks for sharing!",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T15:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T15:45:00.000Z",
          },
        },
      },

      // -------- HOME --------
      HomeResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Welcome message",
            example: "Welcome to mongoose-backend-project API!",
          },
        },
      },
    },
  },
};
