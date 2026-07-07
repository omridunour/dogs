# CRM - Subscription Management System

A full-stack CRM application that enables admins to manage subscriptions for organizations and gives users access to their organization's dashboard.

## Features

- **Admin Dashboard**: Manage all organizations and their subscriptions
- **Organization Owner Dashboard**: Manage team members and view subscription details
- **User Dashboard**: View organization information and current subscription
- **Authentication**: JWT-based authentication with email/password
- **Role-Based Access Control**: Admin, Organization Owner, and User roles
- **Subscription Management**: Create, update, and cancel subscriptions with different plans
- **User Management**: Add/remove users from organizations

## Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MongoDB**: NoSQL database
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS**: Custom styling

## Project Structure

```
/backend
  /src
    /models          # MongoDB schemas
    /routes          # API routes
    /controllers     # Route handlers
    /middleware      # Authentication & authorization middleware
    server.js        # Main server file
  package.json
  .env.example

/frontend
  /src
    /pages           # Page components (Login, Dashboard, etc.)
    /services        # API services
    /styles          # CSS files
    /components      # Reusable components
    App.js           # Main app component
    index.js         # Entry point
  /public
    index.html       # HTML template
  package.json
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

5. Install MongoDB locally or use MongoDB Atlas (cloud)

6. Start the backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### User Roles & Access

#### 1. Admin
- View all organizations
- View all subscriptions
- Manage all subscriptions (create, update, cancel)
- Full system control

**Test Login:**
- Register a new user and manually set their role to 'admin' in MongoDB

#### 2. Organization Owner
- Create and manage organizations
- Manage team members (add/remove users)
- View organization subscription details
- Cannot access admin functions

#### 3. Regular User
- View their organization's details
- View assigned subscription
- Cannot modify anything (read-only access)

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

#### Organizations
- `GET /api/organizations` - Get all organizations (admin only)
- `POST /api/organizations` - Create new organization
- `GET /api/organizations/:organizationId` - Get organization details
- `PUT /api/organizations/:organizationId` - Update organization (owner only)
- `POST /api/organizations/:organizationId/users` - Add user to organization
- `DELETE /api/organizations/:organizationId/users/:userId` - Remove user from organization

#### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions (admin only)
- `POST /api/subscriptions` - Create subscription (admin only)
- `PUT /api/subscriptions/:subscriptionId` - Update subscription (admin only)
- `DELETE /api/subscriptions/:subscriptionId` - Cancel subscription (admin only)
- `GET /api/subscriptions/org/:organizationId` - Get organization's subscriptions

## Available Subscription Plans

| Plan | Price | Max Users | Features |
|------|-------|-----------|----------|
| Free | $0 | 5 | Basic access |
| Starter | $99/mo | 20 | Team management |
| Pro | $299/mo | 50 | Analytics |
| Enterprise | $999/mo | Unlimited | Premium support |

## Quick Start Test Flow

1. **Register Account**
   - Go to http://localhost:3000/register
   - Create a new account

2. **Login**
   - Use your credentials to log in
   - You'll be directed to user dashboard

3. **Create Organization** (if not org owner yet)
   - Navigate to create organization
   - You'll become an org_owner

4. **Admin Testing** (manual setup required)
   - Manually update your user role to 'admin' in MongoDB
   - Login and access admin dashboard at `/admin/dashboard`
   - Create subscriptions for organizations

5. **Manage Team**
   - Add users to your organization
   - Remove users as needed

## Environment Variables

### Backend (.env)
```
PORT=5000                              # Server port
MONGODB_URI=mongodb://localhost:27017/crm_db  # MongoDB connection
JWT_SECRET=your_secret_key             # JWT secret key
NODE_ENV=development                   # Environment
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api   # Backend API URL
```

## Development Tips

- **Hot Reload**: Both frontend and backend support automatic restart on file changes
- **API Testing**: Use Postman or similar tools to test APIs directly
- **Database**: Use MongoDB Compass to visualize data
- **Browser DevTools**: Use React DevTools and Redux DevTools for debugging

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, allow your IP in firewall settings

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env.local`
- Clear browser cache

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :3000` then `kill -9 <PID>`

## Next Steps for Enhancement

- Add payment integration (Stripe)
- Email notifications for subscription events
- Advanced analytics and reporting
- API documentation (Swagger/OpenAPI)
- Unit & integration tests
- Docker containerization
- CI/CD pipeline

## License

MIT License - feel free to use this project as a base for your CRM!
