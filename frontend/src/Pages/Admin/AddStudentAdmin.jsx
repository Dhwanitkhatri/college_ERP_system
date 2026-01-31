import React from "react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios.js";
import { useState } from "react";

const AddStudentAdmin = () => {
  const [addedStudent, setAddedStudent] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const handleCancel = () => {
    reset();
  };

  const today = new Date();
  const maxDOB = new Date(
    today.getFullYear() - 17,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  async function onSubmit(data) {
    alert("done");
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/api/students/",
        {
          name: data.fullName,
          //phone: data.phoneNo,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          admission_year: data.admissionYear,
          year_of_study: data.yearOfStudying,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setAddedStudent({
        name: data.fullName,
        phone: data.phoneNo,
        email: data.email,
        dob: data.dob,
        gender: data.gender,
        admission_year: data.admissionYear,
        year_of_study: data.yearOfStudying,
        student_id: res.data.student.student_id,
      });
      console.log(res.data.student);
      alert("Student Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Adding Student");
    }
  }

  return (
    <DashboardChildPageTemplate 
      title="Add New Student"
      desc="Enter student details to add them to the system"
    >
      <DashboardChildPageCard>
        <form className="addStudent" onSubmit={handleSubmit(onSubmit)}>
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
                  value: /^[A-Za-z ]+$/,
                  message: "Only Alphabets are Allowed",
                },
              })}
            />
            {errors.fullName && (
              <p className="custom-error">{errors.fullName.message}</p>
            )}
          </div>
          <div className="genderDiv form-field">
            <label className="genderLabel custom-label">Gender</label>
            <select
              className="genderInput custom-input"
              {...register("gender", {
                required: "Please Fill This Field",
              })}
            >
              <option value="" hidden>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && (
              <p className="custom-error">{errors.gender.message}</p>
            )}
          </div>
          <div className="phoneNoDiv form-field">
            <label className="phoneNoLabel custom-label">Phone</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="phoneNoInput custom-input"
              {...register("phoneNo", {
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
          <div className="dobDiv form-field">
            <label className="dobLabel custom-label">Date of Birth</label>
            <input
              type="date"
              placeholder="Enter Date of Birth"
              max={maxDOB}
              className="dobInput custom-input"
              {...register("dob", {
                required: "Please Fill This Field",
              })}
            />
            {errors.dob && <p className="custom-error">{errors.dob.message}</p>}
          </div>
          <div className="admissionYearDiv form-field">
            <label className="admissionYearLabel custom-label">
              Year of Admission
            </label>
            <input
              type="number"
              className="admissionYearInput custom-input"
              defaultValue={new Date().getFullYear()}
              readOnly // prevents editing
              {...register("admissionYear", {
                required: "Please Fill This Field",
              })}
            />
            {errors.admissionYear && (
              <p className="custom-error">{errors.admissionYear.message}</p>
            )}
          </div>
          <div className="yearOfStudyingDiv form-field">
            <label className="yearOfStudyingLabel custom-label">
              Year of Studying
            </label>
            <select
              className="yearOfStudyingInput custom-input"
              {...register("yearOfStudying", {
                required: "Please Fill This Field",
              })}
            >
              <option value="" hidden>
                Select Year of Studying
              </option>
              <option value="FY">First Year</option>
              <option value="SY">Second Year</option>
              <option value="TY">Third Year</option>
              <option value="LY">Last Year</option>
            </select>
            {errors.gender && (
              <p className="custom-error">{errors.gender.message}</p>
            )}
          </div>
          <div className="form-actions">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
      {addedStudent && (
        <DashboardChildPageCard className="mt-3">
          
            <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
              Student Added Successfully
            </h3>

            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
              <p>
                <span className="font-medium">Name:</span> {addedStudent.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {addedStudent.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span> {addedStudent.email}
              </p>
              <p>
                <span className="font-medium">Student ID:</span> {addedStudent.student_id}
              </p>
              <p>
                <span className="font-medium">Date of Birth:</span> {addedStudent.dob}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {addedStudent.gender}
              </p>
              <p>
                <span className="font-medium">Admission Year:</span> {addedStudent.admission_year}
              </p>
              <p>
                <span className="font-medium">Year of Studying:</span> {addedStudent.year_of_study}
              </p>
            </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default AddStudentAdmin;
