# Jean-Baptiste de Martigny

### Service used for all user-related processes.

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

| Method | Route | Description | Return Value | Auth Required | Admin Only | Can @me |
|--------|-------|-------------|--------------|---------------|------------|---------|
| GET | /users | Get all users | User[] | Yes | Yes | No |
| GET | /users/:userId | Get User (:userId) infos | User | Yes | No | Yes |
| PATCH | /users/:userId | Change User (:userId) username | User | Yes | No | Yes |
||
| GET | /users/:userId/relations | Get all User (:userId) relations | Relation[] | Yes | Yes | Yes |
| GET | /users/:userId/relations/:userTwoId | Get one User (:userId) with an other User (:userTwoId) | Relation | Yes | Yes | Yes |
| GET | /users/:userId/friends | Get one User (:userId) accepted friends | Relation[] | Yes | No | Yes |
| GET | /users/:userId/invites/sent | Get one User (:userId) sent invites | Relation[] | Yes | No | Yes |
| GET | /users/:userId/invites/received | Get one User (:userId) received invites | Relation[] | Yes | No | Yes |
| GET | /users/:userId/blocked | Get one User (:userId) blocked users | Relation[] | Yes | No | Yes |
| POST | /users/:userId/relations/:userTwoId | Create a relation from User (:userId) with an other User (:userTwoId) | Relation | Yes | No | Yes |
| PATCH | /users/:userId/relations/:userTwoId | Update a relation from User (:userId) with an other User (:userTwoId) (accept/deny/block) | Relation | Yes | No | Yes |
| DELETE | /users/:userId/relations/:userTwoId | Delete a relation from User (:userId) with an other User (:userTwoId) | Number (id of Relation) | Yes | No | Yes |
|||
