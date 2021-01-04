# Marine 

### Service used for server management

## How to setup

1. Install packages
   `npm install`

2. Edit the `ormconfig.json` file and put Postgres's credentials in there.
   You can find these credentials on `heroku.com` at `discorde-app` => `Resources` => `Heroku Postgres` => `Settings` => `View Credentials...`.

## How to start

1. Start the Express server
   `npm start`

## API Routes

| Method | Route | Description | Return Value | Auth Required | Admin Only | Can @me |
|--------|-------|-------------|--------------|---------------|------------|---------|
| GET | /servers | Get all servers | Server[] | Yes | Yes | No |
| GET | /servers/:serverId | Get Server (:serverId) infos | Server | Yes | No | No |
| POST | /servers | Create a Server | Server | Yes | No | No |
| DELETE | /servers/:serverId | Delete Server (:serverId) | Server | Yes | No | No |
| GET | /servers/:serverId/members | Get all members from Server (:serverId) | Member[] | Yes | No | No |
| GET | /servers/:serverId/members/:memberId | Get Member (:memberId) infos from Server (:serverId) | Member | Yes | No | No |
| POST | /servers/:serverId/members | Add a Member to Server (:serverId) | Member | Yes | No | No |
| DELETE | /servers/:serverId/members/:memberId | Remove Member (:memberId) from Server (:serverId) | Member | Yes | No | No |
| GET | /servers/:serverId/channels | Get all channels from Server (:serverId) | Channel[] | Yes | No | No |
| GET | /servers/:serverId/channels/:channelId | Get Channel (:channelId) infos from Server (:serverId) | Channel | Yes | No | No |
| POST | /servers/:serverId/channels | Add a Channel to Server (:serverId) | Channel | Yes | No | No |
| DELETE | /servers/:serverId/channels/:channelId | Remove Channel (:channelId) from Server (:serverId) | Channel | Yes | No | No |
