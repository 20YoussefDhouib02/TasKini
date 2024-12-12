import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import axios from "axios";
import "./loader.css";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  // Submit handler for registration
  const submitHandler = async ({ name, email, password, role, title }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8800/api/user/register", // Replace with your backend registration endpoint
        { name, email, password, role, title }
      );

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/log-in");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    
   
    <div className="w-full min-h-screen flex items-center justify-center bg-[#3c4556]">
       
       <div className="w-full md:w-auto flex gap-10 md:gap-40 flex-col md:flex-row items-center justify-center">

        {/* Loader Section */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
        
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col   gap-5 md:gap-y-10 2xl:-mt-20">
            <p className="text-4xl md:text-6xl 2xl:text-7xl font-black text-left text-[#f8f8f8]">
              <span>Join Us Now</span>
            </p>
        
        <div className="container flex-1">
          
          <div className="item">
            <i className="loader --2"></i>
          </div>
          <div className="item">
            <i className="loader --9"></i>
          </div>
          <div className="item">
            <i className="loader --3"></i>
          </div>
          <div className="item">
            <i className="loader --4"></i>
          </div>
          <div className="item">
            <i className="loader --1"></i>
          </div>
          <div className="item">
            <i className="loader --5"></i>
          </div>
          <div className="item">
            <i className="loader --6"></i>
          </div>
          <div className="item">
            <i className="loader --8"></i>
          </div>
          <div className="item">
            <i className="loader --7"></i>
          </div>
        </div>
       </div>
       </div>
        {/* Registration Form Section */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                <form
            onSubmit={handleSubmit(submitHandler)} // Ensure handleSubmit wraps the submitHandler
             className="form-container w-full md:w-[400px] flex flex-col gap-y-5 bg-white px-10 pt-10 pb-10"
          >
          <div>
            <p className="text-[#3c4556] text-3xl font-bold text-center">
              Create an Account
            </p>
            <p className="text-center text-base text-gray-700">
              Join us and start managing your tasks!
            </p>
          </div>

         
            <Textbox
              placeholder="Your name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded-full"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />

            <Textbox
              placeholder="email@example.com"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded-full"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Your password"
              type="password"
              name="password"
              label="Password"
              className="w-full rounded-full"
              register={register("password", {
                required: "Password is required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long.",
                },
              })}
              error={errors.password ? errors.password.message : ""}
            />

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-gray-600 text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-[#3c4556]"
                {...register("role", { required: "Role is required!" })}
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Title Selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-gray-600 text-sm font-medium">
                Title
              </label>
              <select
                id="title"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-[#3c4556]"
                {...register("title", { required: "Title is required!" })}
              >
                <option value="">Select a title</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="designer">Designer</option>
                <option value="other">Other</option>
              </select>
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <Button
              type="submit"
              label={loading ? "Registering..." : "Register"}
              className="w-full h-10 bg-[#3c4556] text-white rounded-full"
              disabled={loading} // Disable button while loading
            />
            <div className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/log-in")}
              className="text-[#3c4556] hover:underline cursor-pointer bold"
            >
              Log in
            </span>
          </div>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Register;
