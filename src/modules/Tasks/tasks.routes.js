import { Router } from "express";
import * as task from "./tasks.controller.js";
import { verifyAndAuthorize } from "../../middlewares/authToken.js";
import { validate } from "../../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema } from "./tasks.validation.js";

const taskRouter = Router();

taskRouter.post("/create", verifyAndAuthorize, task.createTask);
taskRouter.get("/user-tasks", verifyAndAuthorize, task.getUserTasks);
taskRouter.get("/get-all-tasks", verifyAndAuthorize, task.getAllTasks);
taskRouter.get("/shared-tasks", verifyAndAuthorize, task.getSharedTasks);
taskRouter.get("/private-tasks", verifyAndAuthorize, task.getPrivateTasks);
taskRouter.get("/:id", verifyAndAuthorize, task.getSpecificTask);
taskRouter.patch("/:id", verifyAndAuthorize, task.updateTask);
taskRouter.delete("/:id", verifyAndAuthorize, task.deleteTask);

export default taskRouter;
