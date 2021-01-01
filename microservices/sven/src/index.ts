import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import configServer from "@discorde/datamodel/lib/config/configServer";

createConnection()
  .then(async (connection) => {
    configServer(Number(process.env.PORT) || 3004, Routes, connection, "Sven");
  })
  .catch((error) => console.log(error));
