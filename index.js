import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnection } from "./DB/dbConnection.js";
import { AppError } from "./src/utils/AppError.js";
import { globalErrorHandling } from './src/middlewares/globalErrorHandling.js';
import authRouter from "./src/modules/Auth/auth.routes.js";

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3001;

app.use('/api/v1/auth',authRouter)

app.all("*", (req, res, next) => {
  next(new AppError("Endpoint was not found", 404));
});

app.use(globalErrorHandling);
dbConnection();
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
