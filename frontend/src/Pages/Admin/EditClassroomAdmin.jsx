import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../api/axios";

const ManageClassroomAdmin = () => {
  const { id } = useParams();
const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  /* function to handle form submit */
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Classroom"
      desc="Add, edit, or remove classrooms and assign mentors to classes"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        {/* form wrapper */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* div for class id */}
          <div className="form-field">
            <label className="custom-label">Class ID</label>
            <input
              type="text"
              className="custom-input"
              {...register("classId", {
                required: "Class ID is required",
              })}
            />
            {errors.classId && (
              <p className="custom-error">{errors.classId.message}</p>
            )}
          </div>

          {/* div for class mentor */}
          <div className="form-field">
            <label className="custom-label">Class Mentor</label>
            <input
              type="text"
              className="custom-input"
              {...register("mentor", {
                required: "Class Mentor is required",
              })}
            />
            {errors.mentor && (
              <p className="custom-error">{errors.mentor.message}</p>
            )}
          </div>
              {/* div for academic year */}
          <div className="form-field">
            <label className="custom-label">academic year</label>
            <input
              type="text"
                className="custom-input"
                {...register("academicYear", {
                    required: "Academic Year is required",
                })}
            />
            {errors.academicYear && (
              <p className="custom-error">{errors.academicYear.message}</p>
            )}
          </div>

          {/* action buttons */}
          <div className="form-actions">
            <CancelButton />
            <SaveButton />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ManageClassroomAdmin;
