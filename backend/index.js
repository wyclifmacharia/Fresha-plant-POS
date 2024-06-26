import dotenv from "dotenv"; 
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: __dirname + "/.env" });

import express from "express";
import { createServer } from "http";
 

const app = express();

var httpServer = createServer(app);
httpServer.listen(process.env["PORT"], function () {
  console.log("Server listening on port " + process.env["PORT"] + "!");
 
});
 
/*** end of express server init */

/** Database connection */
import DatabaseManager from "./lib/DatabaseManager.js";
DatabaseManager.connect(function (err, conn) {});
 
 

/*** initiate api routes  */
import { init } from "./routes/index.js"; 
init(app);
/***end of api routes */
 
 