import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import { useForm } from "react-hook-form";
import Button from "./Button";
import axios from "axios"; // Import axios
import { useSelector } from "react-redux"; // To get user information

const ChangePasswordDialog = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth); // Assuming user info is stored in Redux

  const submitHandler = async (data) => {
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/change-password`,
        {
          userId: user._id, // Use logged-in user's ID
          password: data.currentPassword,
          newPassword: data.newPassword,
        },
        { withCredentials: true } // Include cookies for authentication if required
      );

      if (response.data.status) {
        setOpen(false);
        alert(response.data.message || "Password changed successfully!");
      } else {
        alert(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          Change Password
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Enter Current Password"
            type="password"
            name="currentPassword"
            label="Current Password"
            className="w-full rounded"
            register={register("currentPassword", {
              required: "Current password is required",
            })}
            error={errors.currentPassword ? errors.currentPassword.message : ""}
          />

          <Textbox
            placeholder="Enter New Password"
            type="password"
            name="newPassword"
            label="New Password"
            className="w-full rounded"
            register={register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            error={errors.newPassword ? errors.newPassword.message : ""}
          />

          <Textbox
            placeholder="Confirm New Password"
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            className="w-full rounded"
            register={register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />

<div className="bg-gray-50 py-6 flex justify-center gap-4">
  {loading ? (
    <span className="text-sm py-2 text-red-500">Updating password...</span>
  ) : (
    <Button
      label="Submit"
      type="submit"
      className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700"
    />
  )}

  <Button
    type="button"
    className="bg-white px-5 text-sm font-semibold text-gray-900"
    onClick={() => setOpen(false)}
    label="Cancel"
  />
</div>

        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePasswordDialog;
