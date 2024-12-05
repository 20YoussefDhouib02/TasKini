import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded">
        {/* Priority and Task Dialog */}
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          {user && <TaskDialog task={task} />}
        </div>

        {/* Task Details */}
        <div className="flex items-center gap-2 mt-2">
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
          <h4 className="line-clamp-1 text-black">{task?.title}</h4>
        </div>
        <span className="text-sm text-gray-600">
          From {formatDate(new Date(task?.startAt))}
        </span>{" "}
        <br />
        <span className="text-sm text-gray-600">
          To {formatDate(new Date(task?.endAt))}
        </span>

        {/* Divider */}
        <div className="w-full border-t border-gray-200 my-2" />

        {/* Task Metadata */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 ">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 ">
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>
          <div className="flex flex-row-reverse">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* Render All Subtasks */}
        {task?.subTasks?.length > 0 ? (
  <div className="py-4 border-t border-gray-200">
    <h5 className="text-base font-medium mb-2">Subtasks</h5>
    <div className="space-y-4">
      {task?.subTasks?.map((subTask, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded shadow-sm">
          <div className="mt-2">
            <h4 className="line-clamp-1 text-black">{subTask?.title}</h4>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Due {formatDate(new Date(subTask?.endAt))}
            </span>
            {subTask?.tag && (
              <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                {subTask?.tag}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="py-4 border-t border-gray-200">
    <span className="text-gray-500">No Subtasks</span>
  </div>
)}


        {/* Add Subtask Button */}
        <div className="w-full pb-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoMdAdd className="text-lg" />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      {/* Add Subtask Modal */}
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
