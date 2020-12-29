# Sven 

### Service used for authentification and session management

## How to setup

1. Install packages
   `npm install`

2. Edit the `ormconfig.json` file and put Postgres's credentials in there.
   You can find these credentials on `heroku.com` at `discorde-app` => `Resources` => `Heroku Postgres` => `Settings` => `View Credentials...`.

## How to start

1. Start the Express server
   `npm start`

## API Routes

Routes can have @me instead of :userId to target caller user (ex: GET /users/@me for own infos).
Most routes with an id without @me are restricted for Admin only, use @me instead (ex: PATCH /users/1 is restricted to Admin only)

| Method | Route | Description | Return Value | Auth Required | Admin Only |
|--------|-------|-------------|--------------|---------------|------------|
| POST | /register | User Registration | String (Success/Failure) | No | No |
| DELETE | /account | User Delete | String (Success/Failure) | Yes | No |
| POST | /auth | User Login | String (JWT Token) | No | No |