import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import configServer from "@discorde/datamodel/lib/config/configServer";

createConnection()
  .then(async (connection) => {
    configServer(Number(process.env.PORT) || 3005, Routes, connection, "Yahoo");
  })
  .catch((error) => console.log(error));
