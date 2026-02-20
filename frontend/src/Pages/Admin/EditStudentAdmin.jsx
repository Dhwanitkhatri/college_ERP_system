import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react"; //added for password toggle

const EditStudentAdmin = () => {
  const [student, setStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false); //state for toggling password visibility
  const { studentId } = useParams(); //this holds student id from url
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //useEffect for getting selected student details
  useEffect(() => {
    api
      .get(`api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudent(res.data);
        console.log("Fetched Student:", res.data);
      })
      .catch((err) => {
        console.log(
          "Error Fetching Student Detail:",
          err.response?.data || err.message
        );
      });
  }, [studentId, token]);

  //useEffect for updating form values
  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        dob: student.dob,
        gender: student.gender,
        email: student.email,
        admission_year: student.admission_year,
        year_of_study: student.year_of_study,
        student_id: student.student_id,
      });
    }
  }, [student, reset]);

  //save changes button logic
  const onSubmit = (data) => {
    api
      .put(
        `api/students/${studentId}`,
        {
          name: data.name,
          dob: data.dob,
          gender: data.gender,
          email: data.email,
          admission_year: data.admission_year,
          year_of_study: data.year_of_study,
          password: data.password, //added password field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Student updated successfully");
        navigate("/admin/Dashboard/ManageStudentAdmin");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Update failed");
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Student"
      desc="Update the Student Information"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name Div */}
          <div className="form-field">
            <label className="custom-label">Full Name</label>
            <input
              type="text"
              className="custom-input"
              {...register("name", { required: "Required" })}
            />
            {errors.name && (
              <p className="custom-error">{errors.name.message}</p>
            )}
          </div>

          {/* DOB Div */}
          <div className="form-field">
            <label className="custom-label">Date of Birth</label>
            <input
              type="date"
              className="custom-input"
              {...register("dob")}
            />
          </div>

          {/* Gender Div */}
          <div className="form-field">
            <label className="custom-label">Gender</label>
            <select className="custom-input" {...register("gender")}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email Div */}
          <div className="form-field">
            <label className="custom-label">Email</label>
            <input
              type="email"
              className="custom-input"
              {...register("email")}
            />
          </div>

          {/* Admission Year Div */}
          <div className="form-field">
            <label className="custom-label">Admission Year</label>
            <input
              type="number"
              className="custom-input"
              {...register("admission_year")}
            />
          </div>

          {/* Year Of Study Div */}
          <div className="form-field">
            <label className="custom-label">Year Of Study</label>
            <select className="custom-input" {...register("year_of_study")}>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="LY">LY</option>
            </select>
          </div>

          {/* Password Div */}
          <div className="form-field">
            <label className="custom-label">Password</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="custom-input"
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

          {/* Student ID Div */}
          <div className="form-field">
            <label className="custom-label">Enrollment No</label>
            <input
              type="text"
              disabled
              className="custom-input cursor-not-allowed"
              {...register("student_id")}
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

export default EditStudentAdmin;