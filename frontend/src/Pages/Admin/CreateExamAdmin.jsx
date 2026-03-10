import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const CreateExamAdmin = () => {

  // State to store created exam for success display
  const [createdExam, setCreatedExam] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Cancel button function
  const handleCancel = () => {
    reset();
    setCreatedExam(null);
  };

  // Submit function
  async function onSubmit(data) {
    try {


      const res = await api.post(
        "/api/exams",
        {
          name: data.name,
          exam_type: data.exam_type,
          semester: Number(data.semester),
          academic_year: data.academic_year,
        });

      alert("Exam Created Successfully");

      setCreatedExam(res.data.data);

      reset();

    } catch (error) {
      alert(error?.response?.data?.message || "Error Creating Exam");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Create Exam"
      desc="Create a new exam session (Initial status will be DRAFT)"
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EXAM NAME */}
          <div className="form-field">
            <label className="custom-label">Exam Name</label>
            <input
              type="text"
              placeholder="Enter Exam Name (e.g. Winter 2025 Midterm)"
              className="custom-input"
              {...register("name", {
                required: "Exam name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed",
                },
              })}
            />
            {errors.name && (
              <p className="custom-error">{errors.name.message}</p>
            )}
          </div>

          {/* EXAM TYPE */}
          <div className="form-field">
            <label className="custom-label">Exam Type</label>
            <select
              className="custom-input"
              {...register("exam_type", {
                required: "Please select exam type",
              })}
            >
              <option value="">Select Exam Type</option>
              <option value="REGULAR">REGULAR</option>
              <option value="RE-EXAM">RE-EXAM</option>
            </select>
            {errors.exam_type && (
              <p className="custom-error">{errors.exam_type.message}</p>
            )}
          </div>

          {/* SEMESTER */}
          <div className="form-field">
            <label className="custom-label">Semester</label>
            <select
              placeholder="Enter Semester (1-8)"
              className="custom-input"
              {...register("semester", {
                required: "Semester is required"
              })}
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* ACADEMIC YEAR */}
          <div className="form-field">
            <label className="custom-label">Academic Year</label>
            <select
              placeholder="Enter Academic Year (e.g. 2025-2026)"
              className="custom-input"
              {...register("academic_year", {
                required: "Academic year is required",
              })}
            >
              <option value="">Select Academic Year</option>
              {/* In a real app, this would be populated dynamically from the backend */}
              <option value="2024-25">2024-2025</option>
              <option value="2025-26">2025-2026</option>
            </select>
            {errors.academic_year && (
              <p className="custom-error">{errors.academic_year.message}</p>
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
      {createdExam && (
        <DashboardChildPageCard className="mt-3">
          <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
            Exam Created Successfully
          </h3>

          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium">Exam Name:</span> {createdExam.name}
            </p>
            <p>
              <span className="font-medium">Exam Type:</span> {createdExam.exam_type}
            </p>
            <p>
              <span className="font-medium">Semester:</span> {createdExam.semester}
            </p>
            <p>
              <span className="font-medium">Academic Year:</span> {createdExam.academic_year}
            </p>
            <p>
              <span className="font-medium">Status:</span> {createdExam.status}
            </p>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default CreateExamAdmin;