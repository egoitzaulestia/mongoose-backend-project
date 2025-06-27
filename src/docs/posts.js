// src/doc/posts.js
module.exports = {
  paths: {
    // ---- Create a new post (with up to 4 images) ----
    "/posts/create": {
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        description:
          "Authenticated users can create a post with up to 4 images.",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Optional title (max 100 chars)",
                    example: "My day in the mountains",
                  },
                  content: {
                    type: "string",
                    description: "The body of your post",
                    example: "Today I hiked 10km and saw amazing views!",
                  },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Up to 4 images",
                  },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    post: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // ---- Get all posts (paginated via query) ----
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "List all posts",
        description:
          "Retrieve a paginated list of posts. Query params: `page`, `limit`.",
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
            description: "A list of posts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Post" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ---- Get posts + comments + authors, with pagination ----
    // "/posts/full": {
    //   get: {
    //     tags: ["Posts"],
    //     summary: "List posts with their comments",
    //     description:
    //       "Returns posts including nested comments and authors. Paginated.",
    //     parameters: [
    //       {
    //         name: "page",
    //         in: "query",
    //         schema: { type: "integer", default: 1 },
    //       },
    //       {
    //         name: "limit",
    //         in: "query",
    //         schema: { type: "integer", default: 10 },
    //       },
    //     ],
    //     responses: {
    //       200: {
    //         description: "Posts + comments + nested authors",
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 total: { type: "integer" },
    //                 page: { type: "integer" },
    //                 pages: { type: "integer" },
    //                 posts: {
    //                   type: "array",
    //                   items: {
    //                     type: "object",
    //                     properties: {
    //                       ... /* same as Post but with: */,
    //                       comments: {
    //                         type: "array",
    //                         items: { $ref: "#/components/schemas/Comment" },
    //                       },
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    /////////////
    /////////////
    // "/posts/full": {
    //   get: {
    //     tags: ["Posts"],
    //     summary: "List posts with their comments",
    //     description:
    //       "Returns posts including nested comments and authors. Paginated.",
    //     parameters: [
    //       {
    //         name: "page",
    //         in: "query",
    //         schema: { type: "integer", default: 1 },
    //       },
    //       {
    //         name: "limit",
    //         in: "query",
    //         schema: { type: "integer", default: 10 },
    //       },
    //     ],
    //     responses: {
    //       200: {
    //         description: "Posts + comments + nested authors",
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 total: { type: "integer" },
    //                 page: { type: "integer" },
    //                 pages: { type: "integer" },
    //                 posts: {
    //                   type: "array",
    //                   items: { $ref: "#/components/schemas/PostWithComments" },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },

    "/posts/full": {
      get: {
        // …
        responses: {
          200: {
            description: "Posts + comments + nested authors",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    page: { type: "integer" },
                    pages: { type: "integer" },
                    posts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
                          author: {
                            type: "string",
                            pattern: "^[0-9a-fA-F]{24}$",
                          },
                          title: { type: "string" },
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
                                userId: {
                                  type: "string",
                                  pattern: "^[0-9a-fA-F]{24}$",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                },
                              },
                            },
                          },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },

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
        },
      },
    },

    // ---- Update an existing post ----
    "/posts/id/{_id}": {
      put: {
        tags: ["Posts"],
        summary: "Update a post",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9a-fA-F]{24}$",
            },
            description: "MongoDB ObjectId of the post",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "New images to replace existing ones",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    post: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
          404: { description: "Post not found" },
          401: { description: "Unauthorized" },
        },
      },

      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "_id",
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
            description: "Post deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    post: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },

      get: {
        tags: ["Posts"],
        summary: "Get a post by its ID",
        parameters: [
          {
            name: "_id",
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
            description: "Requested post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          404: { description: "Post not found" },
        },
      },
    },

    // ---- Search posts by title ----
    "/posts/title/{title}": {
      get: {
        tags: ["Posts"],
        summary: "Search posts by title",
        parameters: [
          {
            name: "title",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Case-insensitive substring search",
          },
        ],
        responses: {
          200: {
            description: "Matching posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
          400: { description: "Title too long" },
        },
      },
    },

    // ---- Like / Unlike a post ----
    "/posts/{postId}/like": {
      post: {
        tags: ["Posts"],
        summary: "Like a post",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "postId",
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
            description: "Post liked – returns updated post",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    post: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
          400: { description: "Already liked" },
          401: { description: "Unauthorized" },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Unlike a post",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "postId",
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
            description: "Like removed – returns updated post",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    post: { $ref: "#/components/schemas/Post" },
                  },
                },
              },
            },
          },
          400: { description: "Not yet liked" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // ---- Comments on a post ----
    "/posts/{postId}/comments": {
      post: {
        tags: ["Posts", "Comments"],
        summary: "Add a comment to a post",
        description: "Use same form-data as Posts.create",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "postId",
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
          201: {
            description: "Comment created",
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
          401: { description: "Unauthorized" },
        },
      },

      get: {
        tags: ["Posts", "Comments"],
        summary: "List comments on a post",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "postId",
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
            description: "Array of comments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};
