import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const EnterExamMarksFaculty = () => {

  // Store success data
  const [enteredMarks, setEnteredMarks] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch component type manually (optional logic improvement later)
  const handleCancel = () => {
    reset();
    setEnteredMarks(null);
  };

  // =============================
  // SUBMIT HANDLER
  // =============================
  async function onSubmit(data) {
    try {
      

      const res = await api.post(
        "/api/enter-marks",
        {
          student_id: Number(data.student_id),
          subject_id: Number(data.subject_id),
          component_id: Number(data.component_id),
          exam_id: data.exam_id ? Number(data.exam_id) : null,
          marks_obtained: Number(data.marks_obtained),
        }
      );

      alert(res.data.message);

      setEnteredMarks(res.data.data);

      reset();

    } catch (error) {
      alert(error?.response?.data?.message || "Error Entering Marks");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Enter Exam Marks"
      desc="Faculty can enter marks for students based on subject components"
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* STUDENT ID */}
          <div className="form-field">
            <label className="custom-label">Student ID</label>
            <input
              type="number"
              placeholder="Enter Student ID"
              className="custom-input"
              {...register("student_id", {
                required: "Student ID is required",
                min: {
                  value: 1,
                  message: "Invalid Student ID"
                }
              })}
            />
            {errors.student_id && (
              <p className="custom-error">{errors.student_id.message}</p>
            )}
          </div>

          {/* SUBJECT ID */}
          <div className="form-field">
            <label className="custom-label">Subject ID</label>
            <input
              type="number"
              placeholder="Enter Subject ID"
              className="custom-input"
              {...register("subject_id", {
                required: "Subject ID is required",
                min: {
                  value: 1,
                  message: "Invalid Subject ID"
                }
              })}
            />
            {errors.subject_id && (
              <p className="custom-error">{errors.subject_id.message}</p>
            )}
          </div>

          {/* COMPONENT ID */}
          <div className="form-field">
            <label className="custom-label">Component ID</label>
            <input
              type="number"
              placeholder="Enter Component ID"
              className="custom-input"
              {...register("component_id", {
                required: "Component ID is required",
                min: {
                  value: 1,
                  message: "Invalid Component ID"
                }
              })}
            />
            {errors.component_id && (
              <p className="custom-error">{errors.component_id.message}</p>
            )}
          </div>

          {/* EXAM ID (OPTIONAL – REQUIRED ONLY FOR EXAM TYPE COMPONENT) */}
          <div className="form-field">
            <label className="custom-label">
              Exam ID (Required only for EXAM component)
            </label>
            <input
              type="number"
              placeholder="Enter Exam ID (If applicable)"
              className="custom-input"
              {...register("exam_id")}
            />
          </div>

          {/* MARKS OBTAINED */}
          <div className="form-field">
            <label className="custom-label">Marks Obtained</label>
            <input
              type="number"
              placeholder="Enter Marks"
              className="custom-input"
              {...register("marks_obtained", {
                required: "Marks are required",
                min: {
                  value: 0,
                  message: "Marks cannot be negative"
                }
              })}
            />
            {errors.marks_obtained && (
              <p className="custom-error">{errors.marks_obtained.message}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>

        </form>
      </DashboardChildPageCard>

      {/* SUCCESS CARD */}
      {enteredMarks && (
        <DashboardChildPageCard className="mt-3">

          <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
            Marks Saved Successfully
          </h3>

          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium">Student ID:</span>{" "}
              {enteredMarks.student_id}
            </p>
            <p>
              <span className="font-medium">Subject ID:</span>{" "}
              {enteredMarks.subject_id}
            </p>
            <p>
              <span className="font-medium">Component ID:</span>{" "}
              {enteredMarks.component_id}
            </p>
            {enteredMarks.exam_id && (
              <p>
                <span className="font-medium">Exam ID:</span>{" "}
                {enteredMarks.exam_id}
              </p>
            )}
            <p>
              <span className="font-medium">Marks:</span>{" "}
              {enteredMarks.marks_obtained}
            </p>
          </div>

        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default EnterExamMarksFaculty;