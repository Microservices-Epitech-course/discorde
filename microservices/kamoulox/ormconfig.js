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
  "entities": ["node_modules/@discorde/datamodel/lib/entity/**/*"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "node_modules/@discorde/datamodel/lib/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
};
