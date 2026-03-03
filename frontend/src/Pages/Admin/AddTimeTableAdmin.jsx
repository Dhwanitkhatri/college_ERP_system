import React, { use } from "react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import api from "../../api/axios.js";
import { useEffect, useState } from "react";
import { Watch } from "react-hook-form";

const AddTimetableAdmin = () => {
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

  const selectedClass = watch("class");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // api to fetch classes for current academic year
  useEffect(() => {
    api
      .get("api/timetables/current-year-classes", )
      .then((response) => {
        setClasses(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  //this is api is use to get the subject as per the selected class
  const [classId, classSemester] = selectedClass
    ? selectedClass.split("|")
    : [null, null];
  console.log("Selected Class ID:", classId);
  useEffect(() => {
    if (selectedClass) {
      api
        .get("api/timetables/subjects", {
          params: {
            semester: classSemester,
          },
        })
        .then((response) => {
          setSubjects(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, [selectedClass]);

  useEffect(() => {
    api
      .get("api/timetables/faculties")
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching faculties:", error);
      });
  }, []);

  const onSubmit = (data) => {
    console.log("Timetable Data:", data);
    console.log("Class ID for submission:", classId);
    api
      .post(
        "api/timetables",
        {
          class_id: classId,
          subject_id: data.subject,
          faculty_id: data.faculty,
          start_time: data.startTime,
          end_time: data.endTime,
          day_of_week: data.day,
        },
      )
      .then((response) => {
        alert("Timetable entry created successfully");
      })
      .catch((error) => {
        console.error("Error creating timetable entry:", error);
        alert(error);
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Add Timetable Entry"
      desc="Schedule a lecture for a specific class"
    >
      <DashboardChildPageCard>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* Class input ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Class</label>
            <select
              className="custom-input"
              {...register("class", { required: "Please select class" })}
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option
                  key={`${cls.id}|${cls.semester}`}
                  value={`${cls.id}|${cls.semester}`}
                >
                  {`${cls.class_id} - Sem ${cls.semester}`}
                </option>
              ))}
            </select>
            {errors.class && (
              <p className="custom-error">{errors.class.message}</p>
            )}
          </div>

          {/* Subject input ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Subject</label>
            <select
              className="custom-input"
              {...register("subject", { required: "Subject is required" })}
            >
              <option value="">Select subject</option>
              {subjects.map((subj) => (
                <option key={subj.subject_id} value={subj.subject_id}>
                  {subj.subject_name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="custom-error">{errors.subject.message}</p>
            )}
          </div>

          {/* Faculty input ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Faculty</label>
            <select
              className="custom-input"
              {...register("faculty", { required: "Faculty is required" })}
            >
              <option value="">Select faculty</option>
              {faculties.map((fac) => (
                <option key={fac.faculty_id} value={fac.faculty_id}>
                  {fac.name}
                </option>
              ))}
            </select>
            {errors.faculty && (
              <p className="custom-error">{errors.faculty.message}</p>
            )}
          </div>

          {/* Start Time input ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Start Time</label>
            <input
              type="time"
              className="custom-input"
              {...register("startTime", {
                required: "Start time is required",
              })}
            />
            {errors.startTime && (
              <p className="custom-error">{errors.startTime.message}</p>
            )}
          </div>

          {/* End Time ipnut ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">End Time</label>
            <input
              type="time"
              className="custom-input"
              {...register("endTime", {
                required: "End time is required",
              })}
            />
            {errors.endTime && (
              <p className="custom-error">{errors.endTime.message}</p>
            )}
          </div>

          {/* Day nu input ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Day</label>
            <select
              className="custom-input"
              {...register("day", { required: "Day is required" })}
            >
              <option value="">Select day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            {errors.day && <p className="custom-error">{errors.day.message}</p>}
          </div>

          {/* Button nu kaam kaaj*/}
          <div className="form-actions">
            <AddButton type="submit" />
            <CancelButton type="button" onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default AddTimetableAdmin;
