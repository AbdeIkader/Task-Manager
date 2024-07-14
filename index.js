import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnection } from "./DB/dbConnection.js";
import { AppError } from "./src/utils/AppError.js";
import { globalErrorHandling } from './src/middlewares/globalErrorHandling.js';
import authRouter from "./src/modules/Auth/auth.routes.js";
import categoryRouter from "./src/modules/Category/category.routes.js";
import taskRouter from "./src/modules/Tasks/tasks.routes.js";

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3001;

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/task',taskRouter)

app.all("*", (req, res, next) => {
  next(new AppError("Endpoint was not found", 404));
});

app.use(globalErrorHandling);
dbConnection();
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
