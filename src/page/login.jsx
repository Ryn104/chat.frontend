import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify
import { ToastContainer } from "react-toastify";
import photos from "../assets/image.js";
import "./login.css";

const Log = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      if (data.token) {
        localStorage.setItem("authToken", data.token); // Save token to localStorage
      }

      navigate("/private"); // Navigate to the private page
    } catch (err) {
      // Simplify error message and display it using toastify
      const errorMessage =
        err.name === "TypeError"
          ? "Failed to connect to the server. Please check your network."
          : err.message || "An error occurred during login.";
      toast.error(errorMessage); // Display error message using toastify
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 xl:min-h-screen">
      <div className="xl:flex xl:justify-between xl:min-h-screen bg">
        <div className="card w-full xl:max-w-[42vw] backdrop-blur-md backdrop-brightness-100 shadow-xl rounded-none">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="grid place-content-center h-[100vh] xl:h-full">
              <div className="logo gap-5 mb-10">
                <div className="xl:w-[5vw] w-20">
                  <img src={photos.logo} alt="Company Logo" />
                </div>
                <h1 className="text-7xl mt-3 xl:text-[4vw] font-bold xl:font-bold text-gray-600">
                  SENT
                </h1>
              </div>
              <div className="xl:w-[50vw] xl:pl-[30vw]">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-800 font-semibold">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 text-gray-700"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control mb-10">
                  <label className="label">
                    <span className="label-text text-gray-800 font-semibold">
                      Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered xl:w-full xl:h-[4vh] bg-gray-200 text-gray-700"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label className="label">
                    <a
                      href="#"
                      className="label-text text-gray-800 alt link link-hover"
                    >
                      Forgot password?
                    </a>
                  </label>
                </div>
              </div>
              <div className="form-control mt-6">
                <button
                  className="mx-auto btn bg-gray-600 input-bordered w-[50%] xl:w-[15%]"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <span className="label-text text-gray-800 text-center my-5 text-base w-[80vw]">
                Don’t have an account yet?
                <a
                  href="#"
                  className="text-gray-800 alt link link-hover font-semibold text-base"
                  onClick={() => navigate("/register")}
                >
                  {" "}
                  Register now
                </a>
              </span>
            </div>
          </form>
        </div>
        <div className="text-center lg:text-left"></div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
    </div>
  );
};

export default Log;