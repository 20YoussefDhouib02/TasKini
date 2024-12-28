import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loader";
import { useSelector } from "react-redux";

const checkAuth = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/user/check-auth`, {
      withCredentials: true,
    });
    return response.data.status === true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigate("/log-in");
      }
    };

    const fetchTasks = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/task/agenda`, {
            params: { userId: user._id },
            withCredentials: true,
          });
          setTasks(response.data.tasks?.filter(task => task.isTrashed === true) || []);
        } catch (error) {
          console.error("Error fetching trashed tasks:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyAuth();
    fetchTasks();
  }, [navigate, user?._id]);

  const deleteHandler = async () => {
    try {
      console.log(user._id)
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/delete`, {
        id: selected,
        userId: user._id,
        actionType: "delete",
      });
      if (response.status === 200) {
        alert('Task deleted successfully');
        setTasks(tasks.filter(task => task._id !== selected)); // Update UI after deletion
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to delete task. Please try again.');
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert('Failed to delete task');
    }
  };

  const restoreHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/delete`, {
        id: selected,
        userId: user._id,
        actionType: "restore",
      });
      if (response.status === 200) {
        alert('Task restored successfully');
        setTasks(tasks.filter(task => task._id !== selected)); // Update UI after restoration
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to restore task. Please try again.');
      }
    } catch (error) {
      console.error("Error restoring task:", error.message);
      alert('Failed to restore task');
    }
  };

  const deleteAllHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/delete`, {
        id: selected,
        userId: user._id,
        actionType: "deleteAll",
      });
      if (response.status === 200) {
        alert('All tasks deleted successfully');
        window.location.reload();
        setTasks([]); // Clear the tasks UI
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to delete all tasks. Please try again.');
      }
    } catch (error) {
      console.error("Error deleting all tasks:", error.message);
      alert('Failed to delete all tasks');
    }
  };

  const restoreAllHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/delete`, {
        userId: user._id,
        actionType: "restoreAll",
      });
  
      if (response.status === 200) {
        alert('All tasks restored successfully');
        setTasks(tasks.filter(task => !task.isTrashed)); // Remove trashed tasks from the current list
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to restore all tasks. Please try again.');
      }
    } catch (error) {
      console.error("Error restoring all tasks:", error.message);
      alert('Failed to restore all tasks');
    }
  };
  

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this item?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore this item?");
    setOpenDialog(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Modified On</th>
        <th className="py-2 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])} />
          <p className="w-full line-clamp-2 text-base text-black">{item?.title}</p>
        </div>
      </td>
      <td className="py-2 capitalize">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>
      <td className="py-2 capitalize text-center md:text-start">{item?.stage}</td>
      <td className="py-2 text-sm">{new Date(item?.updatedAt).toDateString()}</td>
      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />
          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              label="Restore All"
              icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={() => restoreAllClick()}
            />
            <Button
              label="Delete All"
              icon={<MdDelete className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={() => deleteAllClick()}
            />
          </div>
        </div>
        <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {tasks?.map((tk, id) => (
                  <TableRow key={id} item={tk} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={type === "delete" ? deleteHandler : type === "restore" ? restoreHandler : type === "deleteAll" ? deleteAllHandler : restoreAllHandler}
      />
    </>
  );
};

export default Trash;
