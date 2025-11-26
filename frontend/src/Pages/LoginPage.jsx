import { useState } from "react";
import api from "../api/axios.js";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import ThemeButton from "../ui/ThemeButton.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); /*variable for username*/
  const [password, setPassword] = useState(""); /*variable for password*/
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  /*variable to store errors*/
  //  const usernamePattern = /^[a-zA-Z0-9]+$/;           /*aplhanumeric username pattern */
  const handleBackButtonClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    /*function to handle errors on submit */
    e.preventDefault(); /*Will stop page from reloading on submit */

    const start = performance.now(); //  Start time
    let isValid = true;
    const newErrors = { username: "", password: "", general: "" };

    /*=================Validations for Empty Fields============================= */
    if (username.trim() === "" && password.trim() === "") {
      newErrors.general = "Please fill Username and Password.";
      isValid = false;
    } else if (username.trim() === "") {
      newErrors.username = "Please Enter your Username.";
      isValid = false;
    } else if (password.trim() === "") {
      newErrors.password = "Please Enter your Password.";
      isValid = false;
    }

    /*============if any validation fails from front-end side then it will return=====*/
    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    /*Backend Validations to match correct username and password */
    //calling API from backend (later)
    try {
      const res = await api.post("/api/auth/login", { username, password });
      console.log("response ", res.data);

      const end = performance.now(); //  End time
      console.log(`Frontend Total Time: ${(end - start).toFixed(2)} ms`);

      console.log("Response:", res.data);
      console.log("res.data.redirectTo");
      navigate(res.data.redirectTo);
    } catch (err) {
      const statusCode = err.response?.status;
      console.log(err);
      const newErrors = { username: "", password: "", general: "" };
      if (statusCode === 404) {
        newErrors.username = "Username does not exist";
      } else if (statusCode === 401) {
        newErrors.password = "Incorrect Password";
      } else {
        newErrors.general = err.response?.data?.message || "Login failed";
      }
      isValid = false;
      setErrors(newErrors);
    }

    /*if all validations pass then: */

    if (isValid) {
      setErrors({ username: "", password: "", general: "" });
    }
  };

  return (
    <div className="wrapperDiv bg-[var(--login-bg-color)] dark:bg-gray-900 flex justify-center items-center min-h-screen w-full m-0">
      <form id="loginForm" onSubmit={handleSubmit}>
        {/*Main login container */}
        <div className="loginContainer w-full bg-white dark:bg-gray-800 dark:text-white border-gray-200 p-5 rounded-xl shadow-lg justify-center items-center justify-items-center">
          {/* login header*/}
          <div className="loginHeader justify-center items-center justify-items-center w-full m-2 mt-1">
            <div className="loginTitleHeader flex w-full justify-between items-center">
              <div
                onClick={handleBackButtonClick}
                className="loginBackButton p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
              </div>

              <p className="loginTitle dark:text-white">College ERP Login</p>

              <div className="loginThemeButton p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <ThemeButton />
              </div>
            </div>

            <p className="loginInstruction text-gray-500 dark:text-gray-300 p-1">
              Enter your credentials to access the system
            </p>
          </div>

          {/* login details container */}
          <div className="loginDetails justify-start items-center w-full m-2">
            <p className="usernameLabel font-semibold text-sm my-1 dark:text-gray-200">
              Username
            </p>
            <input
              type="text"
              className="usernameInput border-none w-full rounded-lg p-2 bg-[#f5f5f4] dark:bg-gray-700 dark:text-white placeholder-gray-500 my-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}{" "}
            <p className="passwordLabel font-semibold text-sm my-1 dark:text-gray-200">
              Password
            </p>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput border-none w-full rounded-lg p-2 bg-[#f5f5f4] dark:bg-gray-700 dark:text-white placeholder-gray-500 my-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}{" "}
            {errors.general && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {errors.general}
              </p>
            )}{" "}
            <button
              type="submit"
              className="signInButton bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold w-full rounded-lg p-2 mt-6"
            >
              Sign In
            </button>
          </div>

          {/* forgot password conatiner */}
          <div className="bottomDiv p-3">
            <a
              href="#"
              className="usernameLabel font-semibold text-sm my-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => alert("Redirecting to password recovery page...")}
            >
              Forgot your Password?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
