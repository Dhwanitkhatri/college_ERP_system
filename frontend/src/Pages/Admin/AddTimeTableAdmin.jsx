import React from "react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";

const AddTimetableAdmin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Timetable Data:", data);
    //ahiya api call karvi
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
              <option value="bca_sem5">BCA Sem 5</option>
              <option value="bca_sem6">BCA Sem 6</option>
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
              <option value="stqa">STQA</option>
              <option value="cc">CC</option>
              <option value="iot">IOT</option>
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
              <option value="aayush">Aayush</option>
              <option value="jiken">Jiken</option>
              <option value="dhwanit">Dhwanit</option>
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
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
            </select>
            {errors.day && <p className="custom-error">{errors.day.message}</p>}
          </div>

          {/* Button nu kaam kaaj*/}
          <div className="form-actions">
            <AddButton type="submit" />
            <CancelButton type="button" />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default AddTimetableAdmin;
