import React from "react";
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate.jsx";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { set, useForm } from "react-hook-form";

import api from "../../api/axios.js";

const AddSubjectAdmin = () => {
  const [addedSubject, setAddedSubject] = useState(null)
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

  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const token = localStorage.getItem("token");
  useEffect((async) => {
    api
      .get("/api/faculties/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching faculties:", error);
      });
  }, []);
  async function onSubmit(data) {
    console.log("form data", data);
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        "/api/subjects/",
        {
          subject_id: data.subjectId,
          subject_name: data.subjectName,
          faculty_id: data.facultyId,
          semester: data.semester,
          lecture_per_week: data.lecturePerWeek,
          credit: data.credit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setAddedSubject({
        subject_id: data.subjectId,
        subject_name: data.subjectName,
        faculty_id: data.facultyId,
        semester: data.semester,
        lecture_per_week: data.lecturePerWeek,
        credit: data.credit,
      });
      alert("Subject Added Successfully");
    } catch (error) {
      console.log("Backend error:", error.response?.data);
      alert(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Add New Subject"
      desc="Enter subject details to add it to the system"
    >
      <DashboardChildPageCard>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          {/* this is for the subject id input field*/}
          <div className="CourseDiv form-field">
            <label className="custom-label">Subject Id</label>
            <input
              type="text"
              placeholder="Enter Subject ID"
              className="custom-input"
              {...register("subjectId", {
                required: "Please Fill This Field",
                minLength: {
                  value: 3,
                  message: "Minimum 3 Characters are Required",
                },
                maxLength: {
                  value: 12,
                  message: "Maximum Character Limit is 10",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Only Alphabets and Numbers are Allowed",
                },
              })}
            />
            {errors.subjectId && (
              <p className="custom-error">{errors.subjectId.message}</p>
            )}
          </div>

          {/* // this is for the subject Name input field*/}
          <div className="CourseDiv form-field">
            <label className="custom-label">Subject Name</label>
            <input
              type="text"
              placeholder="Enter Subject Name"
              className="custom-input"
              {...register("subjectName", {
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
            {errors.subjectName && (
              <p className="custom-error">{errors.subjectName.message}</p>
            )}
          </div>

          {/* this is for the faculty Id input field*/}
          <div className="wrapperDiv3 form-field">
            <label className="custom-label">Faculty</label>

            <select
              defaultValue=""
              className="custom-input"
              {...register("facultyId", {
                required: "Please Fill This Field",
              })}
            >
              <option value="" disabled>
                Select Faculty
              </option>
              {faculties.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
            />
          </div>

          {errors.facultyId && (
            <p className="custom-error">{errors.facultyId.message}</p>
          )}
          {/* this is for the semester input field*/}
          <div className="CourseDiv form-field">
            <label className="custom-label">Semester</label>
            <input
              type="number"
              placeholder="Enter Semester"
              className="custom-input"
              {...register("semester", {
                required: "Please Fill This Field",
                min: { value: 1, message: "Minimum semester is 1" },
                max: { value: 8, message: "Maximum semester is 8" },
              })}
            />
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* this is for the lecture per week input field*/}
          <div className="CourseDiv form-field">
            <label className="custom-label">Lectures Per Week</label>
            <input
              type="number"
              placeholder="Enter Lectures Per Week"
              className="custom-input"
              {...register("lecturePerWeek", {
                required: "Please Fill This Field",
                min: { value: 1, message: "Minimum lecture per week is 1" },
                max: { value: 7, message: "Maximum lecture per week is 7" },
              })}
            />
            {errors.lecturePerWeek && (
              <p className="custom-error">{errors.lecturePerWeek.message}</p>
            )}
          </div>

          {/* this is for the credit input field*/}
          <div className="CourseDiv form-field">
            <label className="custom-label">Credit</label>
            <input
              type="number"
              min={1}
              max={4}
              step={1}
              placeholder="Enter Credit"
              className="custom-input"
              {...register("credit", {
                required: "Please Fill This Field",
                min: { value: 1, message: "Minimum credit is 1" },
                max: { value: 4, message: "Maximum credit is 4" },
              })}
            />
            {errors.credit && (
              <p className="custom-error">{errors.credit.message}</p>
            )}
          </div>

          <div className="buttonDiv flex items-center gap-3 pt-4">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
      {addedSubject && (
        <DashboardChildPageCard className="mt-3">
          <h2 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Subject Added Successfully!</h2>
          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium">Subject ID:</span> {addedSubject.subject_id}
            </p>
            <p>
              <span className="font-medium">Subject Name:</span> {addedSubject.subject_name}
            </p>
            <p>
              <span className="font-medium">Faculty ID:</span> {addedSubject.faculty_id}
            </p>
            <p>
              <span className="font-medium">Semester:</span> {addedSubject.semester}
            </p>
            <p>
              <span className="font-medium">Lectures Per Week:</span> {addedSubject.lecture_per_week}
            </p>
            <p>
              <span className="font-medium">Credit:</span> {addedSubject.credit}
            </p>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default AddSubjectAdmin;
