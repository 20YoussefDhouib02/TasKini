import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import UpdateTask from "./UpdateTask"; // Import the UpdateTask component
import AddSubTask from "./AddSubTask";
import ConfirmatioDialog from "../Dialogs";

const TaskDialog = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/delete`, {
        id: task._id,
        actionType: "delete",
      });
      if (response.status === 200) {
        alert('Task deleted successfully');
        window.location.reload();
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to delete task. Please try again.');
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert('Failed to delete task');
    }
  };

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const duplicateHandler = async () => {
    try {
      const payload = {
        id: task._id, // Pass only the task ID to the backend
      };

      // Send a PUT request to the backend for duplicating the task
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/duplicate`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert('Task duplicated successfully!');
        window.location.reload(); // Optionally refresh the page to reflect changes
      } else {
        console.error("Unexpected response:", response);
        alert('Failed to duplicate task. Please try again.');
      }
    } catch (error) {
      console.error("Error duplicating task:", error.message);
      alert('Failed to duplicate task');
    }
  };

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpen(true),
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: duplicateHandler,
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={deleteClicks}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line
                        className="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Edit Task Modal */}
      <UpdateTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task} // Pass the current task data for editing
        key={new Date().getTime()} // Ensures re-mounting for updates
      />

      {/* Add Sub-Task Modal */}
      <AddSubTask open={open} setOpen={setOpen} />

      {/* Confirmation Dialog for deletion */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
