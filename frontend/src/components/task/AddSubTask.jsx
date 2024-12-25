import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import Button from "../Button";
import axios from "axios";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleOnSubmit = async (data) => {
    try {
      const formattedStartAt = new Date(data.startAt).toISOString();
      const formattedEndAt = new Date(data.endAt).toISOString();

      const payload = {
        id,
        title: data.title,
        tag: data.tag,
        startAt: formattedStartAt,
        endAt: formattedEndAt,
      };

      // Make the API request to add a subtask
      setUploading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/task/create-subtask`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage({ text: response.data.message, type: "success" });
      setTimeout(() => setOpen(false), 1000); // Close modal after success
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to add subtask",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4"
      >
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4 text-center"
        >
          ADD SUB-TASK
        </Dialog.Title>

        <div className="flex flex-col gap-4 w-full">
          <Textbox
            placeholder="Sub-Task title"
            type="text"
            name="title"
            label="Title"
            className="w-full"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder="Tag"
            type="text"
            name="tag"
            label="Tag"
            className="w-full"
            register={register("tag", {
              required: "Tag is required!",
            })}
            error={errors.tag ? errors.tag.message : ""}
          />

          
            <Textbox
              placeholder="Start At"
              type="datetime-local"
              name="startAt"
              label="Start At"
              className="w-full"
              register={register("startAt", {
                required: "Start time is required!",
              })}
              error={errors.startAt ? errors.startAt.message : ""}
            />

            <Textbox
              placeholder="End At"
              type="datetime-local"
              name="endAt"
              label="End At"
              className="w-full"
              register={register("endAt", {
                required: "End time is required!",
              })}
              error={errors.endAt ? errors.endAt.message : ""}
            />
          
        </div>

        {/* Feedback Message */}
        {message.text && (
          <div
            className={`mt-4 text-sm font-semibold text-center ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="py-3 mt-4 flex flex-col sm:flex-row-reverse gap-4 w-full">
          {uploading ? (
            <span className="text-sm py-2 text-red-500 text-center w-full">
              Adding subtask...
            </span>
          ) : (
            <Button
              type="submit"
              className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 w-full sm:w-auto"
              label="Add Subtask"
            />
          )}

          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 w-full sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
