import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { useEffect,useState } from "react";
import { Save } from "lucide-react";
import api  from "../../api/axios.js"

export default function CreateEventAdmin() {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const token = localStorage.getItem("token");
  
  const onSubmit = (data) => {
    console.log(data);

    api.post("api/event/",{
      category :data.category,
      title : data.title,
      description:data.description,
      location : data.location,
      event_time : data.time,
      event_date : data.date,
      attendees:data.attendees
    },{
      headers:{Authorization:`Bearer ${token}`}
    }).then((res)=>{
      alert("event created");
    }).catch((errors)=>{
      console.log(errors);
      alert("not created");
    })
  };
 
  return (
    <DashboardChildPageTemplate
      title="Create Event"
      desc="Create and schedule new college events"
      width="max-w-6xl"
    >
      <div className="pb-20">
        {/* form onsubmit is here */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DashboardChildPageCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* this is the event title part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Event Title</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="Enter event title"
                  {...register("title", {
                    required: "Event title is required",
                  })}
                />
                {errors.title && (
                  <p className="custom-error">{errors.title.message}</p>
                )}
              </div>

              {/* this is the event category part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Category</label>
                <select
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  defaultValue=""
                  {...register("category", { required: "Select a category" })}
                >
                  <option value="">Select Category</option>
                  <option value="academic">Academic</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                </select>
                {errors.category && (
                  <p className="custom-error">{errors.category.message}</p>
                )}
              </div>

              {/* this is the attendees part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Attendees</label>
                <input
                  type="number"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="0"
                  {...register("attendees", {
                    required: "Enter number of attendees",
                  })}
                />
                {errors.attendees && (
                  <p className="custom-error">{errors.attendees.message}</p>
                )}
              </div>

              {/* this is the event date part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Event Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                    {...register("date", { required: "Date is required" })}
                  />
                </div>
                {errors.date && (
                  <p className="custom-error">{errors.date.message}</p>
                )}
              </div>

              {/* this is the event time part */}
              <div className="col-span-1">
                <label className="custom-label mb-2">Event Time</label>
                <div className="relative">
                  <input
                    type="time"
                    className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                    {...register("time", { required: "Time is required" })}
                  />
                </div>
                {errors.time && (
                  <p className="custom-error">{errors.time.message}</p>
                )}
              </div>

              {/* this is the location part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Location</label>
                <input
                  type="text"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  placeholder="Enter event location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <p className="custom-error">{errors.location.message}</p>
                )}
              </div>

              {/*this is the description part */}
              <div className="col-span-1 md:col-span-2">
                <label className="custom-label mb-2">Description</label>
                <textarea
                  rows="4"
                  className="custom-input bg-[var(--bg-primary)] theme-transition resize-none"
                  placeholder="Enter event details..."
                  {...register("description")}
                ></textarea>
              </div>
            </div>
          </DashboardChildPageCard>

          {/* below is the buttons part  */}
          <div className="flex justify-end gap-4 mt-6">
            {/* this is the cancel button part */}
            <CancelButton onClick={() => reset()} />
            {/*this is the create event button */}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 bg-[var(--btn-primary-bg)]
                  text-[var(--btn-primary-text)]"
            >
              <Save size={18} />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </DashboardChildPageTemplate>
  );
}
