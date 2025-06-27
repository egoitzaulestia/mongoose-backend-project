// src/doc/users.js
module.exports = {
  paths: {
    "/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        description:
          "Create a user account. You can optionally upload a profile photo.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Alice Walker",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "alice@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "secret123",
                  },
                  age: {
                    type: "integer",
                    example: 29,
                  },
                  photo: {
                    type: "string",
                    format: "binary",
                    description: "Optional profile picture",
                  },
                },
                required: ["name", "email", "password", "age"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },

    "/users/confirm/{emailToken}": {
      get: {
        tags: ["Users"],
        summary: "Confirm user email",
        parameters: [
          {
            name: "emailToken",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "JWT token sent by email",
          },
        ],
        responses: {
          200: { description: "Email confirmed successfully" },
          404: { description: "User not found or token invalid" },
        },
      },
    },

    "/users/login": {
      post: {
        tags: ["Users"],
        summary: "Log in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful. Returns Bearer token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Missing credentials or not confirmed" },
          404: { description: "User not found" },
        },
      },
    },

    "/users/logout": {
      delete: {
        tags: ["Users"],
        summary: "Log out",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: { description: "Logged out successfully" },
          400: { description: "Already logged out or invalid token" },
        },
      },
    },

    "/users/info": {
      get: {
        tags: ["Users"],
        summary: "Get your user info",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: "Current user data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
    },

    "/users/id/{_id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by ID",
        parameters: [
          {
            name: "_id",
            in: "path",
            required: true,
            schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
            description: "MongoDB ObjectId",
          },
        ],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: "Found user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update a user",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "path",
            required: true,
            schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age: { type: "integer" },
                  role: {
                    type: "string",
                    enum: ["user", "admin", "superadmin"],
                  },
                  // etc. only include updatable fields
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
          404: { description: "User not found" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "path",
            required: true,
            schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
          },
        ],
        responses: {
          204: { description: "User deleted" },
          404: { description: "User not found" },
        },
      },
    },

    "/users/name/{name}": {
      get: {
        tags: ["Users"],
        summary: "Search users by name",
        parameters: [
          {
            name: "name",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Case-insensitive partial match",
          },
        ],
        responses: {
          200: {
            description: "Matching users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          404: { description: "No users found" },
        },
      },
    },

    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },

    "/users/me/photo": {
      post: {
        tags: ["Users"],
        summary: "Upload or update your profile photo",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  photo: { type: "string", format: "binary" },
                },
                required: ["photo"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Photo uploaded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
    },

    "/users/me/profile": {
      get: {
        tags: ["Users"],
        summary: "Get your profile (with stats)",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: "Profile data + followers/posts/comments stats",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    stats: {
                      type: "object",
                      properties: {
                        followersCount: { type: "integer" },
                        followingCount: { type: "integer" },
                      },
                    },
                    followers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    following: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    posts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Post" },
                    },
                    comments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Comment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/users/{id}/follow": {
      post: {
        tags: ["Users"],
        summary: "Follow another user",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
            description: "User to follow",
          },
        ],
        responses: {
          200: {
            description: "Now following",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    following: {
                      type: "array",
                      items: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
                    },
                    followersCount: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Unfollow a user",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
            description: "User to unfollow",
          },
        ],
        responses: {
          200: {
            description: "Unfollowed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    following: {
                      type: "array",
                      items: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
                    },
                    followersCount: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
