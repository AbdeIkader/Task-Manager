import { Router } from "express";
import * as task from "./tasks.controller.js";
import { verifyAndAuthorize } from "../../middlewares/authToken.js";

const taskRouter = Router();

taskRouter.post("/", verifyAndAuthorize, task.createTask);
taskRouter.get("/user-tasks", verifyAndAuthorize, task.getUserTasks);
taskRouter.get("/", verifyAndAuthorize, task.getAllTasks);
taskRouter.get("/shared-tasks", verifyAndAuthorize, task.getSharedTasks);
taskRouter.get("/private-tasks", verifyAndAuthorize, task.getPrivateTasks);
taskRouter.get("/:id", verifyAndAuthorize, task.getSpecificTask);
taskRouter.patch("/:id", verifyAndAuthorize, task.updateTask);
taskRouter.delete("/:id", verifyAndAuthorize, task.deleteTask);

export default taskRouter;
