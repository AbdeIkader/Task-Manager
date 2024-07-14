import { categoryModel } from "../../../DB/models/category.model.js";
import { taskModel } from "../../../DB/models/task.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

const createTask = catchAsyncError(async (req, res, next) => {
  const { title, type, items, isShared, category } = req.body;
  const user = req.user._id;

  let content = '';
  if (type === 'Text') {
    content = title;
  }

  const newTask = await taskModel.create({
    title,
    type,
    content,
    items,
    isShared,
    category,
    user,
  });

  // Add the new task to the category's tasks array
  await categoryModel.findByIdAndUpdate(category, {
    $push: { tasks: newTask._id }
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask,
  });
});


// Fetching all tasks for a specific user - both private and shared 
const getUserTasks = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);
  const tasks = await taskModel.find({
    user: req.user._id
  });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

//Fetching all tasks for authenticated users - their own tasks and shared tasks from others
const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await taskModel.find({
    $or: [
      { user: req.user._id },
      { isShared: true }
    ]
  });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

// Fetching shared tasks for unauthenticated and authenticated users
 const getSharedTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await taskModel.find({ isShared: true });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

// private (visible only to the creator) (only their own tasks)
const getPrivateTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await taskModel.find({
    user: req.user._id,
    isShared: false
  });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

const getSpecificTask = catchAsyncError(async (req, res, next) => {
  const task = await taskModel
    .findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name -_id'
    });

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You're not allowed to view this task", 403));
  }

  const transformedTask = {
    ...task.toObject(),
    user: task.user.name
  };

  res.status(200).json({
    success: true,
    data: transformedTask,
  });
});


const updateTask = catchAsyncError(async (req, res, next) => {
  const { title, type, content, items, isShared, category } = req.body;

  const task = await taskModel.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Task not found or you're not allowed to update this task", 403));
  }

  task.title = title !== undefined ? title : task.title;
  task.type = type !== undefined ? type : task.type;
  task.content = content !== undefined ? content : task.content;
  task.items = items !== undefined ? items : task.items;
  task.isShared = isShared !== undefined ? isShared : task.isShared;
  task.category = category !== undefined ? category : task.category;

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const deleteTask = catchAsyncError(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Task not found", 404));
  }

  await task.deleteOne();

  res.status(204).json({
    success: true,
    message: "Task deleted successfully",
  });
});

export{
  createTask,
  getUserTasks,
  getAllTasks,
  getPrivateTasks,
  getSharedTasks,
  getSpecificTask,
  updateTask,
  deleteTask
}