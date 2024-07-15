import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { userModel } from './DB/models/user.model.js';
import { categoryModel } from './DB/models/category.model.js';
import { taskModel } from './DB/models/task.model.js';

dotenv.config();

const NUM_USERS = 50;
const NUM_CATEGORIES_PER_USER = 3;
const NUM_TASKS_PER_CATEGORY = 5;

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await userModel.deleteMany({});
  await categoryModel.deleteMany({});
  await taskModel.deleteMany({});

  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    users.push({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: await bcrypt.hash('password123', 10),
    });
  }
  const createdUsers = await userModel.insertMany(users);

  for (const user of createdUsers) {
    const categories = [];
    for (let i = 0; i < NUM_CATEGORIES_PER_USER; i++) {
      categories.push({
        name: `Category ${i + 1}`,
        user: user._id,
      });
    }
    const createdCategories = await categoryModel.insertMany(categories);

    for (const category of createdCategories) {
      for (let i = 0; i < NUM_TASKS_PER_CATEGORY; i++) {
        const taskType = Math.random() > 0.5 ? 'Text' : 'List';
        const taskData = {
          title: `Task ${i + 1}`,
          type: taskType,
          items: taskType === 'List' ? [generateRandomString(10), generateRandomString(10), generateRandomString(10)] : [],
          isShared: Math.random() > 0.5,
          category: category._id,
          user: user._id,
        };
        if (taskType === 'Text') {
          taskData.content = taskData.title;
        }

        const createdTask = await taskModel.create(taskData);

        await categoryModel.findByIdAndUpdate(category._id, {
          $push: { tasks: createdTask._id }
        });
      }
    }
  }

  console.log('Seed data inserted successfully');
  mongoose.connection.close();
};

seedData().catch((error) => {
  console.error('Error inserting seed data:', error);
  mongoose.connection.close();
});
