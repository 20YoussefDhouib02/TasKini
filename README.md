# TasKini

<p align="center">
    <a href="https://github.com/20YoussefDhouib02/TasKini">
        <img src="./frontend/public/logo.png" alt="Logo">
    </a>
</p>

&nbsp;
TasKini is a web application designed to streamline team task management. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), it provides a user-friendly interface for efficient task assignment and tracking to enhance productivity and organization.


## **General Application Features:**
1. **Authentication and Authorization:**
    - User login with secure authentication.
    - Role-based access control.

2. **Profile Management:**
    - Update user profiles and change passwords securely.

3. **Dashboard:**
    - Provide a summary of user activities.
    - Manage tasks and filter them into todo, in progress, or completed.

4. **Chatbot:**
    - Discuss your thoughts and plans with an ai based chatbot.


## **Technologies Used:**
- **Frontend:**
    - React (Vite)
    - Redux Toolkit for State Management

- **Backend:**
    - Node.js with Express.js
    
- **Database:**
    - MongoDB.


## SETUP INSTRUCTIONS

## Set Up MongoDB:

1. Create a new dataset called `todo`
2. Make sure you are connected to the database.

## Steps to run server

1. Open the project in any editor of choice.
2. Navigate into the server directory `cd server`.
3. Create `.env` file and add the following environment variables: `MONGODB_URI`,`JWT_SECRET`,`PORT` and `NODE_ENV`.
4. Run `npm install` to install the packages.
5. Run `npm start` to start the server. If everything goes correctly, you should see a message indicating that the server is running successfully and `Database Connected`.

## Steps to run client

1. Navigate into the client directory `cd client`.
2. Run `npm install` to install the packages.
3. Create `.env` file and add the following environment variable: `VITE_APP_BASE_URL`.
4. Run `npm start` to run the app.

Enjoy!