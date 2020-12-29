# Hermes 

### Service used for messages management (both private and in-servers)

## How to setup

1. Install packages
   `npm install`

2. Edit the `ormconfig.json` file and put Postgres's credentials in there.
   You can find these credentials on `heroku.com` at `discorde-app` => `Resources` => `Heroku Postgres` => `Settings` => `View Credentials...`.

## How to start

1. Start the Express server
   `npm start`


## API Routes

| Method | Route | Description | Return Value | Auth Required | Admin Only |
|--------|-------|-------------|--------------|---------------|------------|
| GET | /channels/:id/messages | Get messages from channel (:id) | Message[] | Yes | No |
| POST | /channels/:id/messages | Send message on channel (:id) | Nothing (Update with WebSocket) | Yes | No |
| PATCH | /channels/:id/messages/:messageId | Modify message (:messageId) on channel (:id) | Nothing (Update with WebSocket) | Yes | No |
| DELETE | /channels/:id/messages/:messageId | Delete message (:messageId) on channel (:id) | Nothing (Update with WebSocket) | Yes | No |
