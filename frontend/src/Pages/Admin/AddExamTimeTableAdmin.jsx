import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const AddExamTimeTableAdmin = () => {

  // Store created timetable entry for success card
  const [createdTimetable, setCreatedTimetable] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch start_time for validation
  const startTime = watch("start_time");

  // Cancel handler
  const handleCancel = () => {
    reset();
    setCreatedTimetable(null);
  };

  // Submit handler
  async function onSubmit(data) {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/exam-timetable",
        {
          exam_id: Number(data.exam_id),
          subject_id: Number(data.subject_id),
          exam_date: data.exam_date,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Timetable Added Successfully");

      setCreatedTimetable(res.data.data);

      reset();

    } catch (error) {
      alert(error?.response?.data?.message || "Error Adding Timetable");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Add Exam TimeTable"
      desc="Assign subjects to an exam with date and time"
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EXAM ID */}
          <div className="form-field">
            <label className="custom-label">Exam ID</label>
            <input
              type="number"
              placeholder="Enter Exam ID"
              className="custom-input"
              {...register("exam_id", {
                required: "Exam ID is required",
              })}
            />
            {errors.exam_id && (
              <p className="custom-error">{errors.exam_id.message}</p>
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
              })}
            />
            {errors.subject_id && (
              <p className="custom-error">{errors.subject_id.message}</p>
            )}
          </div>

          {/* EXAM DATE */}
          <div className="form-field">
            <label className="custom-label">Exam Date</label>
            <input
              type="date"
              className="custom-input"
              {...register("exam_date", {
                required: "Exam date is required",
              })}
            />
            {errors.exam_date && (
              <p className="custom-error">{errors.exam_date.message}</p>
            )}
          </div>

          {/* START TIME */}
          <div className="form-field">
            <label className="custom-label">Start Time</label>
            <input
              type="time"
              className="custom-input"
              {...register("start_time")}
            />
          </div>

          {/* END TIME */}
          <div className="form-field">
            <label className="custom-label">End Time</label>
            <input
              type="time"
              className="custom-input"
              {...register("end_time", {
                validate: (value) =>
                  !value ||
                  !startTime ||
                  value > startTime ||
                  "End time must be after start time",
              })}
            />
            {errors.end_time && (
              <p className="custom-error">{errors.end_time.message}</p>
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
      {createdTimetable && (
        <DashboardChildPageCard className="mt-3">
          <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
            Timetable Entry Created Successfully
          </h3>

          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium">Exam ID:</span> {createdTimetable.exam_id}
            </p>
            <p>
              <span className="font-medium">Subject ID:</span> {createdTimetable.subject_id}
            </p>
            <p>
              <span className="font-medium">Exam Date:</span> {createdTimetable.exam_date}
            </p>
            <p>
              <span className="font-medium">Start Time:</span> {createdTimetable.start_time || "Not Set"}
            </p>
            <p>
              <span className="font-medium">End Time:</span> {createdTimetable.end_time || "Not Set"}
            </p>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default AddExamTimeTableAdmin;