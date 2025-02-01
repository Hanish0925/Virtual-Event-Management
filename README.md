# Virtual Event Management

## Overview
The **Virtual Event Management** system is a backend application designed to manage events, user registrations, and user preferences. It provides APIs for creating events, registering users, managing user preferences, and handling authentication.

This project is built using **Node.js**, **Express.js**, and an in-memory database (arrays) for simplicity. It uses **JWT (JSON Web Tokens)** for authentication and **bcrypt** for password hashing.

---

## Features
- **User Management**:
  - User registration and login.
  - Password hashing for security.
  - JWT-based authentication.
- **Event Management**:
  - Create, update, delete, and fetch events.
  - Register and unregister users for events.
- **User Preferences**:
  - Update and fetch user preferences.
- **Email Notifications**:
  - Send email notifications for event registration and creation (using `nodemailer`).

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email Notifications**: nodemailer
- **Environment Variables**: dotenv

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/virtual-event-management.git
   cd virtual-event-management
   ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```
        JWT_SECRET=your_jwt_secret
        PORT=portnumber
        EMAIL_USER=admin@user.com
        EMAIL_PASS=apppassword

## Usage

1. Start the server:
    ```sh
    npm run dev
    ```

2. The server will be running on `http://localhost:3000`.

## API Endpoints

### User Authentication

- **Sign Up**
    - `POST /users/signup`
    - Request Body:
        ```json
        {
            "name": "Clark Kent",
            "email": "clark@superman.com",
            "password": "Krypt()n8",
            "preferences": ["movies", "comics"]
        }
        ```

- **Log In**
    - `POST /users/login`
    - Request Body:
        ```json
        {
            "email": "clark@superman.com",
            "password": "Krypt()n8"
        }
        ```

### User Preferences

- **Get Preferences**
    - `GET /users/preferences`
    - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```

- **Update Preferences**
    - `PUT /users/preferences`
    - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```
    - Request Body:
        ```json
        {
            "preferences": ["movies", "comics", "games"]
        }
        ```
### Event Management 

- **Create Event**
    - `POST /events`
    - Request Body:
        ```json
        {
            "name": "Party",
            "date": "2023-12-25",
            "time": "18:00",
            "description": "Christmas Party"
        }
        ```
- **GET ALL EVENTS**
    - `GET /events`
    - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```
- **Delete Event**
    - `DELETE /events/id`
    - Request Body:
        - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```
- **Update Events**
    - `PUT /events/id`
    - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```
    - Request Body:
        ```json
        {
            "name": "Updated Tech Conference",
            "date": "2023-12-20",
            "location": "San Francisco",
            "description": "Updated annual tech conference for developers."
        }
        ```


- **RegisterforEvent**
    - `POST /events/eventId/register`
    - Headers:
        ```json
        {
            "Authorization": "Bearer <token>"
        }
        ```
## Running Tests

To run the tests, use the following command:
```sh
npm test