# Todo App Backend

A simple RESTful API for a Todo application built with Node.js.

## Features

- User authentication with JWT tokens
- CRUD operations for todos
- User management
- File-based data storage (JSON files)

## Technologies Used

- **Node.js** - Runtime environment
- **JSON Web Tokens (JWT)** - Authentication
- **dotenv** - Environment variable management

## Project Structure

```
todo-app-backend/
├── app.js                 # Main application setup
├── index.js              # Server entry point
├── package.json          # Dependencies and scripts
├── controller/           # Route controllers
│   ├── auth.js          # Authentication logic
│   ├── notFoundController.js
│   ├── reqResController.js
│   ├── todoController.js # Todo CRUD operations
│   └── userController.js # User management
├── model/               # Data models and storage
│   ├── data.js         # Data access layer
│   ├── todos.json      # Todo data storage
│   └── users.json      # User data storage
└── utilities/          # Helper functions
    └── utilities.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MD-ABU-RAIHAN/todo-app-backend.git
   cd todo-app-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

## Usage

### Development
Start the server in development mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

### Production
For production deployment:
```bash
node index.js
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Todos
- `GET /todos` - Get all todos for authenticated user
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Users
- `GET /users` - Get user information
- `PUT /users/:id` - Update user information

## Data Storage

This application uses JSON files for data persistence:
- `model/users.json` - Stores user information
- `model/todos.json` - Stores todo items

## Security

- JWT tokens for authentication
- Environment variables for sensitive data
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**MD ABU RAIHAN** - [GitHub](https://github.com/MD-ABU-RAIHAN)
