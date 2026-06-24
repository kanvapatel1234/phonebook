# PhoneBook Application

A full-stack PhoneBook application built using Node.js, Express.js, MongoDB, and JWT Authentication. Users can securely register, log in, and manage their personal contacts. Each user can only access and modify their own contacts.

## Features

* User Registration
* User Login
* JWT Authentication
* Create Contact
* View Contacts
* Update Contact
* Delete Contact
* User-specific contact management
* Secure password hashing using bcrypt

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcryptjs

### Frontend

* HTML
* CSS
* JavaScript

## API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Contacts

* GET `/api/contacts`
* POST `/api/contacts`
* PUT `/api/contacts/:id`
* DELETE `/api/contacts/:id`

## Installation

```bash
git clone <repository-url>
cd phonebook
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev
```

## Project Structure

```text
controllers/
middleware/
models/
routes/
db.js
server.js
```

## Future Improvements

* Contact search functionality
* Profile management
* Pagination
* Contact groups and categories
* Cloud deployment

## Author

Kanva Patel
