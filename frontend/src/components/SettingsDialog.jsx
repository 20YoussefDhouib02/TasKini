import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { MdSettings } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const SettingsDialog = ({ open, setOpen, onUpdate }) => {
  // Retrieve user data from Redux store
  const user = useSelector((state) => state.auth.user);
  

  // Form state management using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "", // Set initial value to user's current name
      title: user?.title || "", // Set initial value to user's current title
    },
  });

  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [accountStatus, setAccountStatus] = useState("active");

  // Handle form submission
  const handleSave = async (data) => {
    // Handle updating user information (name and title)
    const updatedUser = {
      ...data,
      notifications,
      theme,
      accountStatus,
    };

    alert(`Settings Saved:\n${JSON.stringify(updatedUser, null, 2)}`);

    // Call the callback function to update the parent component's state
    onUpdate(data);

    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="w-full max-w-md p-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border">
              <MdSettings className="text-gray-500 text-3xl" />
            </div>
          </div>

          <Dialog.Title
            as="h2"
            className="text-lg font-bold leading-6 text-gray-900 mb-6 text-center"
          >
            Settings
          </Dialog.Title>

          <div className="flex flex-col gap-6">
            {/* Display current name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800"
                {...register("name", { required: "Name is required" })}
                placeholder={user?.name || "Enter your name"}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Display current title */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800"
                {...register("title", { required: "Title is required" })}
                placeholder={user?.title || "Enter your title"}
              />
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title.message}</span>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">
                Notification Preferences
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="notifications"
                    value="enabled"
                    checked={notifications}
                    onChange={() => setNotifications(true)}
                  />
                  Enable
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="notifications"
                    value="disabled"
                    checked={!notifications}
                    onChange={() => setNotifications(false)}
                  />
                  Disable
                </label>
              </div>
            </div>

            {/* Theme Preferences */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Theme</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === "light"}
                    onChange={() => setTheme("light")}
                  />
                  Light
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === "dark"}
                    onChange={() => setTheme("dark")}
                  />
                  Dark
                </label>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">
                Account Status
              </label>
              <select
                className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800 mt-2"
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              className="bg-gray-300 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-400"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
            <Button
              type="submit"
              className="bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
              label="Save"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default SettingsDialog;
