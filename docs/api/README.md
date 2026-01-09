# VetConnect API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/setup-2fa` - Setup 2FA
- `POST /auth/verify-2fa` - Verify 2FA code

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user
- `GET /users/:id` - Get user by ID
- `GET /users/search` - Search users

### Profiles
- `GET /profiles/:userId` - Get user profile
- `PUT /profiles/:userId` - Update profile
- `POST /profiles/experience` - Add experience
- `PUT /profiles/experience/:id` - Update experience
- `DELETE /profiles/experience/:id` - Delete experience

[... Full API documentation in Swagger format ...]
