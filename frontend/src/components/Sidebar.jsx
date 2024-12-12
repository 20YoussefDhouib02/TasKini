import React, { useState } from "react";
import { MdDashboard, MdSettings, MdOutlinePendingActions, MdTaskAlt } from "react-icons/md";
import { FaTasks, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import SettingsDialog from "./SettingsDialog";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in-progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const NavLink = ({ el }) => (
    <Link
      to={el.link}
      className={clsx(
        "w-full flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
        path === el.link.split("/")[0] ? "bg-blue-700 text-neutral-100" : ""
      )}
    >
      {el.icon}
      <span className="hover:text-[#2564ed]">{el.label}</span>
    </Link>
  );

  return (
    <>
      <div className="w-full h-full flex flex-col gap-6 p-5">
        <h1 className="flex gap-1 items-center">
          <p className="bg-grey-600 p-2 rounded-full">
            <FaCalendarAlt />
          </p>
          <span className="text-2xl font-bold text-black">TasKini</span>
        </h1>

        <div className="flex-1 flex flex-col gap-y-5 py-8">
          {linkData.map((link) => (
            <NavLink el={link} key={link.label} />
          ))}
        </div>

        <div>
          <button
            className="w-full flex gap-2 p-2 items-center text-lg text-gray-800"
            onClick={() => setIsSettingsOpen(true)}
          >
            <MdSettings />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <SettingsDialog open={isSettingsOpen} setOpen={setIsSettingsOpen} />
    </>
  );
};

export default Sidebar;
