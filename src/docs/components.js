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
    },
  },
};
