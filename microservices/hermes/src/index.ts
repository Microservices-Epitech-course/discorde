require('dotenv').config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import configServer from "@discorde/datamodel/lib/config/configServer";

createConnection({
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
})
  .then(async (connection) => {
    configServer(Number(process.env.PORT) || 3000, Routes, connection, "Hermes");
  })
  .catch((error) => console.log(error));
