import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const CreateSubjectComponent = () => {

  // State to show success message after component creation
  const [createdComponent, setCreatedComponent] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch values for marks validation
  const maxMarks = watch("max_marks");

  // Cancel Button Function
  const handleCancel = () => {
    reset();
    setCreatedComponent(null);
  };

  // Form Submit Function
  async function onSubmit(data) {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/subject-components", // Make sure route matches backend
        {
          subject_id: data.subject_id,
          component_name: data.component_name,
          type: data.type,
          max_marks: Number(data.max_marks),
          min_marks: Number(data.min_marks),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Component Created Successfully");

      setCreatedComponent(res.data.data);

      reset();

    } catch (error) {
      alert(error?.response?.data?.message || "Error Creating Component");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Create Subject Component"
      desc="Add exam components like Midterm, Assignment, Quiz etc for a subject"
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* SUBJECT ID */}
          <div className="form-field">
            <label className="custom-label">Subject ID</label>
            <input
              type="number"
              placeholder="Enter Subject ID"
              className="custom-input"
              {...register("subject_id", {
                required: "Subject ID is required",
              })}
            />
            {errors.subject_id && (
              <p className="custom-error">{errors.subject_id.message}</p>
            )}
          </div>

          {/* COMPONENT NAME */}
          <div className="form-field">
            <label className="custom-label">Component Name</label>
            <input
              type="text"
              placeholder="Enter Component Name (e.g. Midterm Exam)"
              className="custom-input"
              {...register("component_name", {
                required: "Component name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
                maxLength: {
                  value: 50,
                  message: "Maximum 50 characters allowed",
                },
              })}
            />
            {errors.component_name && (
              <p className="custom-error">{errors.component_name.message}</p>
            )}
          </div>

          {/* COMPONENT TYPE */}
          <div className="form-field">
            <label className="custom-label">Component Type</label>
            <select
              className="custom-input"
              {...register("type", {
                required: "Please select component type",
              })}
            >
              <option value="">Select Type</option>
              <option value="EXAM">EXAM</option>
              <option value="ASSIGNMENT">ASSIGNMENT</option>
              <option value="ATTENDANCE">ATTENDANCE</option>
            </select>
            {errors.type && (
              <p className="custom-error">{errors.type.message}</p>
            )}
          </div>

          {/* MAX MARKS */}
          <div className="form-field">
            <label className="custom-label">Maximum Marks</label>
            <input
              type="number"
              placeholder="Enter Maximum Marks"
              className="custom-input"
              {...register("max_marks", {
                required: "Maximum marks required",
                min: {
                  value: 1,
                  message: "Must be at least 1",
                },
              })}
            />
            {errors.max_marks && (
              <p className="custom-error">{errors.max_marks.message}</p>
            )}
          </div>

          {/* MIN MARKS */}
          <div className="form-field">
            <label className="custom-label">Minimum Marks</label>
            <input
              type="number"
              placeholder="Enter Minimum Marks"
              className="custom-input"
              {...register("min_marks", {
                required: "Minimum marks required",
                validate: (value) =>
                  Number(value) <= Number(maxMarks) ||
                  "Min marks cannot be greater than max marks",
              })}
            />
            {errors.min_marks && (
              <p className="custom-error">{errors.min_marks.message}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>

        </form>
      </DashboardChildPageCard>

      {/* SUCCESS DISPLAY CARD */}
      {createdComponent && (
        <DashboardChildPageCard className="mt-3">
          <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
            Component Created Successfully
          </h3>

          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p><span className="font-medium">Component Name:</span> {createdComponent.component_name}</p>
            <p><span className="font-medium">Type:</span> {createdComponent.type}</p>
            <p><span className="font-medium">Max Marks:</span> {createdComponent.max_marks}</p>
            <p><span className="font-medium">Min Marks:</span> {createdComponent.min_marks}</p>
            <p><span className="font-medium">Subject ID:</span> {createdComponent.subject_id}</p>
          </div>
        </DashboardChildPageCard>
      )}

    </DashboardChildPageTemplate>
  );
};

export default CreateSubjectComponent;