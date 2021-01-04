module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
  "synchronize": true,
  "logging": false,
  "ssl": true,
  "extra": {
    "ssl": {
      "rejectUnauthorized": false
    }
  },
  "entities": ["microservices/datamodel/src/entity/**/*"],
  "migrations": ["microservices/datamodel/src/migration/**/*.ts"],
  "subscribers": ["microservices/datamodel/src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "microservices/datamodel/src/entity",
    "migrationsDir": "microservices/datamodel/src/migration",
    "subscribersDir": "microservices/datamodel/src/subscriber"
  }
};
