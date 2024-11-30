import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";

// Check if the user is authenticated
const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/user/check-auth", {
      withCredentials: true,
    });
    return response.data.status === true;
  } catch (error) {
    console.error("Error checking auth:", error);
    return false;
  }
};

// Task types with background color classes
const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

// Tabs configuration
const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

// Function to fetch tasks for a user
const fetchTasksForUser = async (userId) => {
  try {
    const response = await axios.get(
      "http://localhost:8800/api/task/agenda",
      {
        params: { userId },
        withCredentials: true,
      }
    );
    return response.data.tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

const Tasks = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const status = params?.status || "";

  useEffect(() => {
    const checkUserAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigate("/log-in");
      }
    };

    const fetchTasks = async () => {
      if (user?._id) {
        setLoading(true);
        const fetchedTasks = await fetchTasksForUser(user._id);
        setTasks(fetchedTasks);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkUserAuth();
    fetchTasks();
  }, [navigate, user?._id]);

  // Filter tasks based on status
  const filteredTasks = tasks.filter((task) => {
    if(task.isTrashed==false){
    if (!status) return true; // Return all tasks if no status is specified
    if (status === "todo") return task.stage === "todo";
    if (status === "in-progress") return task.stage === "in progress";
    if (status === "completed") return task.stage === "completed";}
    return false; // Return no tasks if the status doesn't match any condition
  });

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className="w-full">
            <Table tasks={filteredTasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
