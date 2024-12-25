import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import axios from "axios"; // Import axios for HTTP requests
import { useSelector } from "react-redux";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const submitHandler = async (data) => {
    try {
      const userId = user._id; // Replace with actual user ID from your state or context
      const formattedStartAt = new Date(data.startAt).toISOString();
      const formattedEndAt = new Date(data.endAt).toISOString();

      const payload = {
        ...data,
        userId,
        startAt: formattedStartAt,
        endAt: formattedEndAt,
        stage: stage.toLowerCase(), // Ensure stage is in lowercase for consistency
        priority: priority.toLowerCase(), // Ensure priority is in lowercase for consistency
        assets: Array.from(assets).map((file) => file.name), // Use the file names as asset names
      };

      // Make the API call to add a new task
      setUploading(true);
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/create`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Task added successfully!");
        window.location.reload();
        setOpen(false);
        // Optionally, reset the form or redirect the user
      } else {
        console.error("Unexpected response:", response);
        alert("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          ADD TASK
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder="Start At"
              type="datetime-local"
              name="startAt"
              label="Start At"
              className="w-full rounded"
              register={register("startAt", { required: "Start time is required!" })}
              error={errors.startAt ? errors.startAt.message : ""}
            />
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORIRY}
              selected={priority}
              setSelected={setPriority}
            />

            <Textbox
              placeholder="End At"
              type="datetime-local"
              name="endAt"
              label="End At"
              className="w-full rounded"
              register={register("endAt", { required: "End time is required!" })}
              error={errors.endAt ? errors.endAt.message : ""}
            />
          </div>

          <div className="w-full flex items-center justify-center mt-4">
            <label
              className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
              htmlFor="imgUpload"
            >
              <input
                type="file"
                className="hidden"
                id="imgUpload"
                onChange={(e) => handleSelect(e)}
                accept=".jpg, .png, .jpeg"
                multiple={true}
              />
              <BiImages />
              <span>Add Assets</span>
            </label>
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">Uploading assets</span>
            ) : (
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />
            )}

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
