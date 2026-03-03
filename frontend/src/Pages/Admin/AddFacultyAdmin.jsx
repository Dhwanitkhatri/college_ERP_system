import React from "react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import api from "../../api/axios.js";

const AddFacultyAdmin = () => {
  const [addedFaculty, setAddedFaculty] = useState(null);
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

  async function onSubmit(data) {
    try {
     
      const res = await api.post(
        "/api/faculties",
        {
          name: data.fullName,
          phone: data.phoneNo,
          email: data.email,
        }
      );

      console.log(res.data);
      setAddedFaculty({
        name: data.fullName,
        phone: data.phoneNo,
        email: data.email,
        faculty_id: res.data.faculty.faculty_id,
      });
      alert("Faculty Added Successfully");
    } catch (error) {
      console.log(res.data);
      alert("Error Adding Faculty");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Add New Faculty"
      desc="Enter faculty member details to add them to the system"
    >
      <DashboardChildPageCard>
        <form
          action=""
          className="addFaculty"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <div className="form-actions">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
      {addedFaculty && (
        <DashboardChildPageCard className="mt-3">
          
            <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
              Faculty Added Successfully
            </h3>

            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
              <p>
                <span className="font-medium">Name:</span> {addedFaculty.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {addedFaculty.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span> {addedFaculty.email}
              </p>
              <p>
                <span className="font-medium">Faculty ID:</span> {addedFaculty.faculty_id}
              </p>
            </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default AddFacultyAdmin;
