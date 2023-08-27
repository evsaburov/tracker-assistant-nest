- "tracker-assistant-nest" this is a variant of the project "tracker-assistant", but now the framework is used.

- This project uses nestjs 'framework', 'telegraf', 'telegraf-postgres-session' as session middleware.

- You need to fill in the file .env .

```
BOT_TOKEN = <BOT_TOKEN>
TRACKER_URL = 'https://feed.rutracker.cc/atom/f/0.atom'
DATABASE_URL='<DATABASE_URL>'
```

In postgres need create a table
``CREATE TABLE Sessions (sessionID varchar, data varchar);`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
