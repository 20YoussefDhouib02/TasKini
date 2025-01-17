import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { setCredentials } from "../redux/slices/authSlice"; // Import your Redux action

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  // Submit handler for login
  const submitHandler = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/login`, // Replace with your actual backend URL
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        
        const userInfo = response.data;

        
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        
        dispatch(setCredentials(userInfo));

        
        navigate("/dashboard");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to register page
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#3c4556]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left Side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-[#ffffff]">
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-[#ffffff]">
              <span>TasKini</span>
              <span>Plan, Track, Achieve</span>
            </p>
            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)} // Ensure handleSubmit wraps the submitHandler
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div>
              <p className="text-gray-700 text-3xl font-bold text-center">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700">
                Don't forget to keep your credentials safe.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
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
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <div className="text-sm text-center text-gray-500 mt-4">
                Don't have an account?{" "}
                <span
                  onClick={handleRegisterClick}
                  className="text-[#3c4556] hover:underline cursor-pointer bold">
                  Register
                </span>
              </div>

              <Button
                type="submit"
                label={loading ? "Loading..." : "Submit"}
                className="w-full h-10 bg-[#3c4556] text-white rounded-full"
                disabled={loading} // Disable button while loading
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
