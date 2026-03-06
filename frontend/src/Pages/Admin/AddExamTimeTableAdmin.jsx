import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";
import { useEffect } from "react";


const AddExamTimeTableAdmin = () => {

  // Store created timetable entry for success card
  const [createdTimetable, setCreatedTimetable] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [Subjects, setSubjects] = useState([]);
  const [exams , setExams] = useState([]);
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

  // fetch the subejcts for the timetable 
  useEffect(()=>{
    api.get("/api/components/subjects")
    .then((res)=>{
      setSubjects(res.data);
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  useEffect(()=>{
    api.get("/api/exams/current-year-exam")
    .then((res)=>{
      console.log(res);
      setExams(res.data);
    }).catch((error)=>{
      console.log(error);
    })
  },[])
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
        "/api/exam-timetable/",
        {
          exam_id: data.exam_id,
          subject_id: data.subject_id,
          exam_date: data.exam_date,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
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
            <select
              placeholder="Enter Exam ID"
              className="custom-input"
              {...register("exam_id", {
                required: "Exam ID is required",
              })}
            >
              <option value="">Select Exam ID</option>
              {/* In a real app, this would be populated dynamically from the backend */}
              {exams.map((exam)=>(
                <option value={exam.exam_id}>{exam.name} - {exam.exam_id}</option>
              ))}
            </select>
            {errors.exam_id && (
              <p className="custom-error">{errors.exam_id.message}</p>
            )}
          </div>

          {/* SUBJECT ID */}
          <div className="form-field">
            <label className="custom-label">Subject ID</label>
            <select
              placeholder="Enter Subject ID"
              className="custom-input"
              {...register("subject_id", {
                required: "Subject ID is required",
              })}
            >
              <option value="">Select Subject ID</option>
              {/* In a real app, this would be populated dynamically from the backend */}
            
               {Subjects.map((subject)=>(
              <option value={subject.subject_id}>{subject.subject_name} - {subject.subject_id}</option>
             ))}
            </select>
            {errors.subject_id && (
              <p className="custom-error">{errors.subject_id.message}</p>
            )}
          </div>

          {/* EXAM DATE */}
          <div className="form-field">
            <label className="custom-label">Exam Date</label>
            <input
              type="date"
              min={today}
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