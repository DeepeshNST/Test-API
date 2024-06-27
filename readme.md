## Summary Description

This API allows you to manage a list of usernames stored in a MySQL database. It provides endpoints to create, read, update, and delete usernames. Here’s a breakdown of what each part of the API does:

### Setup and Configuration

- **Express.js** is used to create the server.
- **MySQL** is used to connect to a MySQL database.
- **dotenv** is used to manage environment variables securely.

### Database Connection

- Connects to a MySQL database using credentials stored in environment variables.
- Creates a table called `usernames` if it doesn't already exist.
- Seeds the table with some initial usernames if it's empty.

### API Endpoints

- **POST /usernames**: Adds a new username to the database.
- **GET /usernames**: Retrieves all usernames from the database.
- **PUT /usernames/:id**: Updates a username in the database based on its ID.
- **DELETE /usernames/:id**: Deletes a username from the database based on its ID.

### Server

- Listens on a specified port (default is 5000) to handle incoming requests.

By using this API, you can easily manage a collection of usernames with standard CRUD operations.

start api
    - npm start

test api
    - npm test