import { useState } from "react";
import api from "../api/axios.js";

function LoginPage() {
    const [username, setUsername] = useState("");           /*variable for username*/
    const [password, setPassword] = useState("");           /*variable for password*/
    const [errors, setErrors] = useState({username:"", password:"", general:""});            /*variable to store errors*/
  //  const usernamePattern = /^[a-zA-Z0-9]+$/;           /*aplhanumeric username pattern */
           

    const handleSubmit = async(e) =>{                    /*function to handle errors on submit */
        e.preventDefault();             /*Will stop page from reloading on submit */
        
        const start = performance.now(); //  Start time
        let isValid = true;
        const newErrors = {username:"", password:"", general:""}

        /*=================Validations for Empty Fields============================= */
        if(username.trim()==="" && password.trim()===""){
            newErrors.general = "Please fill Username and Password.";
            isValid=false;
        }
        else if(username.trim()===""){
            newErrors.username = "Please Enter your Username.";
            isValid=false;
        }
        else if(password.trim()===""){
            newErrors.password = "Please Enter your Password.";
            isValid=false;
        }


        /*============if any validation fails from front-end side then it will return=====*/
        if(!isValid){
            setErrors(newErrors);
            return;
        }

        /*Backend Validations to match correct username and password */
        //calling API from backend (later)
        try{
            const res = await api.post("/api/auth/login",{username,password});
            console.log("response ",res.data);
            
            const end = performance.now(); //  End time
            console.log(`Frontend Total Time: ${(end - start).toFixed(2)} ms`);

            console.log("Response:", res.data);
        }
        catch(err){
            const statusCode = err.response?.status;
            console.log(err);
            const newErrors = { username: "", password: "", general: "" };
            if(statusCode===404){
                newErrors.username = "Username does not exist";
            }
            else if(statusCode===401){
                newErrors.password = "Incorrect Password";
            }
            else {
                newErrors.general = err.response?.data?.message || "Login failed";
            }
            isValid=false;
            setErrors(newErrors);
        }
        

        /*if all validations pass then: */
        
        if(isValid){
            setErrors({username: "", password: "", general: ""})
            alert("Login Succesful!");
        }
    };

    return (
        <form id="loginForm" onSubmit={handleSubmit}>
            {/*Main login container */}
            <div className="loginContainer w-full bg-white border-gray-200 p-5 rounded-xl shadow-lg justify-center items-center justify-items-center">
                {/* login header*/}
                <div className="loginHeader justify-center items-center justify-items-center w-full m-2 mt-1">
                    <p className="loginTitle p-1">College ERP Login</p>
                    <p className="loginInstruction text-gray-500 p-1">
                        Enter your credentials to access the system
                    </p>
                </div>
                {/* login details container */}
                <div className="loginDetails justify-start items-center w-full m-2">
                    <p className="usernameLabel font-semibold text-sm my-1">Username</p>
                    <input
                        type="text"
                        className="usernameInput border-none w-full rounded-lg p-2 bg-[#f5f5f4] placeholder-gray-500 my-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter Your Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}  {/* only runs under condition */}

                    <p className="passwordLabel font-semibold text-sm my-1">Password</p>
                    <input
                        type="password"
                        className="passwordInput border-none w-full rounded-lg p-2 bg-[#f5f5f4] placeholder-gray-500 my-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>} {/* only runs under condition */}

                    {errors.general && <p className="text-red-500 text-sm mt-3 text-center">{errors.general}</p>} {/* only runs under condition */}
                    <button
                        type="submit"
                        className="signInButton bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold w-full rounded-lg p-2 mt-6"
                    >
                        Sign In
                    </button>
                </div>
                {/* forgot password conatiner */}
                <div className="bottomDiv p-3">
                    <a href="#" className="usernameLabel font-semibold text-sm my-1 text-blue-600 hover:text-blue-700" onClick={() => alert("Redirecting to password recovery page...")}>
                        Forgot your Password?
                    </a>
                </div>
            </div>
        </form>
    );
}

export default LoginPage;