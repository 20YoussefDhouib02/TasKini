import React from "react";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { FaUserAlt } from "react-icons/fa";

const ProfileDialog = ({ open, setOpen, user }) => {
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border">
              <FaUserAlt className="text-gray-500 text-2xl" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800">
              {user?.name || "Not Provided"}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800">
              {user?.email || "Not Provided"}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800">
              {user?.role || "Not Provided"}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <div className="px-4 py-2 border rounded-md bg-gray-100 text-gray-800">
              {user?.title || "Not Provided"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => setOpen(false)}
            label="Close"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProfileDialog;
