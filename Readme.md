# API Testing Guide

This guide explains how to test the endpoints of the Learning Management System (LMS) API using Postman. The API allows for user authentication, course management, and category management.

## Setup Requirements

Before starting, ensure you have:

1. Node.js and npm installed
2. MongoDB running (locally or cloud)
3. Postman installed
4. The LMS API server code

## Initial Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with these variables:
   ```
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Authentication Testing

### 1. User Signup

Create a new user account.

**Request:**

- Method: `POST`
- URL: `http://localhost:5000/api/auth/signup`
- Headers:
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "firstname": "juadeb",
    "lastname": "gabriel",
    "username": "juadebgabriel",
    "email": "juadebgabriel@gmail.com",
    "password": "juadebgabriel2025",
    "role": "instructor"
  }
  ```

**Expected Response:**

- Status: `201 Created`
- Body: Contains user object with success message

### 2. User Signin

Login to get an authentication token.

**Request:**

- Method: `POST`
- URL: `http://localhost:5000/api/auth/signin`
- Headers:
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "juadebgabriel@gmail.com",
    "password": "juadebgabriel2025"
  }
  ```

**Expected Response:**

- Status: `200 OK`
- Body: Contains authentication token and user details

**Important:** Copy the token from the response for use in subsequent requests.

### 3. Get User Profile

Retrieve the current user's profile.

**Request:**

- Method: `GET`
- URL: `http://localhost:5000/api/auth/profile`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**

- Status: `200 OK`
- Body: Contains user profile information

### 4. Update User Profile

Update the current user's profile information.

**Request:**

- Method: `PUT`
- URL: `http://localhost:5000/api/auth/profile`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- Body: Form-data with these fields:
  - `firstname`: "John"
  - `lastname`: "Doe"
  - `bio`: "Professional instructor"
  - `title`: "Senior Instructor"
  - `experience`: 5
  - `profileImage`: [File upload]

**Expected Response:**

- Status: `200 OK`
- Body: Contains updated user data

### 5. Update Password

Change the user's password.

**Request:**

- Method: `PUT`
- URL: `http://localhost:5000/api/auth/password`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "currentPassword": "juadebgabriel2025!",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }
  ```

**Expected Response:**

- Status: `200 OK`
- Body: Contains success message

## Category Management

### 1. Create Category (Admin Only)

Create a new course category.

**Request:**

- Method: `POST`
- URL: `http://localhost:5000/api/categories`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (must be admin)
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "name": "Web Development",
    "description": "Courses related to web development",
    "order": 1
  }
  ```

**Expected Response:**

- Status: `201 Created`
- Body: Contains the created category with an ID

**Important:** Save the category ID for creating courses.

### 2. Get All Categories

Retrieve all categories.

**Request:**

- Method: `GET`
- URL: `http://localhost:5000/api/categories`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (optional)

**Expected Response:**

- Status: `200 OK`
- Body: Contains array of categories

### 3. Get Category by ID

Retrieve a specific category.

**Request:**

- Method: `GET`
- URL: `http://localhost:5000/api/categories/CATEGORY_ID_HERE`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (optional)

**Expected Response:**

- Status: `200 OK`
- Body: Contains category details

## Course Management

### 1. Create Course (Instructor/Admin Only)

Create a new course.

**Request:**

- Method: `POST`
- URL: `http://localhost:5000/api/courses`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (must be instructor/admin)
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "Introduction to JavaScript",
    "description": "Learn the basics of JavaScript programming",
    "category": "CATEGORY_ID_HERE",
    "price": 49.99,
    "level": "Beginner",
    "previewImage": "https://example.com/preview.jpg",
    "requirements": ["Basic HTML knowledge", "Computer with internet access"],
    "learningOutcomes": [
      "Understand JavaScript basics",
      "Build simple applications"
    ],
    "tags": ["javascript", "web development", "programming"]
  }
  ```

**Expected Response:**

- Status: `201 Created`
- Body: Contains the created course with an ID

### 2. Get All Courses

Retrieve all published courses.

**Request:**

- Method: `GET`
- URL: `http://localhost:5000/api/courses`
- Optional Query Parameters:
  - `search`: Search text
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sort`: Sort field (e.g., -createdAt)
  - `level`: Filter by level
  - `category`: Filter by category

**Expected Response:**

- Status: `200 OK`
- Body: Contains array of courses with pagination info

### 3. Get Course by ID

Retrieve a specific course.

**Request:**

- Method: `GET`
- URL: `http://localhost:5000/api/courses/COURSE_ID_HERE`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (optional)

**Expected Response:**

- Status: `200 OK`
- Body: Contains course details

### 4. Update Course (Owner/Admin Only)

Update an existing course.

**Request:**

- Method: `PUT`
- URL: `http://localhost:5000/api/courses/COURSE_ID_HERE`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (must be course owner/admin)
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "Updated JavaScript Course",
    "description": "Updated course description"
  }
  ```

**Expected Response:**

- Status: `200 OK`
- Body: Contains updated course

### 5. Delete Course (Owner/Admin Only)

Delete an existing course.

**Request:**

- Method: `DELETE`
- URL: `http://localhost:5000/api/courses/COURSE_ID_HERE`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE` (must be course owner/admin)

**Expected Response:**

- Status: `200 OK`
- Body: Contains success message

## Testing Flow

For a complete test flow, follow these steps:

1. **Setup User:**

   - Sign up as admin
   - Sign in to get token

2. **Setup Categories:**

   - Create a category (as admin)
   - Verify by getting all categories

3. **Course Management:**
   - Create a course using the category ID
   - Get all courses
   - Get the specific course
   - Update the course
   - Delete the course

## Common Issues and Troubleshooting

### Authentication Issues

- Ensure your token is valid and not expired
- Check that you're including "Bearer " before the token
- Verify that your user has the appropriate role for the action

### MongoDB Connection Errors

- Check that your MongoDB connection string is correct in the .env file
- Ensure MongoDB is running and accessible

### File Upload Issues

- Check that the uploads directory exists and is writable
- Ensure you're sending the correct content type for file uploads

### Category ID Issues

- When creating a course, use a real category ID from your database
- Verify the category exists by getting it by ID first

## Conclusion

This guide covers the basic testing scenarios for the LMS API. You can extend these tests to include more complex scenarios, such as course enrollment, section and lecture management, and reviews.

Remember to store tokens and IDs from responses to use in subsequent requests. Setting up environment variables in Postman can make this process more efficient.
