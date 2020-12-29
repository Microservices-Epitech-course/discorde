# Chaussettes 

### Service for handling websockets (messages, user, servers, ...)

## How to setup

1. Install packages
   `npm install`

## How to start

1. Start the Express server
   `npm start`

## Channel Subscriptions / Return values

### Hermes

| Channel | Data | Description |
|---------|------|-------------|
|"channel:{channelId}"|{ action: "messageAdd", data: ...Message } | New Message on channel |
||{ action: "messageUpdate", data: ...Message } | Message updated on channel |
||{ action: "messageDelete", data: messageId } | Message deleted on channel |
||{ action: "delete", data: {}} | Channel deleted |
---

### JBDM

| Channel | Data | Description |
|---------|------|-------------|
|"user:{userId}"|{ action: "userUpdate", data: ...User } | User Infos Updated |
||{ action: "relationAdd", data: ...Relation } | Relation created |
||{ action: "relationUpdate", data: ...Relation } | Relation updated |
||{ action: "relationDelete", data: relationId } | Relation deleted |

---

### Kamoulox

| Channel | Data | Description |
|---------|------|-------------|

---

### Marine

| Channel | Data | Description |
|---------|------|-------------|

---

### Sven

| Channel | Data | Description |
|---------|------|-------------|

---

### Yahoo

| Channel | Data | Description |
|---------|------|-------------|
