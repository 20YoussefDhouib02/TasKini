import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  getstatsfordashboard,
  getTasksAssignedByUserId,
} from "../controllers/taskController.js";
import chatbot from "../controllers/geminiController.js"
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

router.post("/create", createTask);
router.post("/duplicate", duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);
router.post("/prompt-post",chatbot);

router.get("/dashstats",getstatsfordashboard);
router.get("/agenda",getTasksAssignedByUserId)
router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/getTask",  getTask);


router.put("/create-subtask",  createSubTask);
router.put("/update",  updateTask);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

router.post(
  "/delete",
  deleteRestoreTask
);

export default router;
