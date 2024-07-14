import { catchAsyncError } from "./../../utils/catchAsyncError.js";
import { categoryModel } from "./../../../DB/models/category.model.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const user = req.user._id;

  // Check if the category with the same name already exists for the user
  const existingCategory = await categoryModel.findOne({ name, user });
  if (existingCategory) {
    return next(new AppError("Category name already exists", 409));
  }

  const newCategory = await categoryModel.create({ name, user });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});

const getCategories = catchAsyncError(async (req, res, next) => {
  const features = new ApiFeatures(categoryModel.find(), req.query)
    .filteration()
    .sort()
    .pagination()
    .fields();

  const categories = await features.mongooseQuery
    .populate({
      path: 'tasks',
      populate: {
        path: 'user',
        select: 'name -_id' 
      }
    })
    .populate({
      path: 'user',
      select: 'name -_id'
    });

  const transformedCategories = categories.map(category => {
    return {
      ...category.toObject(),
      user: category.user.name,
      tasks: category.tasks.map(task => ({
        ...task.toObject(),
        user: task.user.name
      }))
    };
  });

  res.status(200).json({
    success: true,
    data: transformedCategories,
  });
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const category = await categoryModel
    .findById(req.params.id)
    .populate({
      path: 'tasks',
      populate: {
        path: 'user',
        select: 'name -_id'
      }
    })
    .populate({
      path: 'user',
      select: 'name -_id'  
    });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  console.log(category.user.toString());
  console.log(req.user._id.toString());

  const transformedCategory = {
    ...category.toObject(),
    user: category.user.name,
    tasks: category.tasks.map(task => ({
      ...task.toObject(),
      user: task.user.name
    }))
  };

  res.status(200).json({
    success: true,
    data: transformedCategory,
  });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  const category = await categoryModel.findById(req.params.id);

  if (!category || category.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Category not found", 404));
  }

  category.name = name || category.name;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);

  if (!category || category.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Category not found", 404));
  }

  await category.remove();

  res.status(204).json({
    success: true,
    message: "Category deleted successfully",
  });
});
export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
