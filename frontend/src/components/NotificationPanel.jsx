import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState, useEffect } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const userId = user._id; // Example user ID

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/user/notifications`,
          {
            params: { userId }, // Send the user ID as a query parameter
            withCredentials: true,
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const readHandler = () => {
    // Implement logic for marking all notifications as read if needed
  };

  const viewHandler = (notification) => {
    // Implement logic to view the details of a notification
    console.log("Notification clicked:", notification);
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: readHandler,
    },
  ];

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {notifications.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              notifications.length > 0 && (
                <div
                  style={{
                    maxHeight: "30rem", // Limit the height to make it scrollable
                    overflowY: "auto",
                    scrollbarWidth: "thin", // For Firefox
                    scrollbarColor: "#4b5563 #e5e7eb", // For Firefox
                  }}
                  className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5"
                >
                  <style>
                    {`
                      /* Inline styles for WebKit-based browsers */
                      div::-webkit-scrollbar {
                        width: 8px;
                      }
                      div::-webkit-scrollbar-thumb {
                        background-color: #4b5563; /* Thumb color */
                        border-radius: 10px;
                      }
                      div::-webkit-scrollbar-track {
                        background-color: #e5e7eb; /* Track color */
                      }
                    `}
                  </style>
                  <div className="p-4">
                    {notifications.map((item, index) => (
                      <div
                        key={item._id + index}
                        className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
                          <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                            <p> {item.notiType}</p>
                            <span className="text-xs font-normal lowercase">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-gray-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;
