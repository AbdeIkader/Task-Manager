import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnection } from "./DB/dbConnection.js";
import { AppError } from "./src/utils/AppError.js";
import { globalErrorHandling } from './src/middlewares/globalErrorHandling.js';

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Hello World!"));

app.all("*", (req, res, next) => {
  next(new AppError("Endpoint was not found", 404));
});

app.use(globalErrorHandling);
dbConnection();
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
