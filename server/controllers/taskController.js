import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import mongoose from 'mongoose';

export const createTask = async (req, res) => {
  try {
    const { userId, title, startAt, endAt, priority, stage, assets } = req.body;

    // Validate the required fields
    if (!userId || !title || !startAt || !endAt) {
      return res.status(400).json({ status: false, message: "Missing required fields." });
    }

    // Create activity log text
    const text = `A new task titled "${title}" has been assigned to you with a ${priority} priority, starting at ${new Date(
      startAt
    ).toLocaleString()} and ending at ${new Date(endAt).toLocaleString()}.`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // Create the task
    const task = await Task.create({
      userId,
      title,
      startAt,
      endAt,
      priority: priority.toLowerCase(),
      stage: stage.toLowerCase(),
      activities: [activity],
      assets,
    });
    const notice = await Notice.create({
      UserId: [userId], // The user who will receive the notification
      text: text,
      task: task._id, // Link the task to the notification
      notiType: "alert", // You can set it to "message" if needed
      isRead: [],
    });

    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.body;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getstatsfordashboard= async (req, res) => {
  try {
    const { userId } = req.query; // Use query parameters

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: false, message: "Invalid User ID format." });
    }

    // Fetch tasks for the user
    const tasks = await Task.find({ userId: new mongoose.Types.ObjectId(userId) });

    // Aggregate statistics
    const stats = tasks.reduce(
      (acc, task) => {
        acc[task.stage] = (acc[task.stage] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { todo: 0, "in progress": 0, completed: 0, total: 0 }
    );

    // Return stats and tasks (if needed)
    res.status(200).json({
      status: true,
      stats,
      tasks,
      message: "Task statistics retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving task stats:", error);
    res.status(500).json({ status: false, message: "An error occurred while retrieving task stats." });
  }
};
export const getTasksAssignedByUserId = async (req, res) => {
  try {
    const { userId } = req.query; // Use query parameters

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: false, message: "Invalid User ID format." });
    }

    // Fetch tasks assigned by the user
    const tasks = await Task.find({ "activities.by": new mongoose.Types.ObjectId(userId) });

    // Check if tasks exist
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No tasks found assigned by the specified user.",
      });
    }

    // Return the tasks
    res.status(200).json({
      status: true,
      tasks,
      message: "Tasks assigned by the user retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving tasks assigned by user:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving tasks.",
    });
  }
};