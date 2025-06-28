// src/doc/comments.js
module.exports = {
  paths: {
    "/comments": {
      get: {
        tags: ["Comments"],
        summary: "List all comments",
        description:
          "Retrieve a paginated list of all comments (public). Query params: `page`, `limit`.",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Results per page",
          },
        ],
        responses: {
          200: {
            description: "Paginated comments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pages: { type: "integer" },
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

    // src/doc/comments.js
    "/comments/detailed": {
      get: {
        tags: ["Comments"],
        summary: "List detailed comments",
        description:
          "Returns each comment + its author + parent post + post’s author + users who liked it. (Protected)",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Paginated detailed comments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pages: { type: "integer" },
                    comments: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            pattern: "^[0-9a-fA-F]{24}$",
                          },
                          postId: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                pattern: "^[0-9a-fA-F]{24}$",
                              },
                              title: { type: "string" },
                              author: { $ref: "#/components/schemas/User" },
                            },
                          },
                          author: { $ref: "#/components/schemas/User" },
                          content: { type: "string" },
                          imageUrls: {
                            type: "array",
                            items: { type: "string", format: "uri" },
                          },
                          likes: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                userId: { $ref: "#/components/schemas/User" },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                },
                              },
                            },
                          },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/comments/{commentId}/detailed": {
      get: {
        tags: ["Comments"],
        summary: "Get one detailed comment",
        description:
          "Same data as `/comments/detailed` but for a single comment. (Protected)",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
            description: "MongoDB ObjectId of the comment",
          },
        ],
        responses: {
          200: {
            description: "Detailed comment",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid ID" },
          404: { description: "Comment not found" },
        },
      },
    },

    "/comments/{commentId}/like": {
      post: {
        tags: ["Comments"],
        summary: "Like a comment",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
          },
        ],
        responses: {
          200: {
            description: "Comment liked (returns updated comment)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          400: { description: "Already liked or invalid ID" },
          401: { description: "Unauthorized" },
          404: { description: "Comment not found" },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Unlike a comment",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
          },
        ],
        responses: {
          200: {
            description: "Comment unliked (returns updated comment)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          400: { description: "Not yet liked or invalid ID" },
        },
      },
    },

    "/comments/{commentId}": {
      put: {
        tags: ["Comments"],
        summary: "Edit a comment",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Comment updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Not the comment’s author" },
          404: { description: "Comment not found" },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
          },
        ],
        responses: {
          200: {
            description: "Comment deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          403: { description: "Not the comment’s author" },
          404: { description: "Comment not found" },
        },
      },
    },
  },
};
