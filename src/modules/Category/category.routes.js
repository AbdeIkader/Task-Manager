import { Router } from "express";
import * as category from "./category.controller.js";
import { verifyAndAuthorize } from "../../middlewares/authToken.js";

const categoryRouter = Router();

categoryRouter.post("/", verifyAndAuthorize, category.createCategory);
categoryRouter.get("/", verifyAndAuthorize, category.getCategories);
categoryRouter.get("/:id", verifyAndAuthorize, category.getCategory);
categoryRouter.patch("/:id", verifyAndAuthorize, category.updateCategory);
categoryRouter.delete("/:id", verifyAndAuthorize, category.deleteCategory);

export default categoryRouter;
