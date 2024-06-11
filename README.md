# Blog Post API

This is a RESTful API for managing blog posts. It allows users to create, read, update, and delete blog posts. Token-based authentication is used to secure the API endpoints.

## Table of Contents

- [Getting Started](##getting-started)
- [Authentication](#authentication)
- [Blog Posts](#blog-posts)
  - [Create a Post](#create-a-post)
  - [Get All Posts](#get-all-posts)
  - [Get a Post](#get-a-post)
  - [Update a Post](#update-a-post)
  - [Delete a Post](#delete-a-post)

## Getting Started

To get started with the API, follow these steps:

1. Clone the repository:
   ```bash
   https://github.com/Satyam1923/blog-api.git
2. Install dependencies:
   ```bash
   cd blog-api
   npm install .
3. Set up environment variables
   
   Create a `.env` file in the root directory and add the following variables:
   ```makefile
   JWT_SECRET=your_jwwt_secret
   FIREBASE_DATABASE_URL=https://<yourfirebaseprojectid>.firebaseio.com
   PORT = 3000
5. Start the serve:
   ```bash
   npm start

## Authentication

POST /token 

Generate a JWT token for authenication.

**Request Body:**
```json
{
"username":"exampl_user"
}
```
**Response:**
```json
{
 "token":"generated_jwk_token"
}
```

## Blog Post

For any CRUD operation authorization token header is required.

### Create a Post
POST /posts

Create a new blog post.

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post Content"
}
```
**Response:**
```json
{
  "id": "post_id",
  "title": "Post Title",
  "content": "Post Content",
  "createdAt": "timestamp"
}
```

### Get All Posts
GET /posts

Get all blog posts.

**Response:**
```json
[
  {
    "id": "post_id",
    "title": "Post Title",
    "content": "Post Content",
    "createdAt": "timestamp"
  },
  {
    "id": "post_id",
    "title": "Post Title",
    "content": "Post Content",
    "createdAt": "timestamp"
  }
]
```
### Get a Post

GET /posts/:id

Get a specific blog post by ID.
**Response:**
```json
{
  "id": "post_id",
  "title": "Post Title",
  "content": "Post Content",
  "createdAt": "timestamp"
}
```
### Update a Post

PUT /posts/:id

Update a specific blog post by ID.

**Request Body:**
```json
{
"title": "New Post Title",
"content": "New Post Content"
}
```
**Response:**
```json
{
  "id": "post_id",
  "title": "New Post Title",
  "content": "New Post Content"
}

```
### Delete a post

DELETE /posts/:id

Delete a specific blog post by ID.

**Respone:**
```json
{
"message":"Post deleted"
}
```
