import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import configServer from "@discorde/datamodel/lib/config/configServer";

createConnection()
  .then(async (connection) => {
    configServer(Number(process.env.PORT) || 3002, Routes, connection, "Kamoulox");
  })
  .catch((error) => console.log(error));
