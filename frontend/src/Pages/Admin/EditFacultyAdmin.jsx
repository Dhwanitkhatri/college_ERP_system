import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import CancelButton from "../../ui/Buttons/CancelButton";
import { useState, useEffect } from "react";
import SaveButton from "../../ui/Buttons/SaveButton";
import { useParams, useNavigate } from "react-router-dom"; //using this for getting id from url
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react"; //added for password toggle

const EditFacultyAdmin = () => {
  const [faculty, setFaculty] = useState(null); // for storing the faculty data which will come from api call
  const [showPassword, setShowPassword] = useState(false); //state for toggling password visibility
  const { facultyId } = useParams(); //this is state which knows which faculty to edit, it holds faculty id came from url
  const token = localStorage.getItem("token"); //get token from localstorage
  const navigate = useNavigate(); //for navigating back to managefaculty page
  const {
    register,
    handleSubmit,
    watch,
    reset, //use reset for changing the data of react hook form at render
    formState: { errors },
  } = useForm();

  //useEffect for getting selected edit faculty details
  useEffect(() => {
    //fetch the faculty details here (call api here)
    api
      .get(`api/faculties/${facultyId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFaculty(res.data);
        console.log("Fetched Faculty:", res.data);
      })
      .catch((err) => {
        console.log(
          "Error Fetching Faculty Detail: ",
          err.response?.data || err.message
        );
      });
  }, [facultyId, token]);

  //useEffect for changing the react hook form values
  useEffect(() => {
    if (faculty) {
      reset({
        fullName: faculty.name,
        phoneNo: faculty.phone,
        email: faculty.email,
        facultyId: faculty.faculty_id,
      });
    }
  }, [faculty, reset]);

  //save changes button logic (onsbumit logic here)
  const onSubmit = (data) => {
    api
      .put(
        `api/faculties/${facultyId}`,
        {
          name: data.fullName,
          phone: data.phoneNo,
          email: data.email,
          password: data.password, //added password field
        }
      )
      .then(() => {
        alert("FAculty updated succesfully");
        navigate("/admin/Dashboard/ManageFacultyAdmin");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Update failed");
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Faculty"
      desc="Update the Faculty Information"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Edit Name Div */}
          <div className="fullNameDiv form-field">
            <label className="fullNameLabel custom-label">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="fullNameInput custom-input"
              {...register("fullName", {
                required: "Please Fill This Field",
                minLength: {
                  value: 3,
                  message: "Minimum 3 Characters are Required",
                },
                maxLength: {
                  value: 50,
                  message: "Maximum Character Limit is 50",
                },
                pattern: {
                  value: /^[A-Za-z.\s]+$/,
                  message: "Only Alphabets are Allowed",
                },
              })}
            />
            {errors.fullName && (
              <p className="custom-error">{errors.fullName.message}</p>
            )}
          </div>

          {/* Edit Phone Div */}
          <div className="phoneNoDiv form-field">
            <label className="phoneNoLabel custom-label">Phone</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="phoneNoInput custom-input"
              {...register("phoneNo", {
                required: "Please Fill This Field",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please Enter Valid Phone Number",
                },
              })}
            />
            {errors.phoneNo && (
              <p className="custom-error">{errors.phoneNo.message}</p>
            )}
          </div>

          {/* Edit Email Div */}
          <div className="emailDiv form-field">
            <label className="emailLabel custom-label">Email address</label>
            <input
              type="text"
              placeholder="Enter Email address"
              className="emailInput custom-input"
              {...register("email", {
                required: "Please Fill This Field",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="custom-error">{errors.email.message}</p>
            )}
          </div>

          {/* Edit Password Div */}
          <div className="passwordDiv form-field">
            <label className="passwordLabel custom-label">Password</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="passwordInput custom-input"
                {...register("password", {
                  required: "Please Fill This Field",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 Characters are Required",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
                    message:
                      "Password must contain at least one uppercase, one lowercase and one special character",
                  },
                })}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {errors.password && (
              <p className="custom-error">{errors.password.message}</p>
            )}
          </div>

          {/*Faculty id Div */}
          <div className="facultyId form-field">
            <label className="facultyIdLabel custom-label">Faculty ID</label>
            <input
              type="text"
              disabled
              className="facultyIdInput custom-input cursor-not-allowed"
              {...register("facultyId")}
            />
          </div>

          <div className="form-actions">
            <SaveButton /> <CancelButton />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default EditFacultyAdmin;