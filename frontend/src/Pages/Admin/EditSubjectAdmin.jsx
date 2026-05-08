import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import SaveButton from "../../ui/Buttons/SaveButton";
import CancelButton from "../../ui/Buttons/CancelButton";

const EditSubjectAdmin = () => {
  const { subject_id } = useParams(); // get subject id from URL
  const navigate = useNavigate();


  const [subject, setSubject] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch selected subject
  useEffect(() => {
    api
      .get(`/api/subjects/${subject_id}`)
      .then((res) => {
        setSubject(res.data.subject);

        // Pre-fill form
        reset({
          subject_name: res.data.subject.subject_name,
          semester: res.data.subject.semester,
          credit: res.data.subject.credit,
          lecture_per_week: res.data.subject.lecture_per_week,
        });
      })
      .catch((err) => {
        console.error(
          "Error fetching subject:",
          err.response?.data || err.message
        );
      });
  }, [subject_id, reset]);

  // Update Subject
  const onSubmit = (data) => {
    api
      .put(
        `/api/subjects/${subject_id}`,
        {
          subject_name: data.subject_name,
          semester: data.semester,
          credit: data.credit,
          lecture_per_week: data.lecture_per_week,
        }
      )
      .then(() => {
        alert("Subject updated successfully");
        navigate("/admin/Dashboard/ManageSubjectsAdmin");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Update failed");
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Subject"
      desc="Update Subject Information"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Subject Name */}
          <div className="form-field">
            <label className="custom-label">Subject Name</label>
            <input
              type="text"
              placeholder="Enter Subject Name"
              className="custom-input"
              {...register("subject_name", {
                required: "Subject name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
            />
            {errors.subject_name && (
              <p className="custom-error">
                {errors.subject_name.message}
              </p>
            )}
          </div>

          {/* Semester */}
          <div className="form-field">
            <label className="custom-label">Semester</label>
            <select
              className="custom-input"
              {...register("semester", {
                required: "Semester is required",
              })}
            >
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* Credits */}
          <div className="form-field">
            <label className="custom-label">Credits</label>
            <input
              type="number"
              placeholder="Enter Credits"
              className="custom-input"
              {...register("credit", {
                required: "Credit is required",
                min: { value: 1, message: "Minimum credit is 1" },
              })}
            />
            {errors.credit && (
              <p className="custom-error">{errors.credit.message}</p>
            )}
          </div>

          {/* Lectures Per Week */}
          <div className="form-field">
            <label className="custom-label">Lectures Per Week</label>
            <input
              type="number"
              placeholder="Enter Lectures Per Week"
              className="custom-input"
              {...register("lecture_per_week", {
                required: "Lectures per week required",
                min: { value: 1, message: "Minimum 1 lecture required" },
              })}
            />
            {errors.lecture_per_week && (
              <p className="custom-error">
                {errors.lecture_per_week.message}
              </p>
            )}
          </div>

          {/* Subject ID (Disabled) */}
          <div className="form-field">
            <label className="custom-label">Subject ID</label>
            <input
              type="text"
              disabled
              value={subject?.subject_id || ""}
              className="custom-input cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <SaveButton />
            <CancelButton
              onClick={() =>
                navigate("/admin/Dashboard/ManageSubjectsAdmin")
              }
            />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default EditSubjectAdmin;