import { useState } from "react";
import api from "../api/axios.js";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../ui/Buttons/ThemeButton.jsx";
import { useForm } from "react-hook-form";

function LoginPage() {
  const navigate = useNavigate();  //for navigation
  
  const {          //react hook form
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",   //validate only when form is submitted
  });

  const [showPassword, setShowPassword] = useState(false);  //for password hide/unhide

  /*variable to store errors*/
  //  const usernamePattern = /^[a-zA-Z0-9]+$/;           /*aplhanumeric username pattern */

  const handleBackButtonClick = () => {
    navigate("/");     //navigation to last page
  };

  const onSubmit = async (data) => {
    /*function to handle errors on submit */

    const start = performance.now(); //  Start time

    clearErrors();   //clear previous manual errors before API call

    /*Backend Validations to match correct username and password */
    //calling API from backend (later)
    try {
      const res = await api.post("/api/auth/login", {
        username: data.username,
        password: data.password,
      });

      
      console.log(res.data.token);

      const end = performance.now(); //  End time
      console.log(`Frontend Total Time: ${(end - start).toFixed(2)} ms`);

      navigate(res.data.redirectTo);
    } catch (err) {
      const statusCode = err.response?.status;
      console.log(err);

      if (statusCode === 404) {
        setError("username", {
          type: "manual",
          message: "Username does not exist",
        });
      } else if (statusCode === 401) {
        setError("password", {
          type: "manual",
          message: "Incorrect Password",
        });
      } else {
        setError("general", {
          type: "manual",
          message: err.response?.data?.message || "Login failed",
        });
      }
    }

    /*if all validations pass then: */
  };

  return (
    <div className="wrapperDiv bg-[var(--login-bg-color)] dark:bg-gray-900 flex justify-center items-center min-h-screen w-full m-0">
      <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
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

              <div className="loginThemeButton p-1 rounded-full cursor-pointer">
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
              {...register("username", {
                required: "Please Enter your Username.",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters.",
                },
              })}
            />

            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}

            <p className="passwordLabel font-semibold text-sm my-1 dark:text-gray-200">
              Password
            </p>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput border-none w-full rounded-lg p-2 bg-[#f5f5f4] dark:bg-gray-700 dark:text-white placeholder-gray-500 my-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: "Please Enter your Password.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                })}
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}

            {errors.general && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {errors.general.message}
              </p>
            )}

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
