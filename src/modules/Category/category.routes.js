import { Router } from "express";
import * as category from "./category.controller.js";
import { verifyAndAuthorize } from "../../middlewares/authToken.js";
import { validate } from "../../middlewares/validate.js";
import {createCategorySchema,updateCategorySchema} from "./category.validation.js";

const categoryRouter = Router();

categoryRouter.post("/create",verifyAndAuthorize,validate(createCategorySchema),category.createCategory);
categoryRouter.get("/get-all-categories", verifyAndAuthorize, category.getCategories);
categoryRouter.get("/:id", verifyAndAuthorize, category.getCategory);
categoryRouter.patch("/:id",verifyAndAuthorize,validate(updateCategorySchema),category.updateCategory);
categoryRouter.delete("/:id", verifyAndAuthorize, category.deleteCategory);

export default categoryRouter;
